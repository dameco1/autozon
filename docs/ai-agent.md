# Zoni — Autozon AI Agent Architecture Reference

## Overview

Zoni is the Autozon AI Agent (V2), a context-aware, tool-calling AI assistant embedded in the platform. It executes real actions against the database, guides users through workflows, monitors for suspicious activity, and answers common questions from an embedded FAQ knowledge base. Zoni supports full English and German localization.

## Architecture

```text
┌──────────────────────────────────────────────┐
│              FRONTEND (React)                 │
│                                               │
│  ConciergeChat.tsx                            │
│  ├── Zoni avatar (zoni-avatar.png)           │
│  ├── Animated mascot trigger (framer-motion) │
│  ├── Context Provider (page, locale, role)   │
│  ├── Markdown rendering (react-markdown)     │
│  ├── Navigation action buttons               │
│  ├── Localized greeting (EN/DE)              │
│  └── Streaming SSE display                   │
│                                               │
│  chatStream.ts                                │
│  └── Sends { messages, context } to edge fn  │
└──────────────┬───────────────────────────────┘
               │ SSE stream
┌──────────────▼───────────────────────────────┐
│      EDGE FUNCTION: concierge-chat            │
│                                               │
│  1. JWT authentication (+ guest support)     │
│  2. User profile loading (role, KYC, name)   │
│  3. Intent classification (simple/complex)   │
│  4. Model routing (fast vs full)             │
│  5. Dynamic system prompt (with locale)      │
│  6. Tool-calling loop (up to 3 rounds)       │
│  7. Final streamed response                   │
│                                               │
│  TOOLS:                                       │
│  ├── search_cars (marketplace search)        │
│  ├── lookup_my_cars (seller's listings)      │
│  ├── lookup_car_value (valuation lookup)     │
│  ├── lookup_matches (buyer matches)          │
│  ├── lookup_offers (active negotiations)     │
│  ├── create_support_ticket (bug reports)     │
│  ├── navigate_user (deep-link guidance)      │
│  └── flag_suspicious (fraud alerts)          │
└──────────────┬───────────────────────────────┘
               │
┌──────────────▼───────────────────────────────┐
│              DATABASE                         │
│                                               │
│  support_tickets (bug reports, feedback)     │
│  agent_activity_log (tool audit trail)       │
│  + existing: cars, profiles, offers, etc.    │
└──────────────────────────────────────────────┘
```

## Performance Optimizations

### Two-Tier Model Routing
Zoni classifies each user message as **simple** or **complex** and routes to the appropriate model:

| Complexity | Model | Use Case |
|-----------|-------|----------|
| Simple | `google/gemini-2.5-flash` | FAQ, pricing, greetings, general questions |
| Complex | `google/gemini-3-flash-preview` | Car searches, tool-calling, multi-step tasks |

**Simple query detection** uses regex patterns (pricing keywords, greetings, "how does it work", etc.) and message length. Simple queries skip the tool-calling loop entirely and stream directly — cutting latency by ~50%.

### Reduced Tool Rounds
Max tool-calling rounds reduced from 5 to **3**. Analysis showed most queries need only 1-2 rounds. This reduces worst-case latency significantly.

