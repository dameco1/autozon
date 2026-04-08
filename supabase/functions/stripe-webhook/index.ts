import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version, stripe-signature",
};

function formatEur(cents: number): string {
  return `€${(cents / 100).toFixed(2).replace(".", ",")}`;
}

function formatDate(date: Date): string {
  return `${String(date.getDate()).padStart(2, "0")}.${String(date.getMonth() + 1).padStart(2, "0")}.${date.getFullYear()}`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
    apiVersion: "2025-08-27.basil",
  });

  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET not configured");
    return new Response("Webhook secret not configured", { status: 500 });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return new Response("No signature", { status: 400 });
  }

  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  console.log(`[STRIPE-WEBHOOK] Received event: ${event.type}`);

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    if (session.payment_status !== "paid") {
      return new Response(JSON.stringify({ received: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } },
    );

    const paymentType = session.metadata?.payment_type;
    const customerEmail = session.customer_details?.email || session.customer_email;
    const now = formatDate(new Date());

    // ── Placement payment ──
    if (session.metadata?.car_id && !paymentType) {
      const carId = session.metadata.car_id;
      const userId = session.metadata.user_id;

      console.log(`[STRIPE-WEBHOOK] Placement payment for car ${carId}, user ${userId}`);

      const [updateResult, carResult] = await Promise.all([
        supabase.from("cars").update({ placement_paid: true }).eq("id", carId),
        supabase.from("cars").select("make, model, year").eq("id", carId).single(),
      ]);

      if (updateResult.error) {
        console.error(`[STRIPE-WEBHOOK] DB update failed:`, updateResult.error);
        return new Response("DB update failed", { status: 500 });
      }

      console.log(`[STRIPE-WEBHOOK] Car ${carId} placement_paid set to true`);

      const carLabel = carResult.data
        ? `${carResult.data.year} ${carResult.data.make} ${carResult.data.model}`
        : "Your car";

      // Notification
      if (userId) {
        await supabase.from("notifications").insert({
          user_id: userId,
          title: "Placement Confirmed ✅",
          message: `Payment received — ${carLabel} is now live and visible to matched buyers.`,
          type: "payment",
          link: `/buyer-matches/${carId}`,
        });
      }

      // Receipt email
      if (customerEmail) {
        const amountTotal = session.amount_total;
        await supabase.functions.invoke("send-transactional-email", {
          body: {
            templateName: "placement-receipt",
            recipientEmail: customerEmail,
            idempotencyKey: `placement-receipt-${session.id}`,
            templateData: {
              carTitle: carLabel,
              amount: amountTotal ? formatEur(amountTotal) : "–",
              date: now,
            },
          },
        });
        console.log(`[STRIPE-WEBHOOK] Placement receipt sent to ${customerEmail}`);
      }
    }

    // ── Car purchase payment ──
    if (paymentType === "car_purchase") {
      const transactionId = session.metadata?.transaction_id;
      const carId = session.metadata?.car_id;
      const userId = session.metadata?.user_id;
      const agreedPrice = session.metadata?.agreed_price;

      console.log(`[STRIPE-WEBHOOK] Car purchase payment for transaction ${transactionId}`);

      // Update transaction
      if (transactionId) {
        const { error: txError } = await supabase
          .from("transactions")
          .update({
            payment_confirmed: true,
            stripe_payment_intent_id: session.payment_intent as string,
          })
          .eq("id", transactionId);

        if (txError) {
          console.error(`[STRIPE-WEBHOOK] Transaction update failed:`, txError);
        }
      }

      // Fetch car details
      let carLabel = "Fahrzeug";
      if (carId) {
        const { data: carData } = await supabase
          .from("cars")
          .select("make, model, year")
          .eq("id", carId)
          .single();
        if (carData) {
          carLabel = `${carData.year} ${carData.make} ${carData.model}`;
        }
      }

      // Notification
      if (userId) {
        await supabase.from("notifications").insert({
          user_id: userId,
          title: "Zahlung bestätigt ✅",
          message: `Deine Zahlung für ${carLabel} wurde bestätigt. Weiter zur Eigentumsübertragung.`,
          type: "payment",
          link: transactionId ? `/acquire/${transactionId}` : "/dashboard",
        });
      }

      // Receipt email
      if (customerEmail) {
        const amountTotal = session.amount_total;
        const agreedPriceCents = agreedPrice ? Math.round(Number(agreedPrice) * 100) : null;
        const feesCents = amountTotal && agreedPriceCents ? amountTotal - agreedPriceCents : null;

        await supabase.functions.invoke("send-transactional-email", {
          body: {
            templateName: "car-purchase-receipt",
            recipientEmail: customerEmail,
            idempotencyKey: `car-purchase-receipt-${session.id}`,
            templateData: {
              carTitle: carLabel,
              agreedPrice: agreedPriceCents ? formatEur(agreedPriceCents) : "–",
              fees: feesCents ? formatEur(feesCents) : "–",
              totalAmount: amountTotal ? formatEur(amountTotal) : "–",
              date: now,
              transactionId: transactionId ? transactionId.slice(0, 8) : undefined,
            },
          },
        });
        console.log(`[STRIPE-WEBHOOK] Car purchase receipt sent to ${customerEmail}`);
      }
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status: 200,
  });
});
