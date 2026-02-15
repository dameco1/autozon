# Revenue Model & Unit Economics

## Overview

Autozon operates an **asymmetric marketplace model**: buyers use the platform for free to maximize liquidity, while sellers pay a flat listing fee for fair-value services that protect them from engineered dealership depreciation.

---

## Fee Structure

### Primary Revenue: Seller Listing Fees

| Tier | Price | Includes |
|---|---|---|
| **Basic** | €49 | Fair-value appraisal, market demand score, self-service listing |
| **Premium** | €99 | Everything in Basic + buyer matching, AI concierge support, priority visibility |

| Component | Details |
|---|---|
| **Fee Type** | Fixed upfront listing fee |
| **When Charged** | At listing creation via Stripe checkout |
| **Refundable** | No — service delivered immediately (appraisal + listing) |

### Full Service (Planned — V2)

| Component | Details |
|---|---|
| **Fee Type** | Success-based (charged only on completed sale) |
| **Rate** | 2.5% of final agreed sale price |
| **Cap** | €499 maximum per transaction |
| **Includes** | Everything in Premium + pickup, paperwork, fully managed sale |

---

## Revenue Streams (Current & Planned)

### Active (V1 — MVP)

| Stream | Model | Status |
|---|---|---|
| Basic Listing Fee | €49 flat fee | ✅ Live |
| Premium Listing Fee | €99 flat fee | ✅ Live |

### Planned (V1.5 – V3)

| Stream | Model | Target Phase |
|---|---|---|
| Full Service Fee | 2.5% of sale price (capped €499) | V2 |
| Dealer Lead Fees | Per-lead fee for dealer partners receiving buyer/seller referrals | V1.5 |
| Financing Referrals | Commission from financing partner (bank/leasing) on funded deals | V2 |
| Insurance Referrals | Commission on insurance policies sold through platform | V2 |
| Logistics Add-ons | Fee for arranging transport/delivery between buyer and seller | V2 |
| Premium Subscriptions | Monthly subscription for dealers and power sellers (bulk tools, analytics) | V2 |
| **Advertising & Sponsored Content** | Display ads, sponsored listings, partner promotions | V1.5 |
| Data Insights | Anonymized market data licensing to OEMs, insurers, and analysts | V3 |

---

## Advertising & Sponsored Content Revenue

### Overview

Autozon's high-intent automotive audience is uniquely valuable to advertisers. Every user is actively buying or selling a car — creating natural demand for financing, insurance, accessories, and dealer services. Advertising is a **high-margin, scalable** revenue stream that monetizes existing traffic without adding friction to the core user experience.

### Ad Inventory & Placement

| Placement | Location | Format | Pricing Model | Est. CPM / CPC |
|---|---|---|---|---|
| **Homepage Banner** | Landing page hero area & between sections | Display banner (728×90, 300×250) | CPM (cost per 1,000 impressions) | €8–15 CPM |
| **Vehicle Listing Sidebar** | Car detail page (`/car/:id`) sidebar | Contextual display ad | CPM or CPC | €12–25 CPM / €0.80–1.50 CPC |
| **Sponsored Listing** | Car selection feed & search results | Promoted dealer listing (native format) | CPC (cost per click) | €1.50–3.00 CPC |
| **Fair Value Results** | Fair value page (`/fair-value/:id`) | Financing/insurance offer card | CPA (cost per action) | €5–15 CPA |
| **Post-Sale Interstitial** | After negotiation completion | Full-screen insurance/financing offer | CPA | €10–30 CPA |
| **Email / Newsletter** | Weekly market insights email | Sponsored section in email | Flat fee per send | €200–500 per campaign |
| **Dealer Spotlight** | Buyer matches & recommendations | Featured "Trusted Dealer" badge + ad | Monthly subscription | €199–499/month |

### Advertiser Categories

