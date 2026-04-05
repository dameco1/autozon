import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

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

    throw new Error(`Unknown action: ${action}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ error: message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
