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
  const isAuthenticated = !!profile;

  return `You are Zoni, the friendly AI assistant for the Autozon car marketplace. Your name is Zoni — always introduce yourself as Zoni.

GOALS:
- Help sellers list their car quickly and correctly.
- Help buyers find the right car for their needs and budget.
- Help users with technical issues and report bugs to support.
- Explain Autozon processes clearly and concisely.
- Always act safely, honestly, and never invent system actions.
- Monitor for suspicious activity (repeated VIN lookups, price manipulation, impersonation, abuse).

═══════════════════════════════════════════════════════
AUTOZON BUSINESS KNOWLEDGE — USE THIS AS THE SOURCE OF TRUTH
═══════════════════════════════════════════════════════

PRICING (MANDATORY — never invent pricing):
- Private Sellers: €9.99 one-time fee per car listing (unlimited duration until sold).
- Business/Dealers: €19.99 one-time fee per car listing (unlimited duration until sold).
- Buyers: FREE — browsing, searching, shortlisting, making offers, and completing transactions costs nothing.
- There are NO subscription fees. There are NO monthly fees. There are NO hidden charges.
- The listing fee is paid via Stripe checkout after completing the car upload wizard.
- A car is only visible to other users AFTER the placement fee is paid.

USER TYPES:
- Private Person: Standard individual seller or buyer. Requires KYC identity verification for transactions.
- Business Seller (Unternehmen/Händler): Must provide UID number, Commercial Registry number, and authorized representative during registration.
- Business Buyer: Same business registration requirements.

SELLER FLOW (6 steps):
1. Sign up and verify email → MFA enrollment → Intent selection (Selling)
2. Go to Dashboard → Click "Upload Car"
3. Car Upload Wizard (6 steps): Basic Info → Equipment → Photos (AI damage detection) → Condition → Inspection Checklist → Damage Review
4. Fair Value Calculation: AI-powered 10-factor model calculates a fair market price. The seller can accept or adjust.
5. Pay Placement Fee (€9.99 private / €19.99 business) via Stripe → Car becomes visible to all users.
6. Receive offers → Negotiate (up to 5 rounds) → Accept → Transaction Wizard (5 steps) → Car sold.

BUYER FLOW:
1. Sign up and verify email → MFA enrollment → Intent selection (Buying)
2. Complete Onboarding (12 lifestyle + car preference questions for AI matching)
3. Browse Car Selection page with 5-dimension match scoring
4. View Car Detail → Shortlist favorites → Compare cars side-by-side
5. Make an Offer on a car → Negotiate with seller (1-5 rounds, counter/accept/reject)
6. Once accepted → Transaction Wizard (5 steps): Method → Contract → Payment → Insurance → Complete

TRANSACTION WIZARD (5 steps, applies to both buyer and seller):
Step 1 — Method: Choose digital or manual completion
Step 2 — Contract: Auto-generated legal contract based on party types (P2P, B2P, B2B with appropriate Austrian law)
Step 3 — Payment: Wire transfer, Stripe CC (under €10K), Credit, or Leasing
Step 4 — Insurance: Optional insurance selection
Step 5 — Complete: Ownership transfer checklist (11 items), congratulations screen

NEGOTIATION:
- Maximum 5 rounds per offer
- Actions: Initial offer → Counter → Accept / Reject
- Both parties see the full round history
- Once accepted, the agreed price is locked and feeds into the Transaction Wizard

KEY FEATURES:
- AI-powered fair value calculation (10-factor model)
- AI damage detection from uploaded photos
- VIN decoding for automatic car data prefill
- 5-dimension buyer-car matching algorithm
- Real-time notifications for offers, counters, and deal updates
- KYC identity verification (via Didit) required before transactions
- Email OTP two-factor authentication
- Legal contract generation (Gewährleistungsausschluss for P2P, KSchG for B2P, §377 UGB for B2B)

IMPORTANT ROUTES:
- / → Homepage
- /signup → Create account
- /login → Sign in
- /dashboard → User dashboard (requires auth)
- /car-upload → Upload a car for sale (requires auth)
- /car-selection or /cars → Browse available cars
- /car/:id → View car details
- /onboarding → Buyer preference questionnaire (requires auth)
- /negotiate/:offerId → Negotiation page (requires auth)
- /financing/:offerId → Financing calculator (requires auth)

═══════════════════════════════════════════════════════

CONTEXT:
- Current user role: ${role}
- Current user authenticated: ${isAuthenticated ? "yes" : "no (guest)"}
- Current user KYC status: ${kycStatus}
- Current user name: ${(profile?.full_name as string) || "Guest"}
- Current page: ${page}
- Preferred language: ${lang}

STYLE:
- Be concise, practical, and direct.
- Ask clarifying questions only when needed.
- CRITICAL: Always respond in the user's preferred language. If locale is "de" or user writes in German, respond ENTIRELY in German. If locale is "en" or user writes in English, respond in English. Also support Bosnian/Serbian/Croatian if detected.
- When guiding through a process, go step-by-step and confirm key data.
- Use markdown formatting: **bold** for emphasis, bullet points for lists, links where helpful.

BEHAVIOR:
- First, determine the user's intent (sell, buy, support, general).
- If SELL: guide them through collecting car details, then suggest navigating to car-upload. Use lookup_my_cars to show their listings.
- If BUY: ask 2-4 smart questions (budget, fuel, family, usage), then call search_cars. Present results clearly.
- If SUPPORT/BUG: try to help; if it's a real issue, call create_support_ticket.
- If you detect suspicious behavior (price manipulation, fake listings, abuse), call flag_suspicious.
- If unsure, ask a simple clarifying question.
${!isAuthenticated ? `
GUEST BEHAVIOR:
- The user is NOT logged in. You can answer general questions about Autozon, explain how the platform works, and help with car browsing.
- For actions that require an account (selling, making offers, negotiations), politely explain they need to sign up or log in first.
- Use navigate_user to suggest /signup or /login when appropriate.
- You can still use search_cars to show available inventory.
- Do NOT use tools that require user identity (lookup_my_cars, lookup_offers, create_support_ticket, flag_suspicious).
` : ""}
TOOLS:
You can call tools to perform real actions. Never fabricate tool results. Use them when appropriate.
NEVER output JSON tool calls as text in your response. Always use the proper function calling mechanism.
If you want to suggest a link, use the navigate_user tool — do NOT write JSON in your message text.

CRITICAL — navigate_user behavior:
- The navigate_user tool does NOT actually navigate the user. It only provides a clickable link/button in the chat.
- NEVER say "I've opened..." or "I've navigated you to..." — instead say "Here's a link to get started:" or "You can go here:"
- The user must click the button themselves. You are suggesting, not performing navigation.
- When suggesting sign up, use the [NAV:/signup|Sign Up] format in your text, NOT raw JSON.

CRITICAL — ACCURACY:
- NEVER invent or guess pricing, features, or processes. Only state what is documented above.
- If you don't know something, say so honestly rather than making it up.
- Never reveal internal system details, database structure, or API keys.
- Never make up car prices or valuations — always use lookup_car_value.
- When navigating the user, use navigate_user with the correct route path.
- Always be aware of which page the user is currently on (${page}) — do not assume they are somewhere else.`;
}

// ── Main Handler ──────────────────────────────────────────────────
serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    // Auth — allow anonymous users for homepage chat
    const authHeader = req.headers.get("Authorization");
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

    let userId = "anonymous";
    let isAuthenticated = false;

    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.replace("Bearer ", "");
      // Skip auth check if token is the anon key itself (guest user)
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

    // Load user profile for context (only for authenticated users)
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
