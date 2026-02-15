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

    if (action === "suspend_user") {
      const { target_user_id, suspended, suspension_type } = params;
      if (!target_user_id) throw new Error("target_user_id required");

      // Update profile
      await supabaseAdmin
        .from("profiles")
        .update({ suspended, suspension_type: suspended ? (suspension_type || "soft") : null })
        .eq("user_id", target_user_id);

      // Hard suspension: disable/enable auth user
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

      // Get the user to find their email
      // If target_email is a user_id, look up their email
      let email = target_email;
      if (!target_email.includes("@")) {
        const { data: userData } = await supabaseAdmin.auth.admin.getUserById(target_email);
        if (!userData?.user?.email) throw new Error("User not found");
        email = userData.user.email;
      }

      // Send password reset via the Supabase auth API
      const { error: resetError } = await supabaseAdmin.auth.admin.generateLink({
        type: "recovery",
        email,
      });
      if (resetError) throw resetError;

      return new Response(JSON.stringify({ success: true, message: `Reset email sent to ${email}` }), {
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
