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
| Data Insights | Anonymized market data licensing to OEMs, insurers, and analysts | V3 |

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
