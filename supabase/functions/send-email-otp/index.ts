import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing authorization" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: userError } = await userClient.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const adminClient = createClient(supabaseUrl, serviceRoleKey);

    // Rate limit: max 5 codes in last 10 minutes
    const { count } = await adminClient
      .from("email_otp")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("created_at", new Date(Date.now() - 10 * 60 * 1000).toISOString());

    if ((count ?? 0) >= 5) {
      return new Response(JSON.stringify({ error: "Too many requests. Please wait a few minutes." }), {
        status: 429,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Invalidate previous unused codes
    await adminClient
      .from("email_otp")
      .update({ verified: true })
      .eq("user_id", user.id)
      .eq("verified", false);

    // Generate 6-digit code
    const code = String(Math.floor(100000 + Math.random() * 900000));

    // Store code
    const { error: insertError } = await adminClient.from("email_otp").insert({
      user_id: user.id,
      code,
      expires_at: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
    });

    if (insertError) {
      console.error("Insert error:", insertError);
      return new Response(JSON.stringify({ error: "Failed to create OTP" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Send OTP email via the email queue
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
        <h2 style="color: #1a1a2e; margin-bottom: 8px;">Your verification code</h2>
        <p style="color: #6b7280; margin-bottom: 24px;">Enter this code to complete your login to Autozon:</p>
        <div style="background: #f3f4f6; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
          <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #1a1a2e; font-family: monospace;">${code}</span>
        </div>
        <p style="color: #9ca3af; font-size: 14px;">This code expires in 5 minutes. If you didn't request this, you can safely ignore this email.</p>
      </div>
    `;

    const messageId = crypto.randomUUID();

    // Enqueue as an auth/security email so it bypasses app-email unsubscribe requirements
    const { error: enqueueError } = await adminClient.rpc("enqueue_email", {
      queue_name: "auth_emails",
      payload: {
        run_id: messageId,
        message_id: messageId,
        to: user.email,
        from: "autozon <noreply@autozon.at>",
        sender_domain: "notify.autozon.at",
        subject: "Your Autozon verification code",
        html: emailHtml,
        text: `Your Autozon verification code is: ${code}. This code expires in 5 minutes.`,
        purpose: "auth",
        label: "otp-verification",
        idempotency_key: messageId,
        queued_at: new Date().toISOString(),
      },
    });

    if (enqueueError) {
      console.error("Enqueue error:", enqueueError);
      // Non-fatal - code is still stored and can be verified
    }

    console.log(`OTP code generated for user ${user.id}`);

    return new Response(JSON.stringify({ success: true, message: "Verification code sent to your email" }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("send-email-otp error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
