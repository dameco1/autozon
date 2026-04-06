import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";
import Stripe from "https://esm.sh/stripe@18.5.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Verify caller is admin
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authErr } = await supabaseAdmin.auth.getUser(token);
    if (authErr || !user) throw new Error("Unauthorized");

    const { data: roleData } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();
    if (!roleData) throw new Error("Forbidden: admin role required");

    const { action, ...params } = await req.json();

    if (action === "get_user_details") {
      const { target_user_id } = params;
      if (!target_user_id) throw new Error("target_user_id required");

      const { data: userData, error: userErr } = await supabaseAdmin.auth.admin.getUserById(target_user_id);
      if (userErr || !userData?.user) throw new Error("User not found");

      return new Response(JSON.stringify({
        email: userData.user.email,
        last_sign_in_at: userData.user.last_sign_in_at,
        created_at: userData.user.created_at,
        phone: userData.user.phone,
        email_confirmed_at: userData.user.email_confirmed_at,
        confirmed_at: userData.user.confirmed_at,
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "suspend_user") {
      const { target_user_id, suspended, suspension_type } = params;
      if (!target_user_id) throw new Error("target_user_id required");

      await supabaseAdmin
        .from("profiles")
        .update({ suspended, suspension_type: suspended ? (suspension_type || "soft") : null })
        .eq("user_id", target_user_id);

      if (suspension_type === "hard" && suspended) {
        await supabaseAdmin.auth.admin.updateUserById(target_user_id, { ban_duration: "876000h" });
      } else if (!suspended) {
        await supabaseAdmin.auth.admin.updateUserById(target_user_id, { ban_duration: "none" });
      }

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "reset_password") {
      const { target_email } = params;
      if (!target_email) throw new Error("target_email required");

      let email = target_email;
      if (!target_email.includes("@")) {
        const { data: userData } = await supabaseAdmin.auth.admin.getUserById(target_email);
        if (!userData?.user?.email) throw new Error("User not found");
        email = userData.user.email;
      }

      const { error: resetError } = await supabaseAdmin.auth.admin.generateLink({
        type: "recovery",
        email,
      });
      if (resetError) throw resetError;

      return new Response(JSON.stringify({ success: true, message: `Reset email sent to ${email}` }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "resend_invoice") {
      const { transaction_id, target_user_id } = params;
      if (!transaction_id || !target_user_id) throw new Error("transaction_id and target_user_id required");

      const { data: tx, error: txErr } = await supabaseAdmin
        .from("transactions")
        .select("*")
        .eq("id", transaction_id)
        .single();
      if (txErr || !tx) throw new Error("Transaction not found");

      const { data: buyerAuth } = await supabaseAdmin.auth.admin.getUserById(target_user_id);
      if (!buyerAuth?.user?.email) throw new Error("Buyer not found");

      const { data: car } = await supabaseAdmin
        .from("cars")
        .select("make, model, year")
        .eq("id", tx.car_id)
        .single();

      const carLabel = car ? `${car.year} ${car.make} ${car.model}` : "Vehicle";

      await supabaseAdmin.from("notifications").insert({
        user_id: target_user_id,
        title: "Transaction Invoice",
        message: `Invoice for ${carLabel} — Agreed price: €${Number(tx.agreed_price).toLocaleString()}. Status: ${tx.status}. Payment: ${tx.payment_confirmed ? "Confirmed" : "Pending"}.`,
        type: "invoice",
        link: `/acquire/${tx.offer_id}`,
      });

      return new Response(JSON.stringify({ success: true, message: `Invoice notification sent to ${buyerAuth.user.email}` }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "cancel_transaction") {
      const { transaction_id } = params;
      if (!transaction_id) throw new Error("transaction_id required");

      const { data: tx, error: txErr } = await supabaseAdmin
        .from("transactions")
        .select("*")
        .eq("id", transaction_id)
        .single();
      if (txErr || !tx) throw new Error("Transaction not found");

      if (!["grace_period", "cancellation_pending", "completed"].includes(tx.status)) {
        throw new Error(`Cannot cancel transaction in status: ${tx.status}`);
      }

      let refundResult: any = null;

      // Handle Stripe refund for card payments
      if (tx.payment_method === "card" && tx.stripe_payment_intent_id) {
        const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
          apiVersion: "2025-08-27.basil",
        });

        // Get the payment intent to find the fee
        const paymentIntent = await stripe.paymentIntents.retrieve(tx.stripe_payment_intent_id, {
          expand: ["latest_charge"],
        });

        const charge = paymentIntent.latest_charge as Stripe.Charge;
        const totalAmount = paymentIntent.amount; // in cents
        const stripeFee = charge?.balance_transaction
          ? 0 // we'll calculate below
          : Math.round(totalAmount * 0.029 + 30); // estimate: 2.9% + 30c

        // If we have balance transaction, get exact fee
        let actualFee = stripeFee;
        if (charge?.balance_transaction && typeof charge.balance_transaction === "string") {
          const bt = await stripe.balanceTransactions.retrieve(charge.balance_transaction);
          actualFee = bt.fee;
        }

        // Buyer gets: total paid - half of Stripe fee
        const halfFee = Math.ceil(actualFee / 2);
        const refundAmount = totalAmount - halfFee;

        const refund = await stripe.refunds.create({
          payment_intent: tx.stripe_payment_intent_id,
          amount: refundAmount,
          reason: "requested_by_customer",
        });

        refundResult = {
          refund_id: refund.id,
          total_paid: totalAmount,
          stripe_fee: actualFee,
          buyer_bears: halfFee,
          seller_bears: halfFee,
          refunded_amount: refundAmount,
        };
      }

      // Update transaction status
      await supabaseAdmin
        .from("transactions")
        .update({
          status: "not_completed",
          cancellation_reason: "deadline_expired",
        })
        .eq("id", transaction_id);

      // Put car back on sale
      await supabaseAdmin
        .from("cars")
        .update({ status: "available" })
        .eq("id", tx.car_id);

      // Notify both parties
      const { data: car } = await supabaseAdmin
        .from("cars")
        .select("make, model, year")
        .eq("id", tx.car_id)
        .single();
      const carLabel = car ? `${car.year} ${car.make} ${car.model}` : "Vehicle";

      const buyerMsg = tx.payment_method === "card" && refundResult
        ? `The transaction for ${carLabel} has been cancelled due to missed deadlines. A refund of €${(refundResult.refunded_amount / 100).toFixed(2)} has been issued (original amount minus half of processing fees).`
        : `The transaction for ${carLabel} has been cancelled due to missed deadlines. Please contact your payment provider for refund arrangements.`;

      const sellerMsg = `The transaction for ${carLabel} has been cancelled due to missed ownership transfer deadlines. Your car has been relisted as available.`;

      await supabaseAdmin.from("notifications").insert([
        { user_id: tx.buyer_id, title: "Transaction Cancelled", message: buyerMsg, type: "warning", link: `/dashboard` },
        { user_id: tx.seller_id, title: "Transaction Cancelled — Car Relisted", message: sellerMsg, type: "info", link: `/dashboard` },
      ]);

      return new Response(JSON.stringify({ success: true, refund: refundResult }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    throw new Error(`Unknown action: ${action}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ error: message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