| Category | Example Advertisers | Why They Pay | Ad Placement |
|---|---|---|---|
| **Dealers & Used Car Groups** | Local dealers, Carvago, Autohero | Reach in-market buyers directly | Sponsored listings, homepage, buyer matches |
| **Banks & Financing** | BAWAG, Santander, Raiffeisen | Capture loan-ready buyers at point of purchase | Fair value page, post-sale, car detail sidebar |
| **Insurance Companies** | Allianz, UNIQA, Generali, wefox | Every car sale triggers an insurance event | Post-sale interstitial, car detail page |
| **Leasing Companies** | Porsche Bank, Raiffeisen Leasing | Target buyers considering alternatives to purchase | Fair value page, acquisition options |
| **Accessories & Parts** | A.T.U, Forstinger, Amazon Auto | Cross-sell to engaged car owners | Car detail page, email newsletter |
| **Automotive Clubs** | ÖAMTC, ARBÖ | Membership acquisition from active car owners | Homepage, post-sale, email |
| **Workshops & Service** | Local mechanics, Bosch Car Service | Reach owners maintaining or preparing cars for sale | Seller dashboard, pre-listing tips |

### Advertising Phases

**Phase 1 — Direct Sales (V1.5)**

| Component | Details |
|---|---|
| **Approach** | Founder-sold sponsorships to 5–10 partners (dealers, banks, insurance) |
| **Ad types** | Homepage banner, car detail sidebar, email sponsorship |
| **Tech effort** | Low — static ad placements with impression tracking |
| **Revenue model** | Flat monthly fee per placement (€200–500/month per advertiser) |
| **Target** | 3–5 paying advertisers |

**Phase 2 — Self-Serve Ad Platform (V2)**

| Component | Details |
|---|---|
| **Approach** | Admin dashboard for advertisers to create, target, and track campaigns |
| **Ad types** | All placements + sponsored listings + retargeting |
| **Tech effort** | Medium — ad server, targeting engine, analytics dashboard |
| **Revenue model** | CPM / CPC / CPA with minimum spend requirements |
| **Targeting options** | By car make/model, price range, location, buyer/seller intent |
| **Target** | 20–50 active advertisers |

**Phase 3 — Programmatic & Data-Driven (V3)**

| Component | Details |
|---|---|
| **Approach** | Programmatic ad network with real-time bidding |
| **Ad types** | Dynamic native ads powered by user preference data |
| **Tech effort** | High — RTB integration, ML-based ad optimization |
| **Revenue model** | Automated bidding with platform floor prices |
| **Target** | 100+ advertisers, €50K+/month ad revenue |

### Advertising Revenue Projections

| Year | Advertisers | Avg. Monthly Spend | Monthly Ad Revenue | Annual Ad Revenue |
|---|---|---|---|---|
| **Y1** | 3–5 | €300 | €1,200 | **€14,400** |
| **Y2** | 20–30 | €500 | €12,500 | **€150,000** |
| **Y3** | 50–100 | €800 | €60,000 | **€720,000** |

### Key Metrics

| Metric | Y1 Target | Y2 Target | Y3 Target |
|---|---|---|---|
| **Ad fill rate** | 30% | 60% | 85% |
| **Avg. CPM** | €10 | €15 | €20 |
| **Click-through rate (CTR)** | 1.5% | 2.0% | 2.5% |
| **Ad revenue per user** | €0.50 | €2.00 | €5.00 |
| **Ad revenue as % of total** | 5% | 10% | 15% |

### Why Autozon Ad Inventory is Premium

1. **100% in-market audience** — Every user is actively buying or selling a car (vs. <5% on generic platforms)
2. **High-value transactions** — Average car value €15K–30K; financing, insurance decisions happen simultaneously
3. **Rich intent data** — Budget, preferred makes, fuel type, location, timing — hyper-targeted ad delivery
4. **Low ad fatigue** — Users visit during a defined purchase journey (not daily browsing), so ads feel relevant, not intrusive
5. **Regulated-industry premium** — Financial services and insurance pay premium CPMs for compliant, contextual placements

---

## Unit Economics

### Per-Transaction Economics (Seller Side)

| Metric | Basic (€49) | Premium (€99) | Blended Average |
|---|---|---|---|
| **Listing Fee** | €49 | €99 | €74 |
| **Estimated COGS** | ~€8 | ~€12 | ~€10 |
| **Gross Profit** | €41 | €87 | €64 |
| **Gross Margin** | 84% | 88% | 86% |

