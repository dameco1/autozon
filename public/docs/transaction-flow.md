# Transaction Flow

> Full documentation of the vehicle purchase transaction wizard.

## Overview

The transaction flow begins after a buyer and seller reach an agreed price via negotiation. The buyer is redirected to `/acquire/:offerId` where a 5-step wizard guides them through completing the purchase.

## Prerequisites

### KYC Identity Verification (`/kyc`)
Before signing a contract, users must complete identity verification:
- Document upload (government-issued ID)
- Selfie verification
- Address confirmation
- KYC status: `none` → `pending` → `in_progress` → `verified` / `rejected`

## Step 1: Choose Completion Method

Users choose between:
- **Digital Transaction** (recommended): Full end-to-end digital flow with online contract, payment, and insurance
- **Manual Transaction**: Offline flow with downloadable contract template and checklist

## Step 2: Digital Contract

### Role-Based Contract Generation
Contract terms vary based on seller/buyer combinations:
- **Private → Private**: No warranty (Gewährleistungsausschluss)
- **Business → Private**: Mandatory 24-month statutory warranty (Gewährleistung)
- **Private → Business**: Warranty excluded, no consumer protection
- **Business → Business**: Negotiable warranty (min. 12 months)

### Contract Preview
Displays:
- Vehicle details, VIN, price
- Warranty type and description
- Role-specific clauses
- Required documents for both parties
- Digital signature stamps

**Car status is set to `sold` immediately upon dual contract signing.**

### Document Requirements

**Private Seller:**
- Registration Certificate Part I & II
- Service Book (optional)
- §57a Inspection Certificate (Pickerl)
- Government-issued ID

**Business Seller:**
- Registration Certificate Part I & II
- Trade License (Gewerbeschein)
- Invoice / Rechnung
- Warranty Certificate (if applicable)
- §57a Inspection Certificate
- Service Book (optional)

**Private Buyer:**
- Government-issued ID (verified via KYC)
- Proof of Payment

**Business Buyer:**
- Commercial Register Extract (Firmenbuchauszug)
- UID Number Confirmation
- Authorized Representative Proof
- Proof of Payment / Bank Transfer

## Step 3: Payment / Financing

Payment options:
- **Cash / Bank Transfer**: Direct payment
- **Credit**: Financing via partner banks with quote comparison
- **Leasing**: Leasing via partner institutions
- **Card Payment** (Stripe): Available for vehicles ≤ €10,000

### Financing Calculator
Austrian-specific calculator at `/financing/:offerId?` supports:
- Kredit (standard loan)
- Leasing
- 3-Wege-Finanzierung (balloon financing)

## Step 4: Insurance

### Insurance Tiers
- **Haftpflicht** (Liability): Mandatory third-party coverage
- **Teilkasko** (Partial): Covers theft, glass, weather, fire
- **Vollkasko** (Comprehensive): Full coverage including collision

### Insurance Estimate Calculator
Embedded calculator for Austrian-specific premium estimates based on vehicle and driver details.

### Integration Roadmap
1. Compare-only mode (current)
2. API integration with Austrian insurers
3. Direct binding quotes via partner APIs
4. Insurance brokerage services

## Step 5: Transaction Complete — Ownership Transfer Checklist

All post-completion steps are consolidated into a single **Ownership Transfer Checklist**. This replaces the previous separate Document Checklist, Deadline Manager, and next-steps boxes.

### Checklist Structure (Austrian Legal Order)

All manual step deadlines run **in parallel from contract signing** (Step 5 entry), allowing buyer and seller to work simultaneously.

| # | Step | Responsible | Deadline (from signing) | Description |
|---|------|-------------|------------------------|-------------|
| 1 | Government-issued ID (KYC) | Digital (Auto) | — | Identity verified through KYC process |
| 2 | Purchase Contract Signed | Digital (Auto) | — | Contract type (Autozon/ÖAMTC/ADAC) |
| 3 | Countersigned Contract Issued | Digital (Auto) | — | Both parties have signed |
| 4 | Payment Completed | Digital/Manual | — | Method and amount displayed inline |
| 5 | Vehicle Inspection Completed | Buyer | 72h (3 days) | Physical or professional inspection (ÖAMTC/ARBÖ/mechanic) |
| 6 | Buyer Arranges Insurance (Haftpflicht) | Buyer | 120h (5 days) | Mandatory liability insurance — eVB number required before registration |
| 7 | Seller Deregistration (Abmeldung) | Seller | 120h (5 days) | Deregisters vehicle at Zulassungsstelle (skip if already deregistered) |
| 8 | Buyer Registration (Anmeldung) | Buyer | 288h (12 days) | Requires eVB, Zulassungsschein I & II, COC, ID |
| 9 | Registration Plates Received | Buyer | 312h (13 days) | Plates issued and mounted |
| 10 | Registration Certificate Part I & II Issued | Buyer | 312h (13 days) | Issued at registration — part of the process |
| 11 | Vehicle Handover | Buyer + Seller | 384h (16 days) | Keys, docs, service book, vehicle — digital handover protocol via Autozon |

