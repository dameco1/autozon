# Transaction Completion Flow

## Overview

After buyer and seller agree on a price via the Negotiation engine, they proceed to the **Transaction Wizard** (`/acquire/:offerId`). This is a 5-step process that handles contract, payment, and insurance.

## Step 1: Choose Completion Method

Users choose between:
- **Digital Transaction (Recommended)**: Autozon handles contract, payment, and insurance digitally
- **Manual Transaction**: User handles everything offline; Autozon provides a checklist and links to official contract templates

### Manual Path
If manual is chosen, the user sees:
- A completion checklist (download contract, sign in person, arrange payment, handover, register, insure)
- Direct links to **ÖAMTC** (Austria) or **ADAC** (Germany) official purchase contract templates
- Option to download a deal summary PDF

## Step 2: Digital Contract (ÖAMTC / ADAC)

The system auto-detects the seller's country from their profile:
- **Austria** → ÖAMTC Kaufvertrag
- **Germany** → ADAC Kaufvertrag

The contract preview shows:
- Seller & buyer names
- Vehicle details (make, model, year, VIN)
- Agreed purchase price
- Key contract clauses (as-inspected, ownership warranty, mileage declaration, payment terms, registration notification)

User signs digitally, then can download the contract PDF.

## Step 3: Payment / Financing

Three payment options:
1. **Cash / Bank Transfer**: Direct payment with step-by-step instructions
2. **Credit**: Configurable down payment and loan term with partner bank quotes (APR, monthly payment, total cost)
3. **Leasing**: Configurable term and down payment with leasing partner quotes (monthly, residual value)

Financing partners are loaded from the `financing_partners` table.

## Step 4: Insurance

Mandatory for vehicle registration. Three tiers:
- **Haftpflicht (Liability)**: Legal minimum, ~€38/mo
- **Teilkasko (Partial Cover)**: Adds theft, fire, glass, weather — recommended, ~€67/mo
- **Vollkasko (Comprehensive)**: Full protection including own-fault collision, ~€112/mo

Users can also skip and arrange insurance themselves.

Insurance providers loaded from `financing_partners` table (type = 'insurance').

## Step 5: Transaction Complete

Summary of:
- Vehicle details
- Agreed price
- Contract type (ÖAMTC/ADAC)
- Payment method chosen
- Insurance tier selected

Next steps checklist:
1. Both parties receive signed contract via email
2. Complete payment within 3 business days
3. Schedule vehicle handover and inspection
4. Register at Zulassungsstelle

## Database

`transactions` table tracks the full journey:
- `completion_method`: 'digital' | 'manual'
- `contract_type`: 'oeamtc' | 'adac'
- `payment_method`: 'cash' | 'credit' | 'leasing'
- `insurance_tier`: 'liability' | 'partial' | 'comprehensive'
- `status`: initiated → contract_pending → payment_pending → insurance_pending → completed
- `current_step`: 1-5 (wizard position, resumable)

RLS: Buyers and sellers can view/update their own transactions. Admins have full access.

## Localization

Fully localized in EN and DE under `t.transaction.*` namespace.