*COGS includes AI inference, storage, and Stripe processing fees (~2.9% + €0.25).*

**Blended average assumes 50% Basic / 50% Premium split.** As platform matures, Premium uptake expected to increase to 60–70%.

### Buyer Side

| Metric | Value |
|---|---|
| **Cost to Buyer** | €0 (free) |
| **Rationale** | Maximize buyer liquidity → faster sales → more seller revenue |

### Platform Cost Structure (Estimated Monthly)

| Cost Category | Estimated Monthly | Notes |
|---|---|---|
| Infrastructure (Lovable Cloud) | €50–200 | Scales with usage |
| AI Inference (Lovable AI) | €20–100 | Damage detection, descriptions, chat, market comparison |
| Stripe Processing | ~2.9% + €0.25/txn | On listing fees |
| Domain & SSL | ~€5 | autozon.at |
| **Total Fixed Costs** | ~€100–300/mo | Pre-scale |

---

## Key Metrics & Targets

### North Star Metrics

| Metric | Definition | Y1 Target |
|---|---|---|
| **GMV** | Gross Merchandise Value (total value of cars sold) | €1.5M |
| **Listings** | Total cars listed on platform | 300+ |
| **Seller Conversion** | Listed cars → sold cars | 40%+ |
| **Premium Uptake** | % of sellers choosing Premium (€99) | 50%+ |

### Efficiency Metrics

| Metric | Definition | Target |
|---|---|---|
| **CAC** | Customer Acquisition Cost (seller) | < €30 |
| **LTV** | Lifetime Value per seller | €74+ (1 listing) |
| **LTV:CAC Ratio** | Unit economics health | > 2.5:1 |
| **Time to Sale** | Listing → completed deal | < 21 days |
| **Matching Accuracy** | % of matched buyers who engage | > 60% |

---

## Pricing Philosophy

1. **Simple, transparent pricing** — flat fees are easy to understand and don't penalize sellers of higher-value cars
2. **Low barrier to entry** — €49 Basic is accessible to all sellers, from a €3,000 Opel to a €50,000 Porsche
3. **Value-based upsell** — Premium at €99 delivers measurable additional value (matching, concierge, visibility)
4. **Buyers pay nothing** — this is critical for marketplace liquidity; every additional buyer makes the platform more valuable for sellers
5. **Revenue at listing, not at sale** — reduces revenue risk and cash flow uncertainty compared to success-based models

---

## Revenue Scenarios

### Conservative (Y1)

| Metric | Value |
|---|---|
| Listings/month | 12 |
| Basic (50%) | 6 × €49 = €294 |
| Premium (50%) | 6 × €99 = €594 |
| **Monthly Revenue** | ~€888 |
| **Annual Revenue** | ~€10,650 |

### Base Case (Y1)

| Metric | Value |
|---|---|
| Listings/month | 25 |
| Basic (50%) | 12.5 × €49 = €613 |
| Premium (50%) | 12.5 × €99 = €1,238 |
| **Monthly Revenue** | ~€1,850 |
| **Annual Revenue** | ~€22,200 |

### Optimistic (Y1)

| Metric | Value |
|---|---|
| Listings/month | 42 |
| Basic (40%) | 17 × €49 = €833 |
| Premium (60%) | 25 × €99 = €2,475 |
| **Monthly Revenue** | ~€3,308 |
| **Annual Revenue** | ~€39,700 |

---

## Geographic Expansion Impact

| Phase | Market | Est. Addressable Listings/Year | Revenue Potential |
|---|---|---|---|
| Launch | Austria | ~50,000 private used car sales | €2.5M–5M |
| Phase 2 | Germany | ~3M private used car sales | €50M–150M |
| Phase 3 | DACH + CEE | ~5M+ private used car sales | €250M+ |

---

*Document status: V2 — Updated to flat-fee pricing model (€49 Basic / €99 Premium). For investor data room. Subject to refinement based on actual market performance.*
