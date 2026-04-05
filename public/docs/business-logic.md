# Core Business Logic

## 1. Fair Value Algorithm (`calculateFairValue`)

**Location**: `src/components/car-upload/calculateFairValue.ts`

The fair value engine is the core IP of Autozon. It estimates a car's market-fair price **independently of the seller's asking price**, using a multi-factor model.

### How It Works

1. **Reference MSRP Estimation** — Uses model-specific MSRP from `car_models.msrp_eur` when available (populated by AI seeder). Falls back to attribute-based estimation:
   - Brand tier (Porsche €85K → Dacia €18K, 30 brands mapped)
   - Body type multiplier (Convertible 1.25× → Hatchback 0.90×)
   - Power adjustment (linear scale around 150 HP baseline)
   - Fuel type premium (Electric +12%, Diesel -2%)

2. **Depreciation Curve** — Non-linear, brand-tiered:
   - Iconic brands (Porsche, Tesla): 7%/year
   - Premium brands (BMW, Mercedes, Audi): 10%/year
   - Volume brands: 15%/year
   - Formula: `max(0.25, (1 - rate) ^ (age × 0.75))`

3. **Mileage Factor** — Compares actual vs segment-specific expected km/year:
   - Sports cars (Porsche, Z4, 911): 8,000 km/year
   - Hatchbacks: 12,000 km/year
   - Sedans: 15,000 km/year
   - SUVs/Wagons: 18,000 km/year
   - Vans: 25,000 km/year
   - Below average: up to +5% bonus
   - Above average: penalty up to -45%

4. **Condition Factor** — Based on a 1–4 grade scale:
   - Grade 1 (Heavy Wear): score 35 → factor ~0.80
   - Grade 2 (Normal/Fair): score 60 → factor ~0.89
   - Grade 3 (Like New/Good): score 82 → factor ~0.96
   - Grade 4 (New/Excellent): score 96 → factor ~1.01

5. **Damage Cost Deduction** — Replaces flat accident penalty with itemized costs:
   - AI damage detection provides `estimated_repair_cost_eur` per damage (brand-specific)
   - Confirmed damages are summed and deducted as a EUR amount from attribute value
   - Fallback: if no AI scan, brand-tier flat estimate (iconic 20%, premium 15%, volume 10%)
   - Example: scratch on Dacia = ~€300 deduction, same on Porsche = ~€1,500

6. **Equipment Value Index** — Weighted by category:
   - Safety features: 2.5 pts each
   - Tech features: 1.8 pts each
   - Comfort features: 1.2 pts each
   - Capped at +10% total

7. **Market Position** — Body type demand × brand demand:
   - SUVs and Hatchbacks: +4%
   - Toyota, Honda, Porsche, Tesla: +3%

8. **Regional Demand** — Fuel type trends (European market):
   - Electric: +5%, Diesel: -3%

9. **Transparency Bonus** — Rewards complete listings (up to +4%):
   - VIN provided, description quality, photo count, damage scan completed

10. **Inspection Checklist Penalty** — 20-point inspection where YES = good condition:
    - Each "No" answer: −1.5% penalty
    - Each "I don't know" answer: −0.75% penalty
    - Capped at −30% maximum
    - Categories: Exterior (5), Interior (6), Mechanical (5), Test Drive (4)

11. **Final Calculation**: `100% attribute-based` (no asking price influence)
    - Fair value = attribute value × inspection factor − itemized damage costs (min €500)
    - Market blending on FairValueResult page: 40% formula + 60% AI market (if available)
    - Seller can accept AI fair value OR override with custom listing price (deviation % displayed)

### Outputs
- `fairValue` — Estimated market-fair price (EUR)
- `condScore` — Condition score (0-100)
- `demandScore` — Demand score (0-100)

---

## 2. Lifestyle-Aware Buyer Matching Algorithm

**Location**: `src/lib/lifestyleMatch.ts`

The matching engine uses a **5-dimensional weighted scoring model** that combines lifestyle signals, financial fit, explicit preferences, car quality, and sports/towing fit into a single 0-100 match score.

### Score Weights (when sports data present)

