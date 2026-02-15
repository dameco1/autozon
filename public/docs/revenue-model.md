# Revenue Model & Unit Economics

## Overview

Autozon operates an **asymmetric marketplace model**: buyers use the platform for free to maximize liquidity, while sellers pay for fair-value services that protect them from engineered dealership depreciation.

---

## Fee Structure

### Primary Revenue: Seller Success Fee

| Component | Details |
|---|---|
| **Fee Type** | Success-based (charged only on completed sale) |
| **Rate** | 2.5% of final agreed sale price |
| **Cap** | €499 maximum per transaction |
| **Minimum** | €49 (equivalent to placement fee) |
| **When Charged** | After buyer and seller reach agreement via negotiation |

**Example Transactions:**

| Car Sale Price | 2.5% Fee | Cap Applied | Seller Pays |
|---|---|---|---|
| €5,000 | €125 | No | €125 |
| €12,000 | €300 | No | €300 |
| €20,000 | €500 | Yes (€499 cap) | €499 |
| €45,000 | €1,125 | Yes (€499 cap) | €499 |

### Secondary Revenue: Placement Fee

| Component | Details |
|---|---|
| **Fee Type** | Fixed upfront fee |
| **Amount** | €49 per listing |
| **Purpose** | Premium placement in buyer matching algorithm |
| **Payment** | Stripe checkout (opens in new tab) |
| **Deductible** | Credited toward success fee if sale completes |

---

## Revenue Streams (Current & Planned)

### Active (V1 — MVP)

| Stream | Model | Status |
|---|---|---|
| Seller Success Fee | 2.5% of sale price (capped €499) | ✅ Live |
| Placement Fee | €49 flat fee per listing | ✅ Live |

### Planned (V1.5 – V3)

| Stream | Model | Target Phase |
|---|---|---|
| Dealer Lead Fees | Per-lead fee for dealer partners receiving buyer/seller referrals | V1.5 |
| Financing Referrals | Commission from financing partner (bank/leasing) on funded deals | V2 |
| Insurance Referrals | Commission on insurance policies sold through platform | V2 |
| Logistics Add-ons | Fee for arranging transport/delivery between buyer and seller | V2 |
| Premium Subscriptions | Monthly subscription for dealers and power sellers (bulk tools, analytics) | V2 |
| Data Insights | Anonymized market data licensing to OEMs, insurers, and analysts | V3 |

---

## Unit Economics

### Per-Transaction Economics (Seller Side)

| Metric | Value | Notes |
|---|---|---|
| **Average Sale Price (ASP)** | €15,000 | Target for AT/DE used car market |
| **Average Success Fee** | €375 | 2.5% × €15,000 |
| **Placement Fee Revenue** | €49 | Per listing, credited on success |
| **Net Revenue per Transaction** | €375 | Success fee (placement credited) |
| **Estimated COGS per Transaction** | ~€15 | AI inference, storage, Stripe fees (~2.9% + €0.25 on €49) |
| **Gross Margin per Transaction** | ~€360 | ~96% gross margin |

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
| Stripe Processing | ~2.9% + €0.25/txn | On placement fees |
| Domain & SSL | ~€5 | autozon.at |
| **Total Fixed Costs** | ~€100–300/mo | Pre-scale |

---

## Key Metrics & Targets

### North Star Metrics

| Metric | Definition | Y1 Target |
|---|---|---|
| **GMV** | Gross Merchandise Value (total value of cars sold) | €1.5M |
| **Take Rate** | Net revenue / GMV | 2.0–2.5% |
| **Transactions** | Completed sales per month | 8–10/mo |
| **Seller Conversion** | Listed cars → sold cars | 40%+ |

### Efficiency Metrics

| Metric | Definition | Target |
|---|---|---|
| **CAC** | Customer Acquisition Cost (seller) | < €50 |
| **LTV** | Lifetime Value per seller | €375+ (1 transaction) |
| **LTV:CAC Ratio** | Unit economics health | > 7:1 |
| **Time to Sale** | Listing → completed deal | < 21 days |
| **Matching Accuracy** | % of matched buyers who engage | > 60% |

---

## Pricing Philosophy

1. **Sellers are protected, not exploited** — the 2.5% fee is dramatically lower than the 15–30% "hidden fee" dealers extract through engineered depreciation
2. **Cap at €499** ensures high-value car sellers aren't penalized — a €50,000 Porsche owner pays the same as a €20,000 BMW owner
3. **Buyers pay nothing** — this is critical for marketplace liquidity; every additional buyer makes the platform more valuable for sellers
4. **Success-based alignment** — autozon only earns when the seller earns, creating trust and aligned incentives
5. **Placement fee as commitment signal** — €49 filters out non-serious listings while being low enough to not deter genuine sellers

---

## Revenue Scenarios

### Conservative (Y1)

| Metric | Value |
|---|---|
| Transactions/month | 5 |
| ASP | €12,000 |
| Avg Success Fee | €300 |
| Placement Fees | €245/mo |
| **Monthly Revenue** | ~€1,745 |
| **Annual Revenue** | ~€21,000 |

### Base Case (Y1)

| Metric | Value |
|---|---|
| Transactions/month | 10 |
| ASP | €15,000 |
| Avg Success Fee | €375 |
| Placement Fees | €490/mo |
| **Monthly Revenue** | ~€4,240 |
| **Annual Revenue** | ~€51,000 |

### Optimistic (Y1)

| Metric | Value |
|---|---|
| Transactions/month | 20 |
| ASP | €18,000 |
| Avg Success Fee | €450 |
| Placement Fees | €980/mo |
| **Monthly Revenue** | ~€9,980 |
| **Annual Revenue** | ~€120,000 |

---

## Geographic Expansion Impact

| Phase | Market | Est. Addressable Transactions/Year | Revenue Potential |
|---|---|---|---|
| Launch | Austria | ~50,000 private used car sales | €500K–2M |
| Phase 2 | Germany | ~3M private used car sales | €10M–50M |
| Phase 3 | DACH + CEE | ~5M+ private used car sales | €50M+ |

---

*Document status: V1 — For investor data room. Subject to refinement based on actual market performance.*
