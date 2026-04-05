
# Full Feature Implementation Plan — Phased Rollout

This plan covers all 14 items organized into 4 implementation phases. Each phase builds on the previous one.

---

## Phase 1: Quick Wins (Items 1, 2, 7, 13)

### 1.1 Transmission Field
- Update `TRANSMISSIONS` in `constants.ts`: add `"Semi-Automatic"` and `"CVT"`
- Add a dedicated Transmission `<Select>` to `StepBasicInfo.tsx` (currently transmission is auto-set from variant/VIN but has no standalone selector for manual entry)
- Display transmission on homepage car cards in `CarSearchSection.tsx` and car detail pages

### 1.2 Xenon Headlights Equipment
- Add `"Xenon Headlights"` to `EQUIPMENT_LIST` in `constants.ts` after the existing Lighting section (after "Fog Lights", before "Ambient Lighting")
- Update slice indices in `StepEquipment.tsx` `EQUIPMENT_CATEGORIES` to accommodate the new item

### 1.3 Inspection — Wrap & PPF Questions
- Add two new items to the `"exterior"` category in `inspectionChecklist.ts`:
  - `"wrapped"`: "Is the car professionally wrapped?" (boolean, no price impact)
  - `"ppf"`: "Is the car covered with PPF (Paint Protection Film)?" (boolean, +1-3% value)
- Update `calculateFairValue.ts` to apply a +1-3% bonus when PPF is marked "yes"

### 1.4 Coming Soon Boxes (Spare Parts & Merchandise)
- Add two greyed-out placeholder cards on the ad placement / car detail page with "Spare Parts — Coming Soon" and "Brand Merchandise — Coming Soon" labels

**Files touched:** `constants.ts`, `StepBasicInfo.tsx`, `StepEquipment.tsx`, `inspectionChecklist.ts`, `calculateFairValue.ts`, `CarDetail.tsx` or relevant ad placement component

---

## Phase 2: Admin Overhaul (Items 3, 4, 5)

### 3.1 Complete Admin Navigation
- Add new tabs to `AdminDashboard.tsx`: **Contracts**, **Reports**, **Financing Requests**, **Insurance Requests**
- Create placeholder components:
  - `AdminContracts.tsx` — list all transactions with contract details
  - `AdminReports.tsx` — summary/export views
  - `AdminFinancingRequests.tsx` — list acquisition_quotes
  - `AdminInsuranceRequests.tsx` — list transactions filtered by insurance data
- All tabs already behind `useAdminAuth` role check

### 4.0 User Card (Full Profile View)
- Create `AdminUserCard.tsx` — a dialog/page that opens when clicking a user name in `AdminUsersTable`
- Sections:
  - **User Details**: full_name, email (from auth via edge function), phone, city/country, created_at, last_sign_in (via edge function), suspended status
  - **Activity**: cars posted (count from `cars`), cars purchased/sold (from `transactions`), negotiations (from `offers`), contracts (from `transactions`)
  - **Admin Actions**: Suspend/unsuspend, reset password, export user data as JSON
- Update `admin-actions` edge function to support a `get_user_details` action that returns auth metadata (email, last_sign_in)
- Add RLS: admins already have SELECT on all relevant tables

### 5.0 Car Card (Full Vehicle View)
- Create `AdminCarCard.tsx` — dialog/page opened from `AdminCarsTable`
- Sections:
  - **Specs**: all car fields, equipment list, inspection checklist results, photos
  - **VIN/Vincario**: display stored VIN data
  - **Ownership**: owner profile link, listing date, sold status, buyer info if sold
  - **History**: offers/negotiations on this car, transactions, financing/insurance requests
  - **Admin Actions**: edit listing (inline status change), suspend listing
- Query joins: `cars` + `offers` (by car_id) + `transactions` (by car_id) + `profiles` (owner)

**New files:** `AdminContracts.tsx`, `AdminReports.tsx`, `AdminFinancingRequests.tsx`, `AdminInsuranceRequests.tsx`, `AdminUserCard.tsx`, `AdminCarCard.tsx`
**Modified:** `AdminDashboard.tsx`, `AdminUsersTable.tsx`, `AdminCarsTable.tsx`, `admin-actions/index.ts`

---

## Phase 3: Lifestyle Algorithm (Item 6)

### 6.1 New Questions — Database
- **Migration**: Add columns to `user_preferences`:
  - `sports` (text[] — cycling, skiing, running, gym, motorsports, other)
  - `needs_towing` (boolean, default false)
  - `towing_weight_kg` (integer, nullable — 750, 1500, 2500, 3500)