| Dimension | Weight | Source |
|---|---|---|
| **Lifestyle** | 25% | Profile: relationship, kids, purpose, current car |
| **Financial** | 25% | Preferences: budget range; fallback: profile budget |
| **Preference Match** | 20% | Preferences: makes, fuel, body, transmission, commute, parking |
| **Condition/Demand** | 10% | Car: condition_score + demand_score averaged |
| **Sports & Towing** | 20% | Preferences: sports, needs_towing, towing_weight_kg; Car: equipment, body_type |

*When no sports data: falls back to original 4D weights (30/30/25/15).*

### Lifestyle Scoring Rules

#### Relationship Status → Body Type Affinity

| Status | Boosted Body Types | Penalized | Brand Affinity | Power Bonus |
|---|---|---|---|---|
| **Single** | Coupe, Convertible, Roadster (+25); Hatchback, Sedan (+15) | Van, Pickup (-10) | Sporty brands +8 | ≥200 HP +5 |
| **Married** | SUV, Wagon, Sedan, Hatchback (+20) | Coupe, Convertible (-5) | Practical brands +5 | Year ≥2020 +5 |
| **Divorced** | Coupe, Convertible (+20); SUV (+10) | Van (-15) | Sporty/premium brands +12 | ≥180 HP +8 |

#### Number of Kids → Seating Requirements

| Kids | Logic | Boosted Types | Penalized Types |
|---|---|---|---|
| **0** | Any body type fine | Compact cars +5 | — |
| **1-2** | Need 4-5 doors | Sedan, SUV, Wagon, Hatch +15 | Coupe, Convertible -15 |
| **3+** | Need 6/7 seaters | Van, large SUV +30; Wagon +15 | Coupe, Convertible, Hatch -20 |

#### Car Purpose

| Purpose | Boosted | Logic |
|---|---|---|
| **Daily** | Practical brands, Diesel/Hybrid/Electric, newer cars | Reliability & efficiency |
| **Work** | Sedan/SUV/Wagon, Diesel/Hybrid, Automatic | Commute comfort |
| **Pleasure** | Sporty bodies & brands, high power (≥200 HP) | Fun factor |
| **Summer** | Convertible/Roadster (+30), Coupe (+15) | Open-top driving |
| **Winter** | SUV/Wagon (+20), Diesel | AWD-friendly, practical |

#### Current Car Intelligence

- **Brand loyalty**: If current car mentions the same make → +10
- **Upgrade path**: Budget brand owner viewing a premium brand → +8 (e.g. Dacia owner sees BMW)
- **Segment continuity**: SUV keywords in current car + SUV/Wagon candidate → +10

### Sports & Towing Scoring Rules (5th Dimension)

**Activated when**: User has selected ≥1 sport in onboarding (Step 11).

The sports & towing sub-score starts at 50 and adjusts across four factors:

#### Storage Fit (40% weight of sub-score)

Evaluates whether the car can carry bulky sports equipment.

| Bulky Sports | Body Type Match | Score Impact |
|---|---|---|
| Cycling, Skiing, Surfing, Golf, Camping | SUV, Wagon, Van | +20 |
| Same sports | Sedan, Hatchback | +5 |
| Same sports | Coupe, Convertible, Roadster | −15 |
| Non-bulky sports (Tennis, Running, etc.) | Any | No adjustment |

#### Roofbox Compatibility (20% weight)

Checks car equipment for roof mounting capability.

| Condition | Score Impact |
|---|---|
| Has bulky sport + car has "roof rails" / "roof rack" / "roof bar" in equipment | +15 |
| Has bulky sport + Coupe/Convertible body + no roof mount | −10 |
| No bulky sports selected | No adjustment |

#### Towing Capability (20% weight)

Evaluated when user sets `needs_towing = true` (Step 12).

| Condition | Score Impact |
|---|---|
| Car has "trailer hitch" / "tow bar" / "Anhängerkupplung" in equipment | +15 |
| No towbar but SUV/Pickup/Van body type (likely factory-optionable) | +5 |
| No towbar + Coupe/Convertible/Hatchback (unlikely to support towing) | −10 |
| Desired towing weight ≥2,500 kg + non-SUV/Pickup/Van body | −10 (additional) |

**Towing weight options**: 750 kg, 1,000 kg, 1,500 kg, 2,000 kg, 2,500 kg, 3,000 kg, 3,500 kg

