import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
    );

    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    if (userError || !userData.user) throw new Error("Not authenticated");

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    // Find Stripe customer
    const customers = await stripe.customers.list({
      email: userData.user.email!,
      limit: 1,
    });

    if (customers.data.length === 0) {
      return new Response(JSON.stringify({ receipts: [] }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const customerId = customers.data[0].id;

    // Get completed checkout sessions for this customer
    const sessions = await stripe.checkout.sessions.list({
      customer: customerId,
      status: "complete",
      limit: 50,
    });

    // Filter to placement sessions and get payment intents for receipts
    const placementSessions = sessions.data.filter(
      (s) => s.metadata?.car_id && s.payment_status === "paid"
    );

    const receipts = [];

    for (const session of placementSessions) {
      let receiptUrl: string | null = null;
      let invoiceUrl: string | null = null;
      let amountPaid = session.amount_total ? session.amount_total / 100 : 0;
      let currency = session.currency || "eur";

      // Get receipt URL from the payment intent's charge
      if (session.payment_intent && typeof session.payment_intent === "string") {
        try {
          const pi = await stripe.paymentIntents.retrieve(session.payment_intent);
          if (pi.latest_charge && typeof pi.latest_charge === "string") {
            const charge = await stripe.charges.retrieve(pi.latest_charge);
            receiptUrl = charge.receipt_url || null;
          }
        } catch (_e) {
          // Skip if charge retrieval fails
        }
      }

      // Get invoice URL if there's an invoice
      if (session.invoice && typeof session.invoice === "string") {
        try {
          const invoice = await stripe.invoices.retrieve(session.invoice);
          invoiceUrl = invoice.hosted_invoice_url || null;
        } catch (_e) {
          // Skip
        }
      }

      receipts.push({
        id: session.id,
        carId: session.metadata?.car_id || null,
        amountPaid,
        currency,
        paidAt: session.created ? new Date(session.created * 1000).toISOString() : null,
        receiptUrl,
        invoiceUrl,
      });
    }

    return new Response(JSON.stringify({ receipts }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Get receipts error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
