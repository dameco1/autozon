import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-signature-v2",
};

async function verifySignature(rawBody: string, signature: string, secret: string): Promise<boolean> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(rawBody));
  const computed = Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, "0")).join("");
  return computed === signature;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const WEBHOOK_SECRET = Deno.env.get("DIDIT_WEBHOOK_SECRET");
    if (!WEBHOOK_SECRET) {
      console.error("DIDIT_WEBHOOK_SECRET not set");
      return new Response("Server error", { status: 500, headers: corsHeaders });
    }

    const rawBody = await req.text();
    const signature = req.headers.get("x-signature-v2") || req.headers.get("X-Signature-V2") || "";

    if (signature) {
      const valid = await verifySignature(rawBody, signature, WEBHOOK_SECRET);
      if (!valid) {
        console.error("Invalid webhook signature");
        return new Response("Unauthorized", { status: 401, headers: corsHeaders });
      }
    }

    const payload = JSON.parse(rawBody);
    const { session_id, status, vendor_data, decision } = payload;

    if (!session_id || !status) {
      return new Response("Missing fields", { status: 400, headers: corsHeaders });
    }

    // Parse vendor_data: "userId|transactionId|role"
    const parts = (vendor_data || "").split("|");
    const userId = parts[0] || null;
    const transactionId = parts[1] || null;
    const role = parts[2] || null;

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Map Didit status to our status
    const statusMap: Record<string, string> = {
      "Approved": "approved",
      "Declined": "declined",
      "In Review": "pending_review",
      "In Progress": "in_progress",
      "Abandoned": "abandoned",
      "Expired": "expired",
    };
    const mappedStatus = statusMap[status] || "pending";

    // Update kyc_verifications
    await supabase
      .from("kyc_verifications")
      .update({
        status: mappedStatus,
        decision_json: decision || null,
      })
      .eq("didit_session_id", session_id);

    // Update profile kyc_status
    if (userId) {
      const profileKycStatus = mappedStatus === "approved" ? "verified" :
        mappedStatus === "declined" ? "declined" :
        mappedStatus === "pending_review" ? "pending" :
        "pending";

      await supabase
        .from("profiles")
        .update({ kyc_status: profileKycStatus })
        .eq("user_id", userId);
    }

    // Update transaction KYC status if linked
    if (transactionId && role) {
      const col = role === "buyer" ? "buyer_kyc_status" : "seller_kyc_status";
      await supabase
        .from("transactions")
        .update({ [col]: mappedStatus })
        .eq("id", transactionId);
    }

    console.log(`KYC webhook: session=${session_id}, status=${status}, user=${userId}`);

    return new Response("OK", { status: 200, headers: corsHeaders });
  } catch (err) {
    console.error("Webhook error:", err);
    return new Response("Internal error", { status: 500, headers: corsHeaders });
  }
});
