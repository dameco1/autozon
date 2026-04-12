# Database Schema

## Entity Relationship Diagram

```
┌──────────────┐     ┌──────────────┐     ┌──────────────────┐
│   profiles   │     │     cars     │     │   car_models     │
│──────────────│     │──────────────│     │──────────────────│
│ id (PK)      │     │ id (PK)      │     │ id (PK)          │
│ user_id (FK) │     │ owner_id     │     │ make, model      │
│ full_name    │     │ make, model  │     │ variant, year    │
│ phone, city  │     │ year, price  │     │ body_type, fuel  │
│ country      │     │ fair_value   │     │ power_hp         │
│ language     │     │ mileage      │     │ msrp_eur         │
│ avatar_url   │     │ status       │     └──────────────────┘
│ relationship │     │ body_type    │
│ has_kids     │     │ fuel_type    │     ┌──────────────────┐
│ num_kids     │     │ equipment[]  │     │     buyers       │
│ car_purpose  │     │ photos[]     │     │──────────────────│
│ current_car  │     │ condition_*  │     │ id (PK)          │
│ budget_max   │     │ detected_*   │     │ name, location   │
└──────────────┘     │ placement_*  │     │ budget_min/max   │
                     └──────────────┘     │ preferred_makes  │
┌──────────────┐            │             │ preferred_fuel   │
│    offers    │            │             │ preferred_body   │
│──────────────│     ┌──────┴───────┐     │ intent_level     │
│ id (PK)      │     │   matches    │     └──────────────────┘
│ car_id (FK)  │     │──────────────│
│ buyer_id     │     │ id (PK)      │     ┌──────────────────┐
│ seller_id    │     │ car_id (FK)  │     │ user_preferences │
│ amount       │     │ user_id      │     │──────────────────│
│ counter_amt  │     │ match_score  │     │ id (PK)          │
│ agreed_price │     │ status       │     │ user_id          │
│ current_round│     └──────────────┘     │ budget range     │
│ status       │                          │ preferred_*      │
└──────┬───────┘     ┌──────────────┐     │ usage_pattern    │
       │             │  car_views   │     │ commute_distance │
┌──────┴───────┐     │──────────────│     │ parking_type     │
│ acquisition_ │     │ car_id (FK)  │     │ family_size      │
│ quotes       │     │ viewer_id    │     │ ownership_pref   │
│──────────────│     └──────────────┘     │ insurance_tol.   │
│ id (PK)      │                          │ onboarding_done  │
│ offer_id (FK)│     ┌──────────────┐     │ **sports[]**     │
│ partner_id   │     │car_shortlists│     │ **needs_towing** │
│ quote_type   │     │──────────────│     │ **towing_wt_kg** │
│ monthly_pmt  │     │ car_id (FK)  │     └──────────────────┘
│ term_months  │     │ user_id      │
│ interest_rate│     └──────────────┘     ┌──────────────────┐
└──────────────┘                          │  notifications   │
                     ┌──────────────┐     │──────────────────│
┌──────────────┐     │buyer_select. │     │ user_id          │
│chat_messages │     │──────────────│     │ title, message   │
│──────────────│     │ car_id (FK)  │     │ type, link       │
│ user_id      │     │ user_id      │     │ read (bool)      │
│ role         │     │ liked, round │     └──────────────────┘
│ content      │     └──────────────┘
└──────────────┘                          ┌──────────────────┐
                     ┌──────────────┐     │financing_partners│
                     │ transactions │     │──────────────────│
                     │──────────────│     │ name, type       │
                     │ offer_id (FK)│     │ base_rate        │
                     │ car_id (FK)  │     │ is_active        │
                     │ buyer/seller │     └──────────────────┘
                     │ agreed_price │
                     │ current_step │     ┌──────────────────┐
                     │ contract_*   │     │   user_roles     │
                     │ payment_*    │     │──────────────────│
                     │ insurance_*  │     │ user_id (FK)     │
                     │ status       │     │ role (enum)      │
                     └──────────────┘     │ admin/mod/user   │
                                          └──────────────────┘
┌──────────────────┐  ┌──────────────────┐
│ support_tickets  │  │agent_activity_log│
│──────────────────│  │──────────────────│
│ id (PK)          │  │ id (PK)          │
│ user_id          │  │ user_id          │
│ category         │  │ action_type      │
│ subject          │  │ tool_name        │
│ description      │  │ details (JSONB)  │
│ page_context     │  │ page_context     │
│ severity         │  │ created_at       │
│ status           │  └──────────────────┘
│ created_at       │
└──────────────────┘
```

