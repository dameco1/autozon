

# Radical UX Transformation: AI-First Wizard Platform

## Summary

Transform Autozon from a traditional car marketplace into an AI-first wizard platform with two major changes: (1) a **Hyper Search** natural-language buyer experience, and (2) a **drag-and-drop seller flow** where AI extracts everything from uploaded photos/documents.

---

## Phase 1: Buyer — Hyper Search & Matchmaking

### What changes

The `CarSearchSection` on the homepage gets a **mode toggle** defaulting to "Hyper Search". The new mode shows a single large textarea with a grey placeholder example. On submit, an edge function parses the natural language into structured filters, runs the matching algorithm, and returns Top 5 results.

### Technical steps

1. **New edge function `hyper-search/index.ts`**
   - Accepts `{ query: string }` (the natural language input)
   - Uses Lovable AI (Gemini 3 Flash) with tool calling to extract structured fields: age, location, kids, budget, color, seats, body type, brands, max km, smoker preference, etc.
   - Queries the `cars` table with extracted filters
   - Runs `computeMatchScore` server-side (port the scoring logic or use a simplified version)
   - Returns Top 5 matches ranked by: match score, preference weight, penalty for missing criteria, bonus for strong alignment
   - Returns the extracted structured requirements alongside results so the user can see what was understood

2. **Update `CarSearchSection.tsx`**
   - Add mode state: `"hyper"` (default) and `"standard"`
   - Hyper mode: single large textarea + "Find My Car" button + animated loading state
   - Standard mode: existing filter UI (unchanged)
   - Toggle button to switch modes
   - Results render inline as Top 5 car cards with match scores and extracted criteria summary

3. **New component `HyperSearchResults.tsx`**
   - Displays extracted criteria as tags/chips
   - Shows Top 5 car cards with match score badges
   - "View all results" button navigates to `/car-selection` with extracted filters

---

## Phase 2: Seller — AI-Powered Ad Creation Wizard

### What changes

Replace the current 6-step manual form (`CarUpload.tsx`) with a new AI-first wizard at a new route `/sell` (keep old `/car-upload` for edit mode). The new flow has 6 animated wizard steps.

### Technical steps

4. **New page `src/pages/SellWizard.tsx`** — the main wizard container with step state management and animated transitions.

5. **Step 1 — Upload Everything**
   - Full-width drag-and-drop zone with animation
   - Accept: images (car photos), PDFs (registration doc, driver's license, other docs)
   - Upload all files to `car-images` bucket
   - Categorize files client-side (image vs document) by MIME type
   - Prominent animated instructions

6. **Step 2 — AI Analyzing Animation**
   - "Autozon AI Analyzing Your Vehicle..." with robot/scanning animation
   - Progress indicators (Scanning photos... Reading documents... Detecting damages... Estimating value...)
   - This step triggers the backend processing

7. **New edge function `analyze-car-listing/index.ts`**
   - Receives: array of image URLs + document URLs
   - Orchestrates multiple AI calls:
     a. **Document extraction**: Send document images to Gemini 2.5 Pro (vision) to extract: make, model, year, VIN, mileage, engine type, fuel, transmission, owners, registration validity, color
     b. **Damage detection**: Reuse existing `detect-damage` logic (inline or call)
     c. **Fair value calculation**: Use extracted data + `calculateFairValue` logic
     d. **Ad description generation**: Reuse existing `generate-description` logic
   - Returns structured JSON with all extracted fields, confidence levels, detected damages, fair value, generated description, and list of missing/uncertain fields
   - Strictly deterministic: if data missing → mark as `null` with `"source": "not_found"`; if unclear → mark as `"uncertain"` and flag for user confirmation

8. **Step 3 — Fair Value Analysis**
   - Display detected damages with repair estimates
   - Show valuation breakdown (reuse `AppraisalBreakdown` component)
   - Recommended price range
   - User can adjust/override

9. **Step 4 — Ad Preview Wizard**
   - Show pre-filled ad with all extracted data
   - Missing fields highlighted in orange with inline inputs
   - Fields that need confirmation shown with a confirm/edit toggle
   - Common missing fields: smoker/non-smoker, service history, warranty, inspection details
   - AI-generated description shown with edit capability

10. **Step 5 — Final Step: Save or Place**
    - Two prominent buttons:
      - **Save Ad**: Requires registration → saves to dashboard as draft (status: `draft`), NOT visible to buyers
      - **Place Ad**: Requires registration + payment → ad becomes `available`, visible to buyers
    - This requires a new `draft` status for cars

11. **Database migration**: Add `draft` status support
    - Update the `cars` table status handling to support `draft`
    - Update RLS policies: drafts visible only to owner
    - Update `cars_public` view to exclude drafts

---

## Phase 3: Homepage & Navigation Updates

12. **Update `HeroSection.tsx`**
    - Update seller CTA to point to `/sell` instead of onboarding
    - Update messaging to emphasize AI-first experience

13. **Update `Index.tsx`** section order if needed

14. **Update `App.tsx`** routing
    - Add `/sell` route for `SellWizard`
    - Keep `/car-upload` for edit mode

15. **Translation updates** in `src/i18n/translations.ts` for all new UI text (EN + DE)

---

## What stays unchanged

- Negotiation engine
- Transaction wizard
- Dashboard
- KYC flow
- Authentication flow
- Existing matching algorithm (reused server-side)
- Existing edge functions (detect-damage, vin-decode, generate-description — reused by the new orchestrator)

---

## Implementation order

This is a large effort. Recommended phased delivery:

1. **Phase 2 first** (Seller wizard) — highest impact, most visible change
2. **Phase 1 second** (Hyper Search) — builds on existing matching logic
3. **Phase 3 last** (Homepage/nav integration)

Each phase is independently deployable and testable.

