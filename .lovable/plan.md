

# Post-Login Intent Router + Buyer Journey with Smart Matching

## Overview

After login, users will be asked whether they want to **sell** or **buy** a car. Each path leads to a tailored experience:

- **Sellers** go through the existing car upload and fair-value appraisal flow (enhanced with a more robust, authoritative scoring system)
- **Buyers** go through a 10-question discovery questionnaire, then an iterative narrowing process until they reach 2 finalists, followed by a side-by-side comparison with acquisition options (purchase, lease, credit, trade-in)

---

## New Pages and Components

### 1. Intent Selection Page (`/intent`)
- Shown after login/signup if the user hasn't chosen yet
- Two large cards: "I'm Selling a Car" and "I'm Looking to Buy"
- Stores the choice in `user_preferences.user_intent` (new column)
- Selling redirects to `/car-upload`, Buying redirects to `/buyer-questionnaire`

### 2. Buyer Questionnaire Page (`/buyer-questionnaire`)
- 10 sequential questions presented one at a time with animations:
  1. Preferred brand(s) - multi-select from top 20 brands
  2. Body type preference - SUV, Sedan, Hatchback, etc.
  3. Fuel type - Petrol, Diesel, Electric, Hybrid, Plug-in Hybrid
  4. Transmission - Manual or Automatic
  5. Budget range - min/max slider
  6. Year range - min/max
  7. Maximum mileage - slider
  8. Must-have features - multi-select (top 10 features)
  9. Preferred color(s) - multi-select
  10. How soon do you need it? - Immediately / 1-3 months / Just browsing
- Progress bar at top
- Saves answers to `user_preferences` (updates existing columns + new ones)

### 3. Car Selection Page (`/car-selection`)
- Displays 10 matching cars from the database based on questionnaire answers
- Each car is a card with key specs, fair value, and a "Like" / "Skip" toggle
- User selects the ones they like, then clicks "Narrow Down"
- **Round-based narrowing:**
  - Round 1: 10 cars shown, user picks favorites
  - Round 2+: Remaining picks shown, user can narrow further OR request "Show More Matches" to add more cars
  - Continues until exactly 2 cars remain
- When down to 2: automatic redirect to comparison page

### 4. Side-by-Side Comparison Page (`/compare`)
- Two finalist cars displayed side by side
- Full spec comparison grid (year, mileage, fuel, power, condition, demand, equipment)
- Price and fair value comparison
- **Acquisition Options Section** for each car:
  - **Purchase**: Full price, negotiation guidance
  - **Credit/Financing**: Monthly payment calculator (adjustable term, rate, down payment)
  - **Leasing**: Estimated monthly lease (based on residual value formula)
  - **Trade-In**: If user also has a car listed, show trade-in value offset
- "Connect with Partner" buttons (placeholder for future bank/insurance/leasing integrations)
- Final "Choose This Car" CTA on each side

### 5. Enhanced Fair-Value Algorithm (Seller Side)
The existing `calculateFairValue` in CarUpload will be enhanced to be more authoritative:
- **Market Position Factor**: Based on make/model demand data
- **Equipment Value Index**: Weighted equipment scoring (safety features worth more than cosmetic)
- **Regional Demand Multiplier**: Based on fuel type trends (EVs in cities, diesel in rural)
- **Transparency Score**: Sellers who provide more data (VIN, photos, full history) get a trust bonus that buyers can see
- **Depreciation Curve**: Non-linear, model-specific curves instead of flat percentages
- Score breakdown shown to both buyer and seller so both sides understand the valuation

---

## Database Changes

New column on `user_preferences`:
- `user_intent` (text, nullable, default null) - "selling" or "buying"
- `preferred_colors` (text[], default '{}') - for buyer questionnaire

New table `buyer_selections` to track the narrowing rounds:
- `id` (uuid, PK)
- `user_id` (uuid, NOT NULL)
- `car_id` (uuid, NOT NULL)
- `round` (integer) - which round
- `liked` (boolean) - whether user liked or skipped
- `created_at` (timestamptz)

RLS: Users can only CRUD their own selections.

---

## Flow Diagram

```text
  Login/Signup
       |
       v
  +------------------+
  |  Intent Screen   |
  |  Sell or Buy?    |
  +------------------+
       |           |
    Sell          Buy
       |           |
       v           v
  Car Upload    10 Questions
       |           |
       v           v
  Fair Value    10 Car Matches
  Result           |
       |           v
  Buyer        Narrow Down
  Matches      (iterative)
                   |
                   v
              2 Finalists
                   |
                   v
              Side-by-Side
              Comparison +
              Acquisition
              Options
```

---

## Routing Updates

| Route | Page |
|-------|------|
| `/intent` | Intent selection (sell vs buy) |
| `/buyer-questionnaire` | 10-question discovery |
| `/car-selection` | Iterative narrowing |
| `/compare` | Side-by-side finalist comparison |

Login and Signup pages will redirect to `/intent` instead of `/dashboard`.

---

## Technical Details

### Files to Create
- `src/pages/IntentSelection.tsx` - Sell vs Buy chooser
- `src/pages/BuyerQuestionnaire.tsx` - 10-step questionnaire
- `src/pages/CarSelection.tsx` - Iterative car selection/narrowing
- `src/pages/CarComparison.tsx` - Side-by-side comparison with financing options

### Files to Modify
- `src/App.tsx` - Add 4 new routes
- `src/pages/Login.tsx` - Redirect to `/intent` after login
- `src/pages/Signup.tsx` - Redirect to `/intent` after signup
- `src/pages/CarUpload.tsx` - Enhanced fair-value algorithm
- `src/i18n/translations.ts` - All new EN/DE translation keys
- Database migration for new columns and table

### Acquisition Options Calculators
- **Credit**: Existing financing calculator logic (amortization formula)
- **Leasing**: Residual value = price * (1 - depreciation_rate * term_years); monthly = (price - residual + interest) / months
- **Trade-In**: If user has a listed car, subtract its fair_value_price from the target car's price
- **Partner Integration**: Placeholder buttons ("Connect with Bank", "Get Insurance Quote", "Leasing Partner") -- designed as hooks for future API integrations with banks, insurers, and leasing companies