## Tables Summary

| Table | Rows (approx) | Purpose |
|---|---|---|
| `profiles` | 1 per user | Extended user info (name, phone, city, **relationship status, kids, car purpose, current car, budget**) — feeds lifestyle matching |
| `cars` | Growing | Car listings with valuation data |
| `car_models` | ~2,700+ | Reference data: 48 European makes, 255+ models, all variants with MSRP (AI-seeded) |
| `offers` | Per negotiation | Multi-round offer/counter-offer tracking |
| `transactions` | Per deal | Full transaction lifecycle (method → contract → payment → insurance → complete) |
| `matches` | Auto-generated | Car-to-buyer match scores |
| `buyers` | Seed + real | Buyer profiles (some seeded for demo) |
| `buyer_selections` | Per swipe | Tinder-style like/dislike per round |
| `car_shortlists` | Per save | User's saved/bookmarked cars |
| `car_views` | Per view | View tracking for analytics |
| `notifications` | Per event | In-app notification system (with trigger on offer status changes) |
| `chat_messages` | Per chat | Concierge AI conversation history |
| `user_preferences` | 1 per user | Buyer onboarding preferences (budget, body types, fuel, transmission, commute, parking, family size, insurance tolerance, **preferred colors, timing**) — also populated optionally at signup |
| `acquisition_quotes` | Per quote | Financing/leasing quote from partners |
| `financing_partners` | Seed | Bank/leasing partner profiles |
| `user_roles` | Per role assignment | Role-based access control (admin, moderator, user) — separate from profiles for security |
| `support_tickets` | Per ticket | Bug reports, questions, feedback, UX suggestions — created by Zoni AI agent or users directly |
| `agent_activity_log` | Per tool call | Audit trail for Zoni AI agent tool calls and suspicious activity flags |
| `email_otp` | Per OTP code | Email-based 2FA codes with 5-minute TTL |
| `email_send_log` | Per email | Email delivery tracking and error logging |
| `email_send_state` | Singleton | Email queue configuration (batch size, delays, TTLs) |
| `email_unsubscribe_tokens` | Per token | One-time unsubscribe tokens for transactional emails |
| `suppressed_emails` | Per suppression | Bounced/complained email addresses blocked from future sends |
| `kyc_verifications` | Per verification | KYC identity verification sessions (via didit) |
| `negotiation_rounds` | Per round | Detailed per-round negotiation history with actor tracking |
| `transaction_deadlines` | Per deadline | Step-based deadline tracking for ownership transfer |
| `transaction_documents` | Per document | Required document checklist for transaction completion |

## Profiles Table — Lifestyle Fields

The `profiles` table stores lifestyle data collected during registration for use in the matching algorithm:

| Column | Type | Purpose |
|---|---|---|
| `relationship_status` | text | Single, married, divorced → body type affinity |
| `has_kids` | boolean | Whether user has children |
| `num_kids` | integer | Number of children → seating requirements |
| `car_purpose` | text | Daily, work, pleasure, summer, winter → feature affinity |
| `current_car` | text | Free text (e.g. "BMW 3 Series 2019") → brand loyalty, upgrade path, segment continuity |
| `budget_max` | numeric | Fallback budget if preferences not set |
| `suspended` | boolean | Account suspension flag (admin-controlled) |
| `suspension_type` | text | Type of suspension |
| `company_name` | text | Business entity name (for dealer accounts) |
| `uid_number` | text | Business UID number |
| `commercial_registry_number` | text | Business registry number |
| `authorized_representative` | text | Business authorized representative |

