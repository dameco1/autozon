# Backend Functions (Edge Functions)

All backend logic runs as serverless **Edge Functions** on Lovable Cloud (Deno runtime). They auto-scale with traffic and deploy automatically on code push.

## Function Inventory

### 1. `concierge-chat` (Zoni AI Agent)
- **Purpose**: Context-aware AI assistant with tool-calling capabilities
- **Model**: Two-tier routing — `gemini-2.5-flash` (simple/FAQ) and `gemini-3-flash-preview` (complex/tool-calling)
- **Auth**: Optional (supports authenticated users and anonymous guests)
- **Protocol**: Server-Sent Events (SSE) streaming
- **Tools**: `search_cars`, `lookup_my_cars`, `lookup_car_value`, `lookup_matches`, `lookup_offers`, `create_support_ticket`, `navigate_user`, `flag_suspicious`
- **Features**: Intent classification, embedded FAQ knowledge base, bilingual (EN/DE), max 3 tool-calling rounds
- **Guest Mode**: Anonymous users get limited access (car search + general questions only)
- **Audit**: All tool calls logged to `agent_activity_log` table

### 2. `detect-damage`
- **Purpose**: AI-powered vehicle damage detection from photos with brand-specific repair cost estimation
- **Model**: Lovable AI (Gemini 2.5 Flash vision)
- **Auth**: Required (JWT)
- **Input**: `{ photoUrls: string[], make: string, model: string }`
- **Output**: Structured damage report — each damage includes `type`, `location`, `severity`, `confidence`, `description`, `estimated_repair_cost_eur` (brand-specific)
- **Used in**: Car Upload Step 4 (Damage Review)

### 3. `generate-description`
- **Purpose**: AI-generated car listing descriptions
- **Model**: Lovable AI (Gemini)
- **Auth**: Not required (uses API key)
- **Input**: Car attributes (make, model, year, mileage, equipment, condition)
- **Output**: Marketing-quality description in EN or DE
- **Used in**: Car Upload final step

### 4. `market-comparison`
- **Purpose**: AI-powered market analysis and comparable pricing
- **Model**: Lovable AI (Gemini)
- **Auth**: Required (JWT)
- **Input**: Car details + fair value price
- **Output**: Market positioning analysis, comparable listings, price trends
- **Used in**: Fair Value Result page

### 5. `create-placement-checkout`
- **Purpose**: Creates a Stripe checkout session for premium listing placement
- **Integration**: Stripe API
- **Auth**: Required (JWT + Supabase service role)
- **Flow**: Creates Stripe session → returns checkout URL → user pays → webhook confirms
- **Price**: €9.99 (private sellers), €19.99 (business/dealers)

### 6. `stripe-webhook`
- **Purpose**: Handles Stripe payment confirmation webhooks
- **Auth**: Stripe signature verification
- **Flow**: `checkout.session.completed` → updates `cars.placement_paid = true`

### 7. `verify-placement`
- **Purpose**: Verifies if a car's placement payment was completed
- **Auth**: Required
- **Output**: Boolean placement status

### 8. `seed-car-models`
- **Purpose**: Populates the `car_models` reference table with static data
- **Usage**: One-time database seeding (legacy, superseded by AI seeder)

### 9. `seed-car-models-ai`
- **Purpose**: AI-powered comprehensive car model seeder with MSRP data
- **Model**: Lovable AI (Gemini 2.5 Flash)
- **Auth**: Required (admin role)
- **Input**: `{ make: "BMW", models: "X5, X6, X7", delete_first?: true }`
- **Flow**: Sends targeted prompt per model group → parses JSON → cleans/validates → upserts to `car_models` (including `msrp_eur`)
- **Strategy**: Large makes (BMW, Audi, Mercedes, VW) are split into model groups to avoid token/timeout limits
- **Output**: `{ success: true, make, total: 39 }`
- **Result**: 2,700+ variants across 48 European makes with original MSRP data