#### Body Type Suitability for Outdoor Sports (20% weight)

| Condition | Score Impact |
|---|---|
| Has outdoor sport (Cycling, Skiing, Running, Hiking, Surfing, Camping) + SUV/Wagon/Pickup | +10 |
| Same sports + Coupe/Convertible | −8 |
| Motorsports selected + sporty body or sporty brand | +12 |
| Motorsports + ≥200 HP | +5 (additional) |

#### Deprioritization Rule

If the final sports sub-score falls **below 30**, the overall match score is penalized by −10 points (floored at 5). This ensures cars that are fundamentally incompatible with the buyer's active lifestyle are pushed to the bottom of results.

### Preference Scoring (from Onboarding)

| Signal | Logic |
|---|---|
| Preferred makes/fuel/body | Explicit match +15-20; mismatch -5-10 |
| Family size (≥5) | People-carrier bodies +10 |
| Commute distance (long) | Diesel/Hybrid +8, Automatic +3 |
| Commute distance (short) | Electric/Hybrid +10 |
| Parking (street/underground) | Compact +5; Van/Pickup -5 |
| Insurance tolerance (low) | High power -8; sporty brands -5 |

### Onboarding Steps (12 total)

| Step | Content | Data Stored |
|---|---|---|
| 1 | Budget range (min/max) | `user_preferences.min_budget`, `max_budget` |
| 2 | Preferred makes (multi-select) | `user_preferences.preferred_makes` |
| 3 | Preferred fuel types | `user_preferences.preferred_fuel_types` |
| 4 | Preferred body types | `user_preferences.preferred_body_types` |
| 5 | Transmission preference | `user_preferences.preferred_transmission` |
| 6 | Year range | `user_preferences.min_year`, `max_year` |
| 7 | Max mileage | `user_preferences.max_mileage` |
| 8 | Min power (HP) | `user_preferences.min_power_hp` |
| 9 | Commute distance | `user_preferences.commute_distance` |
| 10 | Additional prefs (parking, insurance tolerance, family size, timing) | Various `user_preferences.*` |
| 11 | **Sports & Activities** — Multi-select: Cycling, Skiing, Surfing, Golf, Tennis, Running, Hiking, Camping, Motorsports, Fitness | `user_preferences.sports[]` |
| 12 | **Towing Requirements** — Toggle + weight selector (750–3,500 kg) | `user_preferences.needs_towing`, `towing_weight_kg` |

---

## 3. Negotiation Engine

**Location**: `src/pages/Negotiation.tsx`

Structured multi-round negotiation between buyer and seller:
- Maximum rounds configurable (default: 5)
- Each round: offer → counter-offer
- Status states: `pending`, `countered`, `accepted`, `rejected`, `expired`
- Agreement generates a downloadable PDF (`jsPDF`)
- Fair value displayed as neutral reference point
- **Completed negotiations** (accepted/rejected) are filtered from the dashboard's Active Negotiations sidebar
- **Re-purchase guard**: If a user navigates to an accepted offer for a sold car, they are redirected to the transaction summary

### Self-Dealing Prevention

Users cannot buy or negotiate on their own cars:
- **Database level**: RLS policies on `offers`, `car_shortlists`, and `transactions` enforce `buyer_id != seller_id`
- **Frontend level**: CarDetail blocks shortlisting own cars; BuyerMatches blocks self-offers

---

## 4. Car Status Lifecycle

| Status | Meaning |
|---|---|
| `available` | Listed and visible to buyers |
| `sold` | Transaction completed — shown with SOLD badge on dashboard |

When a transaction completes (digital or manual), `cars.status` is set to `sold`. Sold cars:
- Show red "SOLD" badge on seller dashboard
- Hide edit/delete/place-ad actions
- Show "Transaction" link to full summary at `/acquire/:offerId`

---

## 5. Placement (Premium Listings)

Sellers can pay for premium placement via Stripe:
1. Click "Boost Listing" on dashboard
2. `create-placement-checkout` creates Stripe session
3. User completes payment on Stripe
4. `stripe-webhook` sets `cars.placement_paid = true`
5. Placed cars appear higher in buyer discovery

---

## 6. AI Concierge

