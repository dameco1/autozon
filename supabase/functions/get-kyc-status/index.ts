import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const serviceClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Get latest KYC verification for this user
    const { data: verification, error: verError } = await serviceClient
      .from("kyc_verifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (verError) {
      console.error("DB error:", verError);
      return new Response(JSON.stringify({ error: "Failed to fetch status" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!verification || !verification.didit_session_id) {
      return new Response(JSON.stringify({ status: "none" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // If still in_progress, poll Didit API directly
    if (verification.status === "in_progress" || verification.status === "pending") {
      const DIDIT_API_KEY = Deno.env.get("DIDIT_API_KEY");
      if (DIDIT_API_KEY) {
        try {
          const diditRes = await fetch(
            `https://verification.didit.me/v3/session/${verification.didit_session_id}/decision/`,
            {
              headers: { "x-api-key": DIDIT_API_KEY },
            }
          );

          if (diditRes.ok) {
            const diditData = await diditRes.json();
            const diditStatus = diditData.status;

            const statusMap: Record<string, string> = {
              "Approved": "approved",
              "Declined": "declined",
              "In Review": "pending_review",
              "In Progress": "in_progress",
              "Abandoned": "abandoned",
              "Expired": "expired",
            };
            const mappedStatus = statusMap[diditStatus] || verification.status;

            if (mappedStatus !== verification.status) {
              // Update DB
              await serviceClient
                .from("kyc_verifications")
                .update({ status: mappedStatus, decision_json: diditData.decision || null })
                .eq("id", verification.id);

              // Update profile
              const profileKycStatus = mappedStatus === "approved" ? "verified" :
                mappedStatus === "declined" ? "declined" : "pending";

              await serviceClient
                .from("profiles")
                .update({ kyc_status: profileKycStatus })
                .eq("user_id", user.id);

              // Update transaction if linked
              if (verification.transaction_id && verification.role) {
                const col = verification.role === "buyer" ? "buyer_kyc_status" : "seller_kyc_status";
                await serviceClient
                  .from("transactions")
                  .update({ [col]: mappedStatus })
                  .eq("id", verification.transaction_id);
              }

              console.log(`KYC poll: session=${verification.didit_session_id}, updated to ${mappedStatus}`);

              return new Response(JSON.stringify({ status: mappedStatus }), {
                status: 200,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
              });
            }
          } else {
            console.error("Didit API error:", await diditRes.text());
          }
        } catch (e) {
          console.error("Didit poll error:", e);
        }
      }
    }

    return new Response(JSON.stringify({ status: verification.status }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("get-kyc-status error:", err);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