### 6.2 UI — Questionnaire Updates
- Add sports multi-select and towing toggle to `BuyerQuestionnaire.tsx` or `Onboarding.tsx`
- Conditional towing weight selector when `needs_towing = true`

### 6.3 Algorithm Updates (`lifestyleMatch.ts`)
- Add `equipment` and `body_type` to `CarCandidate` interface (equipment already exists)
- New scoring dimensions:
  - **Storage fit (40%)**: Map sports to required cargo volume; check body_type capacity; exclude cars that can't fit equipment
  - **Roofbox compatibility (20%)**: Check if car has "Roof Rails" or "Roof Rack" in equipment
  - **Towing capability (20%)**: Check for "Trailer Hitch" or "Tow Bar" in equipment; body_type-based towing capacity estimation
  - **Body type suitability (20%)**: SUV/Wagon bonus for outdoor sports; sedan/coupe penalty for bulky gear
- These 4 dimensions produce a lifestyle-sports sub-score blended into the existing 4D score
- Cars scoring < 70 on the lifestyle-sports dimension get deprioritized

**Files:** Migration SQL, `user_preferences` types, `BuyerQuestionnaire.tsx`, `lifestyleMatch.ts`, `types.ts` (Supabase types auto-update)

---

## Phase 4: Financing, Insurance, KYC, Vincario (Items 8, 9, 10, 11, 12)

### 8.0 Vincario Data Card
- Create `VincarioDataCard.tsx` component for the ad placement / car detail page
- If VIN exists: auto-show specs, spare parts info, compliance, stolen check, market value, recalls
- If VIN missing: prompt VIN entry
- "Powered by Vincario" badge + "View Full Report" link
- Data source: call `vin-decode` edge function (already exists)

### 9.0 Austrian Financing Calculator
- Create new page `FinancingCalculator.tsx` at `/financing/:offerId?`
- Two modes: INFO (always available) / APPLY (enabled post-negotiation)
- Inputs: Fahrzeugpreis, Anzahlung (0-40%), Laufzeit (12-120), Restwert, Zinssatz, Bearbeitungsgebühr, Versicherungspakete
- Outputs: Monatliche Rate, Effektiver Jahreszins, Gesamtkosten, Restwertzahlung
- Comparison table: Kredit vs Leasing vs 3-Wege-Finanzierung
- Optional: Bonitatsindikator display (static for now)
- Partner bank logos (Raiffeisen, UniCredit, Arval) as "coming soon" integrations
- Route added to `App.tsx`

### 10.0 KYC Module
- **Migration**: Add `kyc_status` column to `profiles` (enum: none, pending, verified, rejected)
- Create `KycVerification.tsx` page — triggered after negotiation accepted, before contract
- Steps: ID upload (front/back) + selfie capture → stored in `car-images` bucket under `/kyc/{userId}/`
- Address verification field
- Update `AdminUserCard` to show KYC status
- Guard contract step: if `kyc_status !== 'verified'`, redirect to KYC page

### 11.0 Insurance Estimate Calculator
- Create `InsuranceCalculator.tsx` component
- Inputs: vehicle type, KW/PS, Erstzulassung, Neuwert, Regionalklasse, Bonus-Malus-Stufe, Kasko type, Selbstbehalt, Fahrerprofil, km/year
- Outputs: Haftpflicht monthly, Kasko monthly, combined premium, GAP optional, warranty optional
- Austrian-specific formula-based estimation (no external API for now)
- Integrated into transaction flow Step 4 (Insurance)

### 12.0 Insurance Roadmap
- Display as an info section within the insurance step showing future integration options (Durchblicker API, direct insurer integration, broker-as-a-service)
- No code logic needed — informational UI only

**New files:** `VincarioDataCard.tsx`, `FinancingCalculator.tsx`, `KycVerification.tsx`, `InsuranceCalculator.tsx`
**Modified:** `App.tsx` (routes), `AcquisitionOptions.tsx`, `StepInsurance.tsx`, `StepContract.tsx`, migration SQL
**Edge function updates:** `admin-actions` (KYC status management)

---

## Implementation Order

Given the scope, I recommend implementing in this exact order across multiple sessions:

1. **Phase 1** first — all quick, low-risk changes
2. **Phase 2** next — admin expansion
3. **Phase 3** — algorithm work
4. **Phase 4** — complex calculators and KYC

Shall I proceed with **Phase 1** now?
