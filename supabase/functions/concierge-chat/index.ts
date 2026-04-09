import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const AI_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";
const MODEL_FAST = "google/gemini-2.5-flash";
const MODEL_FULL = "google/gemini-3-flash-preview";
const MAX_TOOL_ROUNDS = 3; // Reduced from 5 — most queries need 1-2 rounds

// ── Simple intent classifier for model routing ───────────────────
function classifyComplexity(lastMessage: string): "simple" | "complex" {
  const lower = lastMessage.toLowerCase();
  const simplePatterns = [
    /how much|cost|price|pricing|preis|kosten|gebühr/i,
    /what is autozon|was ist autozon/i,
    /how does.*(work|function)|wie funktioniert/i,
    /can i|kann ich/i,
    /sign up|register|anmeld/i,
    /thank|danke|thanks/i,
    /hello|hi|hey|hallo|servus|grüß/i,
    /who are you|wer bist du/i,
    /free|kostenlos/i,
  ];
  if (simplePatterns.some((p) => p.test(lower)) && lower.length < 200) {
    return "simple";
  }
  // Complex: car search, tool-needing queries, multi-step requests
  const complexPatterns = [
    /search|find|show me|such|zeig|finde/i,
    /my car|mein auto|my listing/i,
    /offer|angebot|negotiate|verhandl/i,
    /bug|error|problem|fehler|issue/i,
    /compare|vergleich/i,
    /value|wert|bewert/i,
  ];
  if (complexPatterns.some((p) => p.test(lower))) return "complex";
  return lower.length > 150 ? "complex" : "simple";
}

