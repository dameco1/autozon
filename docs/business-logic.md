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

4. **Condition Factor** — Based on exterior/interior sliders (0-100):
   - Range: 0.85 to 1.02

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

## 2. Buyer Matching

Buyers are matched to cars based on:
- Budget range overlap with fair value
- Preferred makes, fuel types, body types
- Location proximity
- Intent level (active vs browsing)
- Match score calculated and stored in `matches` table

---

## 3. Negotiation Engine

**Location**: `src/pages/Negotiation.tsx`

Structured multi-round negotiation between buyer and seller:
- Maximum rounds configurable (default: 5)
- Each round: offer → counter-offer
- Status states: `pending`, `countered`, `accepted`, `rejected`, `expired`
- Agreement generates a downloadable PDF (`jsPDF`)
- Fair value displayed as neutral reference point

---

## 4. Placement (Premium Listings)

Sellers can pay for premium placement via Stripe:
1. Click "Boost Listing" on dashboard
2. `create-placement-checkout` creates Stripe session
3. User completes payment on Stripe
4. `stripe-webhook` sets `cars.placement_paid = true`
5. Placed cars appear higher in buyer discovery

---

## 5. AI Concierge

Dashboard includes an AI chat assistant that:
- Answers questions about the selling/buying process
- Provides market insights
- Helps with listing optimization
- Streams responses via SSE for real-time feel
- Persists conversation history per user