### Deadline Enforcement

- All manual step timers start simultaneously from contract signing (not sequentially)
- **Countdown timers** appear inline next to each step with its deadline
- **Warning labels** explain consequences of missed deadlines with an info (ℹ️) popover
- **Overdue warnings** with red visual indicators when deadlines are missed
- If a deadline expires → transaction enters **24h grace period** (Autozon support contacts both parties)
- If unresolved → status changes to **cancellation_pending** → admin confirms annulment
- Card payments: Stripe fees split 50/50 between buyer and seller
- Other payments: full refund to buyer, no platform costs

### Features
- **Digital steps** are system-managed, locked with a shield/check icon and "Auto" badge
- **Manual steps** are buyer/seller-controlled checkboxes; once checked, cannot be reversed
- Progress bar shows completion percentage
- All step completions persisted in `transaction_deadlines` table
- Deadline records auto-seeded on first Step 5 load

### Completion
When all 11 steps are checked:
- **Buyer** sees: Congratulations celebration with purchase-themed image and "Enjoy the ride!" message
- **Seller** sees: Congratulations with sale-themed image and "Use Autozon to find your next car!" message
- Both see: "Ownership Transfer Completed" badge

### Post-Completion
- Transaction record remains permanently in buyer's dashboard "Buying" tab
- **"Sell This Car" button is gated** — only clickable once all ownership transfer steps are 100% complete
- Full contract remains viewable and printable

## Car Status After Completion

When a transaction is completed (digital or manual), the car's status is automatically updated to `sold`. This triggers:
- Dashboard shows a red **SOLD** badge instead of "Ad Live"
- Edit/delete actions are hidden for sold cars
- A **"Transaction"** button links to the full transaction summary (`/acquire/:offerId`)
- Completed negotiations are filtered out of the "Active Negotiations" sidebar

## Self-Dealing Prevention

The system prevents users from buying their own cars at every level:
- **RLS policies**: `offers` INSERT requires `buyer_id != seller_id` and car not owned by buyer
- **RLS policies**: `car_shortlists` INSERT blocks shortlisting own cars
- **RLS policies**: `transactions` INSERT requires `buyer_id != seller_id`
- **Frontend guards**: CarDetail page blocks shortlisting own cars; BuyerMatches blocks self-offers

## Re-Purchase Guard

If a user navigates to `/negotiate/:offerId` for an accepted offer whose car is already sold, they are automatically redirected to the transaction summary at `/acquire/:offerId`.

## Vincario Vehicle History Report

Available on the car detail page before and during the transaction flow. VIN-based lookup provides:
- Vehicle specifications verification
- Stolen vehicle check
- Market value estimate (below/average/above bands)
- Open manufacturer recall notices

## Database

### `transactions` table
- `completion_method`: 'digital' | 'manual'
- `contract_type`: 'oeamtc' | 'adac' | 'autozon'
- `payment_method`: 'cash' | 'credit' | 'leasing' | 'card'
- `insurance_tier`: 'liability' | 'partial' | 'comprehensive'
- `status`: initiated → contract_pending → payment_pending → insurance_pending → completed
- `current_step`: 1-5 (wizard position, resumable)
- `seller_type`: 'private' | 'business' — determines seller-side workflow
- `buyer_type`: 'private' | 'business' — determines buyer-side workflow

### `transaction_documents` table
- Tracks required document uploads per transaction
- Columns: id, transaction_id, document_type, label, required, uploaded_url, uploaded_at, verified, uploader_role
- RLS: Participants can view/insert/update; admins have full access

### `transaction_deadlines` table
- Tracks ownership transfer step completions and deadlines
- Columns: id, transaction_id, step_type, label, deadline_at, completed_at, status
- Used by both the Ownership Transfer Checklist (Step 5) and admin dashboard
- RLS: Participants can view/insert/update; admins have full access

RLS: Buyers and sellers can view/update their own transactions. Admins have full access.

## Role Workflow Configuration

The `src/lib/roleWorkflow.ts` module exports:
- `getWorkflow(sellerType, buyerType)` — returns the full workflow config for a role combo
- `getAllDocuments(workflow)` — returns combined seller + buyer document requirements
- `getDeadlinesFromNow(workflow, signedAt)` — returns deadlines with calculated dates

Each workflow includes:
- `warrantyConfig` — type, labels (EN/DE), descriptions
- `sellerDocuments` / `buyerDocuments` — required/optional document specs
- `extraClauses` — role-specific contract clauses (EN/DE)
- `deadlines` — offline step deadlines (inspection: 72h, registration: 7d, handover: 14d)

## Admin Dashboard Integration

The admin car card displays:
- Transaction history with payment method, insurance tier, completion method, contract type
- **Ownership Transfer Progress** with completion count and per-step status badges
- Direct link to view the full transaction at `/acquire/:offerId`

## Localization

Fully localized in EN and DE under `t.transaction.*` namespace, including:
- All 11 ownership transfer checklist step labels and descriptions
- Progress, countdown, overdue, and completion labels
- Congratulations messages
- Document checklist labels (for seller views on earlier steps)
- Warranty display
