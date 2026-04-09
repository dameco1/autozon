import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const AI_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";
const MODEL = "google/gemini-3-flash-preview";
const MAX_TOOL_ROUNDS = 5;

// ── Tool Definitions ──────────────────────────────────────────────
const tools = [
  {
    type: "function",
    function: {
      name: "search_cars",
      description: "Search available cars on the Autozon marketplace using filters. Use when a buyer is looking for a car.",
      parameters: {
        type: "object",
        properties: {
          budget_max_eur: { type: "number", description: "Maximum budget in EUR" },
          budget_min_eur: { type: "number", description: "Minimum budget in EUR" },
          fuel: { type: "array", items: { type: "string" }, description: "Fuel types: Petrol, Diesel, Electric, Hybrid, Plug-in Hybrid" },
          transmission: { type: "array", items: { type: "string" }, description: "Transmission: Manual, Automatic" },
          body_type: { type: "array", items: { type: "string" }, description: "Body types: Sedan, SUV, Wagon, Hatchback, Coupe, Convertible, Van" },
          make: { type: "array", items: { type: "string" }, description: "Car makes/brands" },
          max_mileage: { type: "number", description: "Maximum mileage in km" },
          min_year: { type: "number", description: "Minimum year" },
        },
        required: [],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "lookup_my_cars",
      description: "Look up the current user's listed cars with status and pricing info. Use when a seller asks about their listings.",
      parameters: { type: "object", properties: {}, required: [] },
    },
  },
  {
    type: "function",
    function: {
      name: "lookup_car_value",
      description: "Look up the fair value and details of a specific car by its ID.",
      parameters: {
        type: "object",
        properties: { car_id: { type: "string", description: "UUID of the car" } },
        required: ["car_id"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "lookup_matches",
      description: "Look up buyer matches for a specific car. Use when a seller asks who is interested in their car.",
      parameters: {
        type: "object",
        properties: { car_id: { type: "string", description: "UUID of the car" } },
        required: ["car_id"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "lookup_offers",
      description: "Look up active offers/negotiations for the current user (as buyer or seller).",
      parameters: { type: "object", properties: {}, required: [] },
    },
  },
  {
    type: "function",
    function: {
      name: "create_support_ticket",
      description: "Create a support ticket or bug report. Use when user reports an issue, bug, or needs help from the team.",
      parameters: {
        type: "object",
        properties: {
          category: { type: "string", enum: ["bug", "question", "feedback", "ux_suggestion"], description: "Type of ticket" },
          subject: { type: "string", description: "Brief subject line" },
          description: { type: "string", description: "Detailed description of the issue" },
          severity: { type: "string", enum: ["low", "medium", "high", "critical"], description: "How severe the issue is" },
        },
        required: ["category", "subject", "description"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "navigate_user",
      description: "Suggest a page or action for the user to navigate to. Returns a link the user can click.",
      parameters: {
        type: "object",
        properties: {
          destination: { type: "string", description: "The route path, e.g. /car-upload, /dashboard, /cars, /negotiate/:id" },
          label: { type: "string", description: "Human-readable label for the link" },
        },
        required: ["destination", "label"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "flag_suspicious",
      description: "Flag suspicious activity for admin review. Use when you detect potential fraud, abuse, or policy violations.",
      parameters: {
        type: "object",
        properties: {
          reason: { type: "string", description: "Why this activity is suspicious" },
          details: { type: "string", description: "Additional context and evidence" },
        },
        required: ["reason"],
      },
    },
  },
];

// ── Tool Executors ────────────────────────────────────────────────
async function executeTool(
  toolName: string,
  args: Record<string, unknown>,
  userId: string,
  pageContext: string | null,
  adminClient: ReturnType<typeof createClient>,
): Promise<unknown> {
  // Log every tool call
  await adminClient.from("agent_activity_log").insert({
    user_id: userId,
    action_type: "tool_call",
    tool_name: toolName,
    details: args,
    page_context: pageContext,
  });

  switch (toolName) {
    case "search_cars": {
      let query = adminClient
        .from("cars_public")
        .select("id, make, model, year, price, fair_value_price, mileage, fuel_type, transmission, body_type, color, image_url, status")
        .eq("status", "available")
        .order("created_at", { ascending: false })
        .limit(10);

      if (args.budget_max_eur) query = query.lte("price", args.budget_max_eur);
      if (args.budget_min_eur) query = query.gte("price", args.budget_min_eur);
      if (args.max_mileage) query = query.lte("mileage", args.max_mileage);
      if (args.min_year) query = query.gte("year", args.min_year);
      if (Array.isArray(args.fuel) && args.fuel.length) query = query.in("fuel_type", args.fuel);
      if (Array.isArray(args.transmission) && args.transmission.length) query = query.in("transmission", args.transmission);
      if (Array.isArray(args.body_type) && args.body_type.length) query = query.in("body_type", args.body_type);
      if (Array.isArray(args.make) && args.make.length) query = query.in("make", args.make);

      const { data, error } = await query;
      if (error) return { error: error.message };
      return { results: data ?? [], count: data?.length ?? 0 };
    }

    case "lookup_my_cars": {
      const { data, error } = await adminClient
        .from("cars")
        .select("id, make, model, year, price, fair_value_price, status, mileage, placement_paid, created_at")
        .eq("owner_id", userId)
        .order("created_at", { ascending: false });
      if (error) return { error: error.message };
      return { cars: data ?? [], count: data?.length ?? 0 };
    }

    case "lookup_car_value": {
      const { data, error } = await adminClient
        .from("cars")
        .select("id, make, model, year, price, fair_value_price, mileage, condition_score, market_blended, equipment, status")
        .eq("id", args.car_id as string)
        .maybeSingle();
      if (error) return { error: error.message };
      if (!data) return { error: "Car not found" };
      return data;
    }

    case "lookup_matches": {
      const { data, error } = await adminClient
        .from("matches")
        .select("id, user_id, match_score, status, created_at")
        .eq("car_id", args.car_id as string)
        .order("match_score", { ascending: false })
        .limit(10);
      if (error) return { error: error.message };
      return { matches: data ?? [], count: data?.length ?? 0 };
    }

    case "lookup_offers": {
      const { data, error } = await adminClient
        .from("offers")
        .select("id, car_id, amount, counter_amount, agreed_price, status, current_round, max_rounds, buyer_id, seller_id, created_at")
        .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
        .in("status", ["pending", "countered", "accepted"])
        .order("updated_at", { ascending: false })
        .limit(20);
      if (error) return { error: error.message };
      return { offers: data ?? [], count: data?.length ?? 0 };
    }

    case "create_support_ticket": {
      const { data, error } = await adminClient.from("support_tickets").insert({
        user_id: userId,
        category: (args.category as string) ?? "bug",
        subject: (args.subject as string) ?? "",
        description: (args.description as string) ?? "",
        severity: (args.severity as string) ?? "medium",
        page_context: pageContext,
      }).select("id, status").single();
      if (error) return { error: error.message };
      return { ticket_id: data.id, status: data.status };
    }

    case "navigate_user": {
      return {
        action: "navigate",
        destination: args.destination as string,
        label: args.label as string,
      };
    }

    case "flag_suspicious": {
      // Create admin notification
      await adminClient.from("notifications").insert({
        user_id: userId, // will be overridden — we need an admin target
        title: "🚨 Suspicious Activity Flagged",
        message: `AI Agent flagged user ${userId}: ${args.reason}`,
        type: "security",
        link: "/admin",
      });

      await adminClient.from("agent_activity_log").insert({
        user_id: userId,
        action_type: "flag_suspicious",
        tool_name: "flag_suspicious",
        details: { reason: args.reason, extra: args.details ?? "" },
        page_context: pageContext,
      });

      return { flagged: true, reason: args.reason };
    }

    default:
      return { error: `Unknown tool: ${toolName}` };
  }
}

// ── Build System Prompt ──────────────────────────────────────────
function buildSystemPrompt(
  profile: Record<string, unknown> | null,
  context: { currentPath?: string; locale?: string; role?: string } | null,
): string {
  const lang = context?.locale || (profile?.language as string) || "en";
  const role = context?.role || (profile?.user_type as string) || "guest";
  const kycStatus = (profile?.kyc_status as string) || "none";
  const page = context?.currentPath || "/";

  return `You are Autozon AI Concierge, an intelligent assistant for the Autozon car marketplace.

GOALS:
- Help sellers list their car quickly and correctly.
- Help buyers find the right car for their needs and budget.
- Help users with technical issues and report bugs to support.
- Explain Autozon processes clearly and concisely.
- Always act safely, honestly, and never invent system actions.
- Monitor for suspicious activity (repeated VIN lookups, price manipulation, impersonation, abuse).

CONTEXT:
- Autozon is a car marketplace focused on the EU (starting with Austria).
- Users can be guests, buyers, private sellers, or dealers.
- Current user role: ${role}
- Current user KYC status: ${kycStatus}
- Current user name: ${(profile?.full_name as string) || "Unknown"}
- Current page: ${page}
- Preferred language: ${lang}

STYLE:
- Be concise, practical, and direct.
- Ask clarifying questions only when needed.
- Use the user's language (detect from their message — German, English, Bosnian/Serbian/Croatian).
- When guiding through a process, go step-by-step and confirm key data.
- Use markdown formatting: **bold** for emphasis, bullet points for lists, links where helpful.

BEHAVIOR:
- First, determine the user's intent (sell, buy, support, general).
- If SELL: guide them through collecting car details, then suggest navigating to car-upload. Use lookup_my_cars to show their listings.
- If BUY: ask 2-4 smart questions (budget, fuel, family, usage), then call search_cars. Present results clearly.
- If SUPPORT/BUG: try to help; if it's a real issue, call create_support_ticket.
- If you detect suspicious behavior (price manipulation, fake listings, abuse), call flag_suspicious.
- If unsure, ask a simple clarifying question.

TOOLS:
You can call tools to perform real actions. Never fabricate tool results. Use them when appropriate.

IMPORTANT:
- Never reveal internal system details, database structure, or API keys.
- Never make up car prices or valuations — always use lookup_car_value.
- When navigating the user, use navigate_user with the correct route path.`;
}

// ── Main Handler ──────────────────────────────────────────────────
serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    // Auth
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await userClient.auth.getUser(token);
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const userId = user.id;

    // Admin client for tool execution (bypasses RLS)
    const adminClient = createClient(supabaseUrl, serviceRoleKey);

    // Parse body
    const body = await req.json();
    const { messages, context } = body;

    if (!Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: "Messages must be an array" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (messages.length > 50) {
      return new Response(JSON.stringify({ error: "Maximum 50 messages allowed" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const sanitizedMessages = messages.map((msg: { role?: string; content?: string }) => {
      if (!msg || typeof msg !== "object") throw new Error("Invalid message format");
      if (!msg.role || !["user", "assistant"].includes(msg.role)) throw new Error("Invalid role");
      if (typeof msg.content !== "string") throw new Error("Content must be a string");
      if (msg.content.length > 4000) throw new Error("Message too long");
      return { role: msg.role, content: msg.content.trim() };
    });

    // Load user profile for context
    const { data: profile } = await adminClient
      .from("profiles")
      .select("full_name, user_type, kyc_status, language, city, country")
      .eq("user_id", userId)
      .maybeSingle();

    const pageContext = context?.currentPath ?? null;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const systemPrompt = buildSystemPrompt(profile, context ?? null);

    // ── Tool-calling loop ──────────────────────────────────────
    let conversationMessages: Array<Record<string, unknown>> = [
      { role: "system", content: systemPrompt },
      ...sanitizedMessages,
    ];

    let toolRound = 0;

    while (toolRound < MAX_TOOL_ROUNDS) {
      const aiResp = await fetch(AI_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: MODEL,
          messages: conversationMessages,
          tools,
          stream: false, // non-streaming for tool rounds
        }),
      });

      if (!aiResp.ok) {
        if (aiResp.status === 429) {
          return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again." }), {
            status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        if (aiResp.status === 402) {
          return new Response(JSON.stringify({ error: "AI credits depleted." }), {
            status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        console.error("AI error:", aiResp.status, await aiResp.text());
        return new Response(JSON.stringify({ error: "AI service unavailable" }), {
          status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const aiData = await aiResp.json();
      const choice = aiData.choices?.[0];
      if (!choice) break;

      const msg = choice.message;

      // If no tool calls, we have the final answer — stream it
      if (!msg.tool_calls || msg.tool_calls.length === 0) {
        // Final answer ready — now stream it for a nice UX
        const streamResp = await fetch(AI_URL, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: MODEL,
            messages: conversationMessages,
            stream: true,
            // No tools on the final streaming call to avoid re-triggering
          }),
        });

        if (!streamResp.ok) {
          // Fallback: return the non-streamed content
          const content = msg.content || "I'm sorry, I couldn't generate a response.";
          const encoder = new TextEncoder();
          const ssePayload = `data: ${JSON.stringify({ choices: [{ delta: { content } }] })}\n\ndata: [DONE]\n\n`;
          return new Response(encoder.encode(ssePayload), {
            headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
          });
        }

        return new Response(streamResp.body, {
          headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
        });
      }

      // Execute tool calls
      conversationMessages.push(msg);

      for (const tc of msg.tool_calls) {
        const fnName = tc.function.name;
        let fnArgs: Record<string, unknown> = {};
        try {
          fnArgs = JSON.parse(tc.function.arguments || "{}");
        } catch {
          fnArgs = {};
        }

        console.log(`Tool call: ${fnName}`, fnArgs);

        const result = await executeTool(fnName, fnArgs, userId, pageContext, adminClient);

        conversationMessages.push({
          role: "tool",
          tool_call_id: tc.id,
          content: JSON.stringify(result),
        });
      }

      toolRound++;
    }

    // Fallback if we exhausted tool rounds
    const encoder = new TextEncoder();
    const fallback = `data: ${JSON.stringify({ choices: [{ delta: { content: "I've gathered the information. How can I help you further?" } }] })}\n\ndata: [DONE]\n\n`;
    return new Response(encoder.encode(fallback), {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });

  } catch (e) {
    console.error("concierge error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