Dashboard includes an AI chat assistant that:
- Answers questions about the selling/buying process
- Provides market insights
- Helps with listing optimization
- Streams responses via SSE for real-time feel
- Persists conversation history per user

---

## 7. KYC Identity Verification

**Location**: `src/pages/KycVerification.tsx`

3-step identity verification required before signing a purchase contract:

| Step | Content | Validation |
|---|---|---|
| 1 | **ID Document** — Upload front and back of government ID (passport, driver's license, national ID) | File ≤5 MB, image/* |
| 2 | **Selfie Verification** — Photo of user holding their ID next to face | File ≤5 MB, image/* |
| 3 | **Address Verification** — Street, postal code, city | All fields required |

**Status Flow**: `none` → `pending` → `verified` / `rejected`

Documents uploaded to secure cloud storage (`car-images/kyc/{user_id}/`). KYC status tracked in `profiles.kyc_status`.

---

## 8. Austrian Financing Calculator

**Location**: `src/pages/FinancingCalculator.tsx`

Route: `/financing/:offerId?` — Can be opened standalone or linked to a specific offer.

### Three Financing Models

| Model | Description | Key Parameters |
|---|---|---|
| **Kredit** (Standard Loan) | Standard annuity loan — buyer owns the car | Down payment, term, interest rate |
| **Leasing** (Operating Lease) | Monthly payments, return car at end | Slightly higher rate (+0.5%), no ownership |
| **3-Wege-Finanzierung** (Balloon) | Low monthly payments + 30% residual balloon at end | Best for flexibility |

### Inputs
- Fahrzeugpreis (vehicle price, auto-filled from offer if linked)
- Anzahlung (down payment, 0–40% slider)
- Laufzeit (term, 12–120 months)
- Zinssatz (interest rate, 1.0–12.0%)
- Bearbeitungsgebühr (processing fee, default €250)

### Bonitätsindikator
Simulated creditworthiness indicator (72/100) based on financing structure. Not a real credit check — informational only.

### Partner Banks (Coming Soon)
Raiffeisen, UniCredit Bank Austria, Arval — placeholder cards with "Coming Soon" badges.

---

## 9. Insurance Estimate Calculator

**Location**: `src/components/InsuranceCalculator.tsx`

Austrian-specific motor insurance estimation embedded in the transaction insurance step.

### Inputs
- Vehicle value (€), Power (kW), First registration year
- Bonus-Malus level (0–18, Austrian no-claims scale)
- Kasko type: Teilkasko (partial) or Vollkasko (comprehensive)
- Selbstbehalt (deductible, €0–€2,000)
- Annual km driven

### Outputs
| Line Item | Description |
|---|---|
| **Haftpflicht** (Liability) | Base = €25 + kW × 0.35, adjusted by Bonus-Malus and km |
| **Kasko** | Based on vehicle value, age, power factor, deductible |
| **Combined Premium** | Sum of Haftpflicht + Kasko per month |
| **GAP Insurance** (optional) | For vehicles >€20K, covers gap between value and loan balance |
| **Warranty Extension** (optional) | Age-dependent, kW-scaled monthly add-on |

### Insurance Integration Roadmap

| Milestone | Target | Description |
|---|---|---|
| Durchblicker API | Q3 2026 | Price comparison across Austrian insurers |
| Direct Insurer Integration | Q4 2026 | Instant binding quotes from partner insurers |
| Broker-as-a-Service | 2027 | Full insurance brokerage within the platform |

---

## 10. Vincario Vehicle History Report

**Location**: `src/components/VincarioDataCard.tsx`

Integrated on the car detail page. Decodes VIN via the `vin-decode` edge function.

### Report Contents
- **Vehicle Specs**: Make, model, year, body type, fuel, power, transmission, drive type
- **Stolen Check**: Clear / flagged status
- **Market Value Estimate**: Below average, average, above average price bands
- **Recall Notices**: Open manufacturer recalls (if any)

VIN auto-populated from `cars.vin` when available; manual entry fallback for ad-hoc lookups.

---

*Document status: V5 — Updated with Phase 3 (5D sports & towing scoring, 12-step onboarding) and Phase 4 (financing calculator, insurance estimator, KYC verification, Vincario data card). For investor data room.*