// ── Tool Definitions ──────────────────────────────────────────────
const tools = [
  {
    type: "function",
    function: {
      name: "search_cars",
      description: "Search available cars on the Autozon marketplace. Use ONLY when a user actively wants to find/browse specific cars.",
      parameters: {
        type: "object",
        properties: {
          budget_max_eur: { type: "number", description: "Max budget EUR" },
          budget_min_eur: { type: "number", description: "Min budget EUR" },
          fuel: { type: "array", items: { type: "string" }, description: "Fuel types: Petrol, Diesel, Electric, Hybrid, Plug-in Hybrid" },
          transmission: { type: "array", items: { type: "string" }, description: "Manual or Automatic" },
          body_type: { type: "array", items: { type: "string" }, description: "Sedan, SUV, Wagon, Hatchback, Coupe, Convertible, Van" },
          make: { type: "array", items: { type: "string" }, description: "Car brands" },
          max_mileage: { type: "number", description: "Max mileage km" },
          min_year: { type: "number", description: "Min year" },
        },
        required: [],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "lookup_my_cars",
      description: "Look up the current user's listed cars. Use ONLY when a seller asks about THEIR OWN listings.",
      parameters: { type: "object", properties: {}, required: [] },
    },
  },
  {
    type: "function",
    function: {
      name: "lookup_car_value",
      description: "Look up fair value of a specific car by ID. Use when user asks about a specific car's valuation.",
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
      description: "Look up buyer matches for a car. Use when a seller asks who is interested.",
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
      description: "Look up active offers/negotiations for the current user.",
      parameters: { type: "object", properties: {}, required: [] },
    },
  },
  {
    type: "function",
    function: {
      name: "create_support_ticket",
      description: "Create a support ticket. Use ONLY for real bugs or issues that cannot be resolved in chat.",
      parameters: {
        type: "object",
        properties: {
          category: { type: "string", enum: ["bug", "question", "feedback", "ux_suggestion"] },
          subject: { type: "string", description: "Brief subject" },
          description: { type: "string", description: "Details" },
          severity: { type: "string", enum: ["low", "medium", "high", "critical"] },
        },
        required: ["category", "subject", "description"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "navigate_user",
      description: "Suggest a page link. Does NOT navigate — provides a clickable link.",
      parameters: {
        type: "object",
        properties: {
          destination: { type: "string", description: "Route path e.g. /car-upload" },
          label: { type: "string", description: "Link label" },
        },
        required: ["destination", "label"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "flag_suspicious",
      description: "Flag suspicious activity for admin review.",
      parameters: {
        type: "object",
        properties: {
          reason: { type: "string", description: "Why suspicious" },
          details: { type: "string", description: "Context" },
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
      await adminClient.from("notifications").insert({
        user_id: userId,
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
  const isAuthenticated = !!profile;

  return `You are Zoni, Autozon's AI assistant. You are already mid-conversation — NEVER greet, introduce yourself, or say "Hi/Hello."

ROLE: Help buyers find cars, help sellers list cars, answer platform questions, report bugs.

═══ PRICING (NEVER invent prices) ═══
• Private Sellers: €9.99 one-time listing fee (unlimited duration)
• Business/Dealers: €19.99 one-time listing fee (unlimited duration)
• Buyers: FREE (browsing, offers, transactions — all free)
• NO subscriptions, NO monthly fees, NO hidden charges
• Fee paid via Stripe after car upload wizard; car visible only after payment

═══ FAQ KNOWLEDGE BASE ═══
Q: How does Autozon solve the trade-off between selling fast (dealer) and selling for more (private)?
A: Autozon removes the forced choice by creating a verified cross-border buyer network. It delivers dealer-level speed through instant matching, private-sale pricing through broader liquidity, and zero hassle because Autozon handles verification, documentation, and buyer qualification. It's a matching engine, not a listing site.

Q: How is Autozon different from Autotrader or Mobile.de?
A: Those are classified ad marketplaces (post and wait). Autozon is transactional infrastructure: AI-driven matching, cross-border liquidity, end-to-end transaction support, and built-in fraud prevention. No listings, no waiting.

Q: In some markets, trade-ins offer tax benefits. How does Autozon compete?
A: In markets without trade-in tax credits, sellers lose money with trade-ins. Autozon offers dealer-level convenience without the financial penalty, giving sellers a better net outcome.

Q: There are many websites where you post photos and wait for buyers. What's different?
A: That's exactly what Autozon replaces. The system matches both sides based on verified data. The transaction is guided, structured, and secure. Think "Tinder for cars" with verification and logistics built in.

Q: People already post free or paid ads to sell privately. Why use Autozon?
A: Private ads require photos, descriptions, handling calls, negotiating with strangers, managing test drives, fraud risks, and paperwork. Autozon removes ALL of this. Provide vehicle details once, Autozon handles the rest.

Q: Valuation tools already tell you retail value. What more does Autozon offer?
A: Valuation tools give a number but don't create a transaction. Autozon provides dynamic pricing based on real demand, instant buyer matching, real offers, and full transaction execution.

Q: How is Autozon different from car apps?
A: Most car apps are digital classified ads. Autozon is a transaction engine that matches, verifies, facilitates, and executes. Curated cars for buyers, fast liquidity for sellers.

═══ FLOWS (concise) ═══
SELLER: Sign up → Verify email → MFA → Intent (Selling) → Dashboard → Upload Car (6-step wizard) → Fair Value AI calc → Pay listing fee → Receive offers → Negotiate (max 5 rounds) → Transaction Wizard (5 steps) → Sold
BUYER: Sign up → Verify email → MFA → Intent (Buying) → Onboarding (12 questions) → Browse matched cars → Shortlist/Compare → Make offer → Negotiate → Transaction Wizard → Done
TRANSACTION: Method → Contract → Payment → Insurance → Complete (ownership transfer checklist)

═══ KEY ROUTES ═══
/ (Home), /signup, /login, /dashboard, /car-upload, /cars (browse), /car/:id, /onboarding, /negotiate/:offerId, /financing/:offerId, /qa (FAQ)

═══ CONTEXT ═══
User: ${(profile?.full_name as string) || "Guest"} | Role: ${role} | Auth: ${isAuthenticated ? "yes" : "no"} | KYC: ${kycStatus} | Page: ${page} | Lang: ${lang}

═══ RULES ═══
• Respond in the user's language. If locale="${lang}" or user writes in German → respond in German. English → English. Also support Bosnian/Serbian/Croatian.
• Be concise and direct. Use **bold** and bullets for clarity.
• NEVER invent pricing, features, or car data. Use tools for real data.
• navigate_user provides a clickable link — NEVER say "I've opened" or "I've navigated you."
• For guests: answer general questions, suggest /signup or /login for actions requiring auth.
• For suspicious behavior: call flag_suspicious.
• Only call tools when truly needed. For FAQ/pricing/process questions, answer directly from your knowledge.
${!isAuthenticated ? "• Guest user — do NOT use: lookup_my_cars, lookup_offers, create_support_ticket, flag_suspicious." : ""}

═══ FEW-SHOT EXAMPLES ═══
User: "How much does it cost to list a car?"
→ Answer directly: "€9.99 for private sellers, €19.99 for business sellers. One-time fee, no subscriptions."

User: "I want to sell my BMW"
→ Guide: explain the process briefly, then use navigate_user to link to /car-upload.

User: "Show me SUVs under €20,000"
→ Call search_cars with body_type=["SUV"], budget_max_eur=20000. Present results in a clear list.

User: "What makes Autozon different?"
→ Answer from FAQ knowledge: Autozon is a transaction engine, not a classified ad site. AI matching, verification, end-to-end support.`;
}

// ── Main Handler ──────────────────────────────────────────────────
serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

    let userId = "anonymous";
    let isAuthenticated = false;

    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.replace("Bearer ", "");
      if (token !== supabaseAnonKey) {
        const userClient = createClient(supabaseUrl, supabaseAnonKey, {
          global: { headers: { Authorization: authHeader } },
        });
        const { data: claimsData, error: claimsError } = await userClient.auth.getClaims(token);
        if (!claimsError && claimsData?.claims?.sub) {
          userId = claimsData.claims.sub as string;
          isAuthenticated = true;
        }
      }
    }

    const adminClient = createClient(supabaseUrl, serviceRoleKey);
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

    // Load user profile
    let profile: Record<string, unknown> | null = null;
    if (isAuthenticated) {
      const { data } = await adminClient
        .from("profiles")
        .select("full_name, user_type, kyc_status, language, city, country")
        .eq("user_id", userId)
        .maybeSingle();
      profile = data;
    }

    const pageContext = context?.currentPath ?? null;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const systemPrompt = buildSystemPrompt(profile, context ?? null);

    // ── Classify complexity for model routing ─────────────────
    const lastUserMsg = sanitizedMessages.filter((m: { role: string }) => m.role === "user").pop();
    const complexity = lastUserMsg ? classifyComplexity(lastUserMsg.content) : "simple";
    const selectedModel = complexity === "simple" ? MODEL_FAST : MODEL_FULL;

    console.log(`Complexity: ${complexity}, Model: ${selectedModel}`);

    // ── For simple queries, skip tool loop — stream directly ──
    if (complexity === "simple") {
      const streamResp = await fetch(AI_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: selectedModel,
          messages: [{ role: "system", content: systemPrompt }, ...sanitizedMessages],
          stream: true,
        }),
      });

      if (!streamResp.ok) {
        if (streamResp.status === 429) {
          return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again." }), {
            status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        if (streamResp.status === 402) {
          return new Response(JSON.stringify({ error: "AI credits depleted." }), {
            status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        console.error("AI error:", streamResp.status, await streamResp.text());
        return new Response(JSON.stringify({ error: "AI service unavailable" }), {
          status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(streamResp.body, {
        headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
      });
    }

    // ── Tool-calling loop (complex queries only) ──────────────
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
          model: selectedModel,
          messages: conversationMessages,
          tools,
          stream: false,
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

      // No tool calls → stream final answer
      if (!msg.tool_calls || msg.tool_calls.length === 0) {
        const streamResp = await fetch(AI_URL, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: selectedModel,
            messages: conversationMessages,
            stream: true,
          }),
        });

        if (!streamResp.ok) {
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

    // Fallback if exhausted tool rounds
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