### Embedded FAQ Knowledge Base
Common questions from [autozon.at/qa](https://autozon.at/qa) are embedded directly in the system prompt:
- "How does Autozon solve the trade-off between fast and more?"
- "How is Autozon different from Autotrader/Mobile.de?"
- "In some markets, trade-ins offer tax benefits. How does Autozon compete?"
- "What's different from posting photos and waiting?"
- "Why use Autozon instead of free/paid private ads?"
- "What more does Autozon offer beyond valuation tools?"
- "How is Autozon different from car apps?"

This means Zoni can answer these questions **instantly** without tool calls.

### Few-Shot Examples
The system prompt includes 4 example interactions showing Zoni the ideal response pattern:
1. Pricing question → Direct answer, no tools
2. Sell intent → Brief guidance + navigate_user link
3. Car search → Call search_cars with filters
4. Differentiator question → Answer from FAQ knowledge

### Conversational Continuity
Zoni never re-greets or re-introduces itself. The system prompt states: "You are already mid-conversation." This creates a natural, flowing chat experience.

## Database Tables

### `support_tickets`
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Reporter |
| category | TEXT | bug / question / feedback / ux_suggestion |
| subject | TEXT | Brief subject |
| description | TEXT | Details |
| page_context | TEXT | Page where issue occurred |
| severity | TEXT | low / medium / high / critical |
| status | TEXT | open / in_progress / resolved / closed |
| created_at | TIMESTAMPTZ | When created |

### `agent_activity_log`
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | User associated |
| action_type | TEXT | tool_call / flag_suspicious |
| tool_name | TEXT | Which tool was called |
| details | JSONB | Tool arguments and context |
| page_context | TEXT | Page context |
| created_at | TIMESTAMPTZ | When logged |

## Tool-Calling Flow

1. User sends message with page context
2. Edge function authenticates user, loads profile
3. **Intent classifier** determines simple vs complex
4. **Simple path**: Stream response directly with fast model (no tools)
5. **Complex path**:
   a. System prompt built with user context and locale
   b. Message sent to full model with tool definitions
   c. If model returns `tool_calls`: execute server-side, feed results back
   d. Loop continues (max 3 rounds)
   e. Final response streamed via SSE

## Models

- **Name**: Zoni
- **Fast model**: `google/gemini-2.5-flash` (FAQ, pricing, simple questions)
- **Full model**: `google/gemini-3-flash-preview` (tool-calling, searches, complex tasks)
- **Gateway**: Lovable AI (`https://ai.gateway.lovable.dev/v1/chat/completions`)
- **Auth**: `LOVABLE_API_KEY` (auto-provisioned)

## Localization

- Zoni detects the user's language from locale context and message content
- When locale is `de` or user writes in German, Zoni responds entirely in German
- When locale is `en` or user writes in English, Zoni responds in English
- Also supports Bosnian/Serbian/Croatian if detected
- Initial greeting in ConciergeChat.tsx is localized (EN/DE)

## Business Knowledge (Source of Truth)

Zoni's system prompt includes mandatory business facts to prevent hallucination:

- **Private Sellers**: €9.99 one-time listing fee
- **Business/Dealers**: €19.99 one-time listing fee
- **Buyers**: FREE
- No subscriptions, no monthly fees, no hidden charges
- Listing fee paid via Stripe after completing the car upload wizard

## Security

- All tool calls use a service-role client (bypasses RLS for reads)
- Every tool call is logged to `agent_activity_log`
- Suspicious activity creates admin notifications
- User can only see their own support tickets
- Only admins can view activity logs

## Admin Dashboard

The "AI Agent" tab in the Admin Dashboard provides:
- **Stats**: Open tickets, total tickets, tool calls, suspicious flags
- **Support Tickets**: Filterable by status, with inline status updates
- **Agent Activity**: Recent tool calls with arguments
- **Suspicious Flags**: Fraud alerts with reason and context

## Navigation Behavior

- The `navigate_user` tool does NOT actually navigate the user — it provides a clickable link/button in the chat
- Zoni uses `[NAV:/path|Label]` format for inline navigation suggestions
- Zoni never says "I've opened..." — instead says "Here's a link:" or "You can go here:"

## Workflows

### Buyer Flow
1. Zoni detects BUY intent → asks smart questions
2. Calls `search_cars` with filters → presents results in markdown
3. Offers to navigate to car detail or comparison

### Seller Flow
1. Zoni detects SELL intent → guides through process
2. Calls `navigate_user("/car-upload")` → links to wizard
3. Can call `lookup_car_value` for pricing help

### Support Flow
1. Zoni tries to resolve issue directly
2. If real bug → calls `create_support_ticket`
3. Ticket appears in admin dashboard immediately