## Support Tickets Table (Zoni AI Agent)

Created by the Zoni AI agent or users directly:

| Column | Type | Purpose |
|---|---|---|
| `category` | text | `bug`, `question`, `feedback`, `ux_suggestion` |
| `subject` | text | Brief subject line |
| `description` | text | Detailed description |
| `page_context` | text | Page where the issue occurred |
| `severity` | text | `low`, `medium`, `high`, `critical` |
| `status` | text | `open`, `in_progress`, `resolved`, `closed` |

## Agent Activity Log (Zoni AI Agent)

Audit trail for all Zoni tool calls:

| Column | Type | Purpose |
|---|---|---|
| `action_type` | text | `tool_call` or `flag_suspicious` |
| `tool_name` | text | Which tool was called (e.g. `search_cars`, `flag_suspicious`) |
| `details` | jsonb | Tool arguments and context |
| `page_context` | text | Page context at time of call |

## Security (Row-Level Security)

All tables have RLS enabled. Key policies:
- **cars**: Owners can CRUD their own; anonymous and authenticated users can SELECT available cars with paid placement; admins full access
- **profiles**: Users can only read/write their own profile; admins can view/update all
- **offers**: Buyer and seller of the offer can read/update; buyers cannot create offers on own cars (`buyer_id != seller_id`); admins full access
- **car_shortlists**: Users can CRUD own; cannot shortlist own cars; car owners can view shortlists on their cars
- **transactions**: Buyers and sellers can view/update own; buyers cannot create transactions on own cars (`buyer_id != seller_id`); admins full access; secure RPC functions for step transitions
- **notifications**: Users can only see their own notifications; admins can view all; trigger auto-generates notifications on offer status changes
- **chat_messages**: Users can only access their own chat history
- **car_models**: All users (including anonymous) can read; no public write access (seeded via edge function with service role)
- **user_roles**: Users can only view their own roles; `has_role()` security-definer function prevents RLS recursion
- **support_tickets**: Users can view own tickets; service role and users can insert; admins can view/update all
- **agent_activity_log**: Service role can insert; admins can view; no user access
- **email_otp**: Service role INSERT only; users can view own
- **suppressed_emails**: Service role only (all operations)

## Database Functions

| Function | Purpose |
|---|---|
| `has_role(_user_id, _role)` | Security definer check for RBAC (prevents RLS recursion) |
| `lock_fair_value(_car_id, _fair_value_price)` | Owner-only fair value lock |
| `transaction_set_method()` | Step 1: Set completion method |
| `transaction_set_contract()` | Step 2: Generate contract + mark car as sold |
| `transaction_set_payment()` | Step 3: Set payment method |
| `transaction_set_insurance()` | Step 4: Set insurance + complete transaction |
| `transaction_seller_sign_contract()` | Seller counter-signs digital contract |
| `get_counterparty_profile()` | Secure profile lookup for transaction participants |
| `find_overdue_transactions()` | Find Step 5 transactions with missed deadlines |
| `notify_offer_update()` | Trigger: auto-create notifications on offer status changes |
| `prevent_vin_change()` | Trigger: block VIN modification after creation |
| `prevent_car_system_field_tampering()` | Trigger: protect system fields (status, placement_paid, fair_value_price, etc.) |
| `validate_email_otp_expiry()` | Trigger: prevent inserting already-expired OTP codes |
| `handle_new_user()` | Trigger: auto-create profile on user signup |
| `enqueue_email() / read_email_batch() / delete_email() / move_to_dlq()` | Email queue management (pgmq-based) |

---

*Document status: V2 — Updated April 2026 with support_tickets, agent_activity_log, email tables, KYC, and all database functions.*
