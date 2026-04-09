

# Autozon AI Agent V2 — Implementation Plan

## Summary
Upgrade the existing Concierge Chat into a full AI Agent with tool-calling capabilities, context awareness, support ticket collection, and admin monitoring. This merges the previously discussed architecture with the detailed workflow specifications you provided.

## What Gets Built

### 1. Database — Two New Tables

**`support_tickets`** — stores bug reports and feedback collected by the AI agent
- `id`, `user_id`, `category` (bug/question/feedback/ux_suggestion), `subject`, `description`, `page_context`, `severity` (low/medium/high/critical), `status` (open/in_progress/resolved/closed), `created_at`
- RLS: users see own tickets, admins see all

**`agent_activity_log`** — audit trail for all tool calls the agent makes
- `id`, `user_id`, `action_type`, `tool_name`, `details` (jsonb), `page_context`, `created_at`
- RLS: admins only for SELECT; service_role for INSERT

### 2. Edge Function — Rewrite `concierge-chat`

Major upgrade from simple prompt-relay to a tool-calling agent loop:

**Input changes** — accept `context` object alongside messages:
```
{ messages, context: { currentPath, locale, role, carId? } }
```

**Dynamic system prompt** — the production-ready prompt you provided, enhanced with:
- User's profile data (role, KYC status, user_type) fetched server-side
- Current page context injected automatically
- Language detection from locale field

**Tool definitions** (native Gemini function calling):

| Tool | Maps To | Description |
|------|---------|-------------|
| `search_cars` | SELECT from `cars` with filters | Buyer car search |
| `lookup_my_cars` | SELECT from `cars` WHERE owner_id | Seller's listings |
| `lookup_car_value` | SELECT fair_value from `cars` | Car valuation lookup |
| `lookup_matches` | SELECT from `matches` | Buyer matches for a car |
| `lookup_offers` | SELECT from `offers` | Active negotiations |
| `create_support_ticket` | INSERT into `support_tickets` | Bug/issue reporting |
| `log_feedback` | INSERT into `support_tickets` (category=feedback) | UX suggestions |
| `navigate_user` | Returns structured link | Deep-link guidance |
| `flag_suspicious` | INSERT into `agent_activity_log` + notification | Fraud alerts |

**Tool execution loop**: When Gemini returns `tool_calls`, execute them server-side against the database, feed results back into the conversation, then stream the final natural-language response to the user.

**All tool calls are logged** to `agent_activity_log` for admin visibility.

### 3. Frontend — Upgrade `ConciergeChat.tsx`

- **Context injection**: Use `useLocation()` to detect current page/step, send as `context` field
- **Markdown rendering**: Add `react-markdown` to render formatted AI responses (bold, lists, links)
- **Action buttons**: When AI returns `navigate_user` results, render clickable buttons in chat
- **Ticket confirmation**: When AI calls `create_support_ticket`, show a confirmation card before submitting
- **Role/locale awareness**: Pass user role and language from existing contexts

### 4. Frontend — Update `chatStream.ts`

- Send `context` alongside `messages` in the request body
- Handle new response format (tool-call interleaving during stream)

### 5. Admin Dashboard — New "AI Agent" Tab

Add to `AdminDashboard.tsx`:
- **Support Tickets table**: filterable by status, severity, category
- **Agent Activity Log**: recent tool calls and suspicious activity flags
- **Stats cards**: open tickets, flagged users, tool call volume

### 6. Documentation Updates

- Update `docs/backend-functions.md` with new tool-calling architecture
- Create `docs/ai-agent.md` with full architecture reference
- Update roadmap to mark Smart Concierge V2 as in-progress

## Technical Decisions

| Decision | Choice | Why |
|----------|--------|-----|
| Model | `google/gemini-3-flash-preview` | Best speed + tool-calling support |
| Tool calling | Native Gemini function calling | No orchestration framework needed |
| Listing drafts | Not a separate table — use existing `cars` INSERT | Avoids data duplication; agent can help fill car-upload form via `navigate_user` instead |
| Streaming | SSE with tool-call pause | User sees "thinking..." while tools execute |
| Feedback vs tickets | Same table, different `category` | Simpler schema, unified admin view |

## Buyer Workflow (via Agent)
1. Agent detects BUY intent from message
2. Asks 2-4 smart questions (budget, fuel, family, usage)
3. Calls `search_cars` with built filters
4. Presents results with thumbnails in formatted markdown
5. Offers to compare, save, or navigate to car detail

## Seller Workflow (via Agent)
1. Agent detects SELL intent
2. Guides through key details step-by-step
3. Calls `navigate_user("/car-upload")` to direct them to the wizard
4. Can call `lookup_car_value` to help with pricing questions
5. Follows up on missing fields or suggests description improvements

## Files Changed

- **New migration**: `support_tickets` + `agent_activity_log` tables with RLS
- **Rewrite**: `supabase/functions/concierge-chat/index.ts` (tool-calling loop)
- **Modify**: `src/components/ConciergeChat.tsx` (context, markdown, action buttons)
- **Modify**: `src/lib/chatStream.ts` (send context)
- **New**: `src/components/admin/AdminAgentTab.tsx` (tickets + activity log)
- **Modify**: `src/pages/AdminDashboard.tsx` (add Agent tab)
- **New**: `docs/ai-agent.md`
- **Modify**: `docs/backend-functions.md`, `docs/roadmap.md`, `public/docs/roadmap.md`

## Implementation Order
1. Database migration (tables + RLS)
2. Edge function rewrite (tool-calling loop)
3. Frontend chat upgrade (context + markdown + actions)
4. Admin tab
5. Documentation

