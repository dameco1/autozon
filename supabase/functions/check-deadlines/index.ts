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

  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    // Find all overdue transactions using the DB function
    const { data: overdue, error } = await supabaseAdmin.rpc("find_overdue_transactions");
    if (error) throw error;
    if (!overdue || overdue.length === 0) {
      return new Response(JSON.stringify({ processed: 0, message: "No overdue transactions" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const results: any[] = [];
    const GRACE_HOURS = 24;

    for (const tx of overdue) {
      // Case 1: Transaction not yet in grace period → start it
      if (tx.status === "completed" && !tx.grace_period_started_at) {
        await supabaseAdmin
          .from("transactions")
          .update({
            status: "grace_period",
            grace_period_started_at: new Date().toISOString(),
          })
          .eq("id", tx.transaction_id);

        // Notify both parties
        const notifs = [
          {
            user_id: tx.buyer_id,
            title: "⚠️ Deadline Missed — Action Required",
            message: `A step in your ownership transfer is overdue (${tx.overdue_step.replace(/_/g, " ")}). You have 24 hours to complete it or the transaction may be cancelled. Contact Autozon support if you need assistance.`,
            type: "warning",
            link: `/acquire/${tx.transaction_id}`,
          },
          {
            user_id: tx.seller_id,
            title: "⚠️ Buyer Deadline Missed",
            message: `The buyer has missed a deadline (${tx.overdue_step.replace(/_/g, " ")}). Autozon support is reviewing the situation. If unresolved within 24 hours, the transaction will be flagged for cancellation.`,
            type: "warning",
            link: `/acquire/${tx.transaction_id}`,
          },
        ];
        await supabaseAdmin.from("notifications").insert(notifs);

        results.push({ transaction_id: tx.transaction_id, action: "grace_period_started" });
      }

      // Case 2: Grace period expired → flag for admin confirmation
      if (tx.status === "grace_period" && tx.grace_period_started_at) {
        const graceExpiry = new Date(tx.grace_period_started_at).getTime() + GRACE_HOURS * 60 * 60 * 1000;
        if (Date.now() >= graceExpiry) {
          await supabaseAdmin
            .from("transactions")
            .update({ status: "cancellation_pending" })
            .eq("id", tx.transaction_id);

          // Notify admin(s)
          const { data: admins } = await supabaseAdmin
            .from("user_roles")
            .select("user_id")
            .eq("role", "admin");

          if (admins && admins.length > 0) {
            const adminNotifs = admins.map((a: any) => ({
              user_id: a.user_id,
              title: "🚨 Transaction Cancellation Pending",
              message: `Transaction ${tx.transaction_id.slice(0, 8)}… has an expired grace period. Buyer failed to complete "${tx.overdue_step.replace(/_/g, " ")}". Admin confirmation required to proceed with cancellation and refund.`,
              type: "admin",
              link: `/admin`,
            }));
            await supabaseAdmin.from("notifications").insert(adminNotifs);
          }

          results.push({ transaction_id: tx.transaction_id, action: "cancellation_pending" });
        }
      }
    }

    return new Response(JSON.stringify({ processed: results.length, results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
