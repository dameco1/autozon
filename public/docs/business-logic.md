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

5. **Equipment Value Index** — Weighted by category:
   - Safety features: 2.5 pts each
   - Tech features: 1.8 pts each
   - Comfort features: 1.2 pts each
   - Capped at +10% total

6. **Market Position** — Body type demand × brand demand:
   - SUVs and Hatchbacks: +4%
   - Toyota, Honda, Porsche, Tesla: +3%

7. **Regional Demand** — Fuel type trends (European market):
   - Electric: +5%, Diesel: -3%

8. **Transparency Bonus** — Rewards complete listings (up to +4%):
   - VIN provided, description quality, photo count, damage scan completed

9. **Final Calculation**: `100% attribute-based` (no asking price influence)
   - Fair value = attribute value − itemized damage costs (min €500)
   - Market blending on FairValueResult page: 40% formula + 60% AI market (if available)

### Outputs
- `fairValue` — Estimated market-fair price (EUR)
- `condScore` — Condition score (0-100)
- `demandScore` — Demand score (0-100)

---

## 2. Lifestyle-Aware Buyer Matching Algorithm

**Location**: `src/lib/lifestyleMatch.ts`

The matching engine uses a **4-dimensional weighted scoring model** that combines lifestyle signals, financial fit, explicit preferences, and car quality into a single 0-100 match score.

### Score Weights

| Dimension | Weight | Source |
|---|---|---|
| **Lifestyle** | 30% | Profile: relationship, kids, purpose, current car |
| **Financial** | 30% | Preferences: budget range; fallback: profile budget |
| **Preference Match** | 25% | Preferences: makes, fuel, body, transmission, commute, parking |
| **Condition/Demand** | 15% | Car: condition_score + demand_score averaged |

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

### Preference Scoring (from Onboarding)

| Signal | Logic |
|---|---|
| Preferred makes/fuel/body | Explicit match +15-20; mismatch -5-10 |
| Family size (≥5) | People-carrier bodies +10 |
| Commute distance (long) | Diesel/Hybrid +8, Automatic +3 |
| Commute distance (short) | Electric/Hybrid +10 |
| Parking (street/underground) | Compact +5; Van/Pickup -5 |
| Insurance tolerance (low) | High power -8; sporty brands -5 |

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
