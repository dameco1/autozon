
# Autozon Role-Aware Transactions — Phase 1

## Scope
- User type classification (Private Person / Business Entity) at registration
- Didit KYC integration replacing file-upload KYC
- Support for **Private→Private** and **Business→Private** transaction combinations

---

## Step 1: Database Schema Updates

### A) Add `user_type` and business fields to `profiles` table
- `user_type` TEXT DEFAULT 'private' — values: 'private', 'business_seller', 'business_buyer'
- `company_name` TEXT (nullable)
- `uid_number` TEXT (nullable) — Austrian UID-Nummer
- `commercial_registry_number` TEXT (nullable) — Firmenbuchnummer
- `authorized_representative` TEXT (nullable)
- `date_of_birth` DATE (nullable)

### B) Create `kyc_verifications` table
- `id` UUID PK
- `user_id` UUID
- `transaction_id` UUID (nullable — KYC can happen at registration too)
- `role` TEXT ('buyer' or 'seller')
- `didit_session_id` TEXT
- `status` TEXT DEFAULT 'not_started' — values: not_started, in_progress, approved, declined, pending_review, abandoned, expired
- `decision_json` JSONB (nullable)
- `created_at`, `updated_at`
- RLS: users see own records, admins see all

### C) Update `profiles.kyc_status` values
- Expand to: 'none', 'pending', 'in_progress', 'approved', 'declined', 'pending_review'

### D) Add transaction KYC tracking columns
- `transactions.buyer_kyc_status` TEXT DEFAULT 'none'
- `transactions.seller_kyc_status` TEXT DEFAULT 'none'

---

## Step 2: Didit Edge Functions

### A) `kyc-create-session` edge function
- Auth required
- Calls Didit API to create verification session
- Stores session in `kyc_verifications` table
- Returns `verification_url` and `session_token` to frontend

### B) `kyc-webhook` edge function
- No auth (public webhook), validates `X-Signature-V2` with HMAC-SHA256
- Parses Didit callback payload
- Updates `kyc_verifications` and `profiles.kyc_status`
- Updates transaction KYC status if linked to a transaction

---

## Step 3: Frontend Changes

### A) Update Signup page
- Add "Account Type" selector: Private Person / Business
- Show business fields conditionally (company name, UID, registry number, representative)
- Save `user_type` and business fields to profiles

### B) Rewrite KYC Verification page
- Replace file-upload flow with Didit SDK session
- Call `kyc-create-session` edge function
- Open Didit verification URL (redirect or modal)
- Show status tracking (pending, approved, declined)
- Handle retry for expired/abandoned sessions

### C) Update Transaction flow (AcquisitionOptions)
- Check both buyer and seller KYC status before allowing contract step
- Show KYC prompts for each party
- Block progress if KYC not approved

---

## Step 4: Add Didit Secrets
- `DIDIT_API_KEY`
- `DIDIT_WEBHOOK_SECRET`  
- `DIDIT_WORKFLOW_ID`

---

## Not in this phase (future)
- Business→Business and Private→Business workflows
- Offline step deadline manager with countdown timers
- Role-based document checklists
- NoVA calculation logic
- Handover protocol