### 10. `vin-decode`
- **Purpose**: VIN decoder using VINCARIO commercial vehicle database for accurate auto-filling
- **Integration**: VINCARIO API (info + decode + OEM endpoints, layered merge)
- **Auth**: Required (JWT)
- **Input**: `{ vin: "WBAPH5C55BA..." }`
- **Output**: `{ make, model, year, body_type, fuel_type, transmission, power_hp, suggested_equipment[], stolen, stolen_details, confidence, notes, source }`
- **Strategy**: Calls 4 VINCARIO endpoints in sequence — info (free base), decode (paid specs), OEM (manufacturer data as gap-filler), stolen-check (theft database) — and merges results for maximum coverage
- **Stolen Check**: Queries VINCARIO's stolen vehicle database; if flagged, the UI blocks listing and shows a warning alert
- **Used in**: Car Upload Step 1 (Basic Info) — "Decode VIN" button
- **Data source**: Manufacturer-backed EU vehicle database

### 11. `verify-docs-password`
- **Purpose**: Password-protects the documentation hub (Investor Data Room)
- **Auth**: Not required
- **Input**: Password or email
- **Features**: Email whitelist bypass, rate limiting (5 attempts per IP per 15 min)
- **Output**: `{ valid: boolean, access_level: string }`

### 12. `admin-actions`
- **Purpose**: Admin-only operations (user suspension, car status changes, transaction cancellation with Stripe refund)
- **Auth**: Requires admin role
- **Actions**: `suspend_user`, `reset_password`, `resend_invoice`, `cancel_transaction`
- **Cancellation flow**: Sets status to `not_completed`, relists car, processes Stripe refund (buyer gets amount minus 50% of fees for card payments), notifies both parties

### 13. `check-deadlines`
- **Purpose**: Automated deadline enforcement for ownership transfer steps
- **Auth**: Scheduled via `pg_cron` (hourly)
- **Flow**: Calls `find_overdue_transactions()` → starts 24h grace period → escalates to `cancellation_pending` if unresolved → notifies admins
- **Statuses**: `completed` → `grace_period` → `cancellation_pending`

### 14. `detect-location`
- **Purpose**: Detects user's geographic location for regional defaults
- **Auth**: Not required

### 15. `send-email-otp`
- **Purpose**: Sends 6-digit OTP code via email for 2FA
- **Auth**: Required
- **Rate limit**: 5 codes per 10 minutes per user
- **TTL**: 5 minutes

### 16. `verify-email-otp`
- **Purpose**: Verifies OTP code and marks session as verified
- **Auth**: Required

### 17. `kyc-create-session` / `kyc-webhook` / `get-kyc-status`
- **Purpose**: KYC identity verification flow via didit
- **Auth**: Required (create-session), webhook signature (webhook)

### 18. `create-car-payment`
- **Purpose**: Creates Stripe payment intent for car purchase
- **Auth**: Required

### 19. `get-placement-receipts`
- **Purpose**: Retrieves Stripe receipts for placement payments
- **Auth**: Required

### 20. Email System Functions
- **`auth-email-hook`**: Custom email rendering for auth emails (signup, recovery, magic link, etc.)
- **`send-transactional-email`**: Sends transactional emails (welcome, purchase receipt, placement receipt)
- **`process-email-queue`**: Processes queued emails with rate limiting and retry logic (pgmq-based)
- **`handle-email-suppression`**: Handles bounce/complaint webhooks to suppress emails
- **`handle-email-unsubscribe`**: Processes one-click email unsubscribe
- **`preview-transactional-email`**: Admin tool to preview email templates

## AI Integration Pattern

All AI functions follow the same pattern:
```
Client → Edge Function → Lovable AI API → Structured Response → Client
```

The Lovable AI gateway (`https://ai.gateway.lovable.dev/v1/chat/completions`) provides access to Gemini models without requiring external API keys. Authentication uses the `LOVABLE_API_KEY` environment secret.

## Secrets

| Secret | Purpose |
|--------|---------|
| `LOVABLE_API_KEY` | Lovable AI Gateway authentication (auto-provisioned) |
| `STRIPE_SECRET_KEY` | Stripe API for payments |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signature verification |
| `VINCARIO_API_KEY` | VINCARIO VIN decode API |
| `VINCARIO_SECRET_KEY` | VINCARIO API authentication |
| `DIDIT_API_KEY` | KYC verification API |
| `DIDIT_WEBHOOK_SECRET` | KYC webhook verification |
| `DIDIT_WORKFLOW_ID` | KYC workflow configuration |
| `DOCS_PASSWORD` | Investor Data Room password |

---

*Document status: V2 — Updated April 2026 with Zoni AI agent details, email system functions, KYC functions, and complete secrets inventory.*
