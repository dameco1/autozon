import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version, stripe-signature",
};

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

    if (session.payment_status === "paid" && session.metadata?.car_id) {
      const carId = session.metadata.car_id;
      const userId = session.metadata.user_id;

      console.log(`[STRIPE-WEBHOOK] Payment confirmed for car ${carId}, user ${userId}`);

      const supabase = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
        { auth: { persistSession: false } },
      );

      // Fetch car details for notification message
      const [updateResult, carResult] = await Promise.all([
        supabase.from("cars").update({ placement_paid: true }).eq("id", carId),
        supabase.from("cars").select("make, model, year").eq("id", carId).single(),
      ]);

      if (updateResult.error) {
        console.error(`[STRIPE-WEBHOOK] DB update failed:`, updateResult.error);
        return new Response("DB update failed", { status: 500 });
      }

      console.log(`[STRIPE-WEBHOOK] Car ${carId} placement_paid set to true`);

      // Create notification for the seller
      if (userId) {
        const carLabel = carResult.data
          ? `${carResult.data.year} ${carResult.data.make} ${carResult.data.model}`
          : "Your car";

        const { error: notifError } = await supabase.from("notifications").insert({
          user_id: userId,
          title: "Placement Confirmed ✅",
          message: `Payment received — ${carLabel} is now live and visible to matched buyers.`,
          type: "payment",
          link: `/buyer-matches/${carId}`,
        });

        if (notifError) {
          console.error(`[STRIPE-WEBHOOK] Notification insert failed:`, notifError);
        } else {
          console.log(`[STRIPE-WEBHOOK] Notification created for user ${userId}`);
        }
      }
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status: 200,
  });
});
