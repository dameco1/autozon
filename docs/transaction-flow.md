# Transaction Completion Flow

## Overview

After buyer and seller agree on a price via the Negotiation engine, they proceed to the **Transaction Wizard** (`/acquire/:offerId`). This is a 5-step process that handles contract, payment, and insurance.

## Prerequisites

### KYC Identity Verification (`/kyc`)

Before signing a contract, users must complete identity verification:
1. **ID Document Upload** — Front and back of government-issued ID (passport, driver's license, national ID)
2. **Selfie Verification** — Photo holding ID next to face
3. **Address Confirmation** — Street, postal code, city

KYC status tracked in `profiles.kyc_status`: `none` → `pending` → `verified` / `rejected`. Documents stored securely in cloud storage. Typically reviewed in 1-2 business days.

## Step 1: Choose Completion Method

Users choose between:
- **Digital Transaction (Recommended)**: Autozon handles contract, payment, and insurance digitally
- **Manual Transaction**: User handles everything offline; Autozon provides a checklist and links to official contract templates

### Manual Path
If manual is chosen, the user sees:
- A completion checklist (download contract, sign in person, arrange payment, handover, register, insure)
- Direct links to **ÖAMTC** (Austria) or **ADAC** (Germany) official purchase contract templates
- Option to download a deal summary PDF

## Step 2: Digital Contract (Role-Based)

### Role-Based Contract Generation

The contract is generated based on the seller/buyer type combination, which determines warranty rules, required clauses, and document requirements:

| Combo | Warranty | Key Legal Basis |
|---|---|---|
| **Private → Private** | Gewährleistungsausschluss (excluded by mutual agreement) | §9 KSchG — non-consumer transaction |
| **Business → Private** | 2-year statutory warranty (Gewährleistung) | KSchG consumer protection — cannot be excluded |
| **Private → Business** | No warranty (as-is sale to professional buyer) | No consumer protection applies |
| **Business → Business** | Negotiable / limited warranty | UGB §377 Rügepflicht applies |

### Contract Preview

The contract preview shows:
- Seller & buyer names with party type badges (Private / Business)
- Vehicle details (make, model, year, VIN)
- Agreed purchase price
- **Warranty section** — type and description based on role combo
- Key contract clauses (base clauses + role-specific extra clauses)
- Required documents list per role

### Warranty Badge

A prominent warranty information badge is displayed at the top of the contract step, showing:
- The applicable warranty type for the role combination
- A description explaining the legal basis and implications

User signs digitally, then can download the contract PDF.

## Document Checklists (Role-Based)

Per role combination, different documents are required. The `DocumentChecklist` component displays required and optional documents with upload capability.

### Private Seller Documents
- Zulassungsschein Teil I (Registration Certificate Part I) ✱
- Zulassungsschein Teil II (Registration Certificate Part II) ✱
- §57a Gutachten / Pickerl (Inspection Certificate) ✱
- Serviceheft (Service Book) — optional
- Amtlicher Lichtbildausweis (Government-issued ID) ✱

### Business Seller Documents
- Zulassungsschein Teil I + II ✱
- Gewerbeschein (Trade License) ✱
- Rechnung / Invoice ✱
- §57a Gutachten / Pickerl ✱
- Garantiezertifikat (Warranty Certificate) — optional
- Serviceheft — optional

### Private Buyer Documents
- Government-issued ID (verified via KYC) ✱
- Zahlungsnachweis (Proof of Payment) ✱

### Business Buyer Documents
- Firmenbuchauszug (Commercial Register Extract) ✱
- UID-Nummernbestätigung (UID Number Confirmation) ✱
- Vollmacht des Vertretungsbefugten (Authorized Representative Proof) ✱
- Zahlungsnachweis (Proof of Payment) ✱

Documents are stored in the `transaction_documents` table with RLS policies ensuring only transaction participants and admins can access them.

## Step 3: Payment / Financing

Three payment options:
1. **Cash / Bank Transfer**: Direct payment with step-by-step instructions
2. **Credit**: Configurable down payment and loan term with partner bank quotes (APR, monthly payment, total cost)
3. **Leasing**: Configurable term and down payment with leasing partner quotes (monthly, residual value)

Financing partners are loaded from the `financing_partners` table.

### Financing Calculator (`/financing/:offerId?`)

A dedicated Austrian financing calculator is available with:
- **Kredit** (standard annuity loan) — buyer owns the car
- **Leasing** (operating lease) — return car at end of term
- **3-Wege-Finanzierung** (balloon) — low monthly payments + 30% residual at end

Inputs: vehicle price, down payment (0–40%), term (12–120 months), interest rate (1–12%), processing fee. Includes simulated Bonitätsindikator (creditworthiness indicator).

Partner banks (Raiffeisen, UniCredit Bank Austria, Arval) shown as "Coming Soon" with placeholder cards.

## Step 4: Insurance

Mandatory for vehicle registration. Three tiers:
- **Haftpflicht (Liability)**: Legal minimum
- **Teilkasko (Partial Cover)**: Adds theft, fire, glass, weather — recommended
- **Vollkasko (Comprehensive)**: Full protection including own-fault collision

### Insurance Estimate Calculator

Embedded calculator with Austrian-specific formulas:
- Inputs: vehicle value, power (kW), registration year, Bonus-Malus level (0–18), Kasko type, deductible, annual km
- Outputs: Haftpflicht, Kasko, combined premium, optional GAP insurance, optional warranty extension — all per month

### Insurance Integration Roadmap

| Milestone | Target | Description |
|---|---|---|
| Durchblicker API | Q3 2026 | Price comparison across Austrian insurers |
| Direct Insurer Integration | Q4 2026 | Instant binding quotes from partner insurers |
| Broker-as-a-Service | 2027 | Full insurance brokerage within the platform |

Users can also skip and arrange insurance themselves.

Insurance providers loaded from `financing_partners` table (type = 'insurance').

## Step 5: Transaction Complete

Summary of:
- Vehicle details
- Agreed price
- Contract type (Autozon Kaufvertrag)
- Payment method chosen
- Insurance tier selected

### Offline Deadline Manager

After the contract is signed, the **DeadlineManager** component tracks offline steps with countdown timers:

| Step | Deadline | Description |
|---|---|---|
| Vehicle Inspection | 72 hours | Buyer inspects the vehicle |
| Registration Transfer | 7 days | Ownership change at Zulassungsstelle |
| Vehicle Handover | 14 days | Physical handover of vehicle and keys |
| NoVA Payment | 15 days | Normverbrauchsabgabe (if applicable) |

Features:
- Live countdown timers (updated every minute)
- Overdue warnings with visual indicators
- Both parties can mark steps as completed
- Completion date recorded for each step
- Deadlines stored in `transaction_deadlines` table with RLS

### Document Upload (Post-Completion)

The document checklist remains visible after completion, allowing both parties to upload remaining required documents (proof of payment, registration confirmations, etc.).

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
- `payment_method`: 'cash' | 'credit' | 'leasing'
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
- Tracks offline step deadlines after contract signing
- Columns: id, transaction_id, step_type, label, deadline_at, completed_at, status
- RLS: Participants can view/update; admins have full access

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
- `deadlines` — offline step deadlines with hours from signing

## Localization

Fully localized in EN and DE under `t.transaction.*` namespace, including:
- Document checklist labels (`documentChecklist`, `yourDocuments`, `otherPartyDocuments`)
- Deadline manager labels (`offlineSteps`, `overdue`, `stepCompleted`, `done`)
- Warranty display (`warranty`)
