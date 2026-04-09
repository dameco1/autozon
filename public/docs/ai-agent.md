# Autozon AI Agent — Architecture Reference

## Overview

The Autozon AI Agent (V2) is a context-aware, tool-calling AI assistant embedded in the platform. It replaces the simple Concierge Chat with a full agent capable of executing real actions against the database, guiding users through workflows, and monitoring for suspicious activity.

## Architecture

```text
┌──────────────────────────────────────────────┐
│              FRONTEND (React)                 │
│                                               │
│  ConciergeChat.tsx                            │
│  ├── Context Provider (page, locale, role)   │
│  ├── Markdown rendering (react-markdown)     │
│  ├── Navigation action buttons               │
│  └── Streaming SSE display                   │
│                                               │
│  chatStream.ts                                │
│  └── Sends { messages, context } to edge fn  │
└──────────────┬───────────────────────────────┘
               │ SSE stream
┌──────────────▼───────────────────────────────┐
│      EDGE FUNCTION: concierge-chat            │
│                                               │
│  1. JWT authentication                        │
│  2. User profile loading (role, KYC, name)   │
│  3. Dynamic system prompt                     │
│  4. Tool-calling loop (up to 5 rounds)       │
│  5. Final streamed response                   │
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
3. System prompt is built with user context
4. Message sent to Gemini with tool definitions
5. If Gemini returns `tool_calls`:
   - Each tool is executed server-side
   - Results are fed back into conversation
   - Loop continues (max 5 rounds)
6. When no more tools needed, final response is streamed via SSE

## Model

- **Primary**: `google/gemini-3-flash-preview`
- **Gateway**: Lovable AI (`https://ai.gateway.lovable.dev/v1/chat/completions`)
- **Auth**: `LOVABLE_API_KEY` (auto-provisioned)

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

## Workflows

### Buyer Flow
1. Agent detects BUY intent → asks smart questions
2. Calls `search_cars` with filters → presents results in markdown
3. Offers to navigate to car detail or comparison

### Seller Flow
1. Agent detects SELL intent → guides through process
2. Calls `navigate_user("/car-upload")` → links to wizard
3. Can call `lookup_car_value` for pricing help

### Support Flow
1. Agent tries to resolve issue directly
2. If real bug → calls `create_support_ticket`
3. Ticket appears in admin dashboard immediately
