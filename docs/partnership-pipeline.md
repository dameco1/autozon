# Partnership Pipeline

## Overview

Autozon's partnership strategy follows a **platform flywheel** model: each partnership category increases the value of the platform for users, which attracts more users, which makes autozon more attractive to partners. The pipeline is sequenced to match launch phases — starting with low-friction referral partnerships and scaling to deep integrations.

---

## Partnership Architecture

```
                         ┌─────────────────┐
                         │    autozon       │
                         │   Platform       │
                         └────────┬────────┘
                                  │
           ┌──────────────────────┼──────────────────────┐
           │                      │                      │
    ┌──────▼──────┐       ┌──────▼──────┐       ┌──────▼──────┐
    │  Financing  │       │  Insurance  │       │  Logistics  │
    │  Partners   │       │  Partners   │       │  Partners   │
    └──────┬──────┘       └──────┬──────┘       └──────┬──────┘
           │                      │                      │
    ┌──────▼──────┐       ┌──────▼──────┐       ┌──────▼──────┐
    │ Banks       │       │ Motor ins.  │       │ Transport   │
    │ Leasing co. │       │ Warranty    │       │ Inspection  │
    │ Buy-now-pay │       │ GAP cover   │       │ Registration│
    └─────────────┘       └─────────────┘       └─────────────┘
```

---

## 1. Financing Partners

### Strategic Rationale

Over 60% of used car buyers in Austria require some form of financing. By embedding financing options directly into the post-sale flow, autozon captures additional revenue, increases buyer conversion, and creates stickier platform engagement.

### Target Partners

| Partner | Type | Market | Integration Level | Status | Priority |
|---|---|---|---|---|---|
| **Santander Consumer Bank AT** | Auto loans | Austria | API (quote + application) | Research | High |
| **BAWAG P.S.K.** | Personal & auto loans | Austria | Referral → API | Outreach Q3 | High |
| **Raiffeisen Leasing** | Vehicle leasing | Austria | API (leasing quotes) | Research | Medium |
| **easybank** | Online consumer loans | Austria | Affiliate link | Outreach Q2 | Medium |
| **Porsche Bank** | Captive auto finance | Austria (VW/Audi/Porsche) | Referral | Research | Medium |
| **Klarna / Scalapay** | Buy-now-pay-later | DACH | API widget | Evaluate Y2 | Low |
| **Leasingmarkt.de** | Leasing marketplace | Germany (Y2) | API integration | Research | Low |

### Integration Approach

**Phase 1 — Referral (Y1 Q3–Q4)**

| Component | Details |
|---|---|
| **User flow** | After accepted offer → "Finance this purchase" CTA → Partner landing page (co-branded) |
| **Revenue** | Referral fee per funded application (est. €50–150 per funded deal) |
| **Tech effort** | Low — outbound link with UTM tracking |
| **Data shared** | Car details + agreed price (with user consent) |

**Phase 2 — Embedded Quotes (Y2)**

| Component | Details |
|---|---|
| **User flow** | After accepted offer → See 2–3 financing options inline → Apply within autozon |
| **Revenue** | Commission per funded deal (est. 0.5–1.5% of loan amount) |
| **Tech effort** | Medium — partner API integration, quote display, application handoff |
| **Data shared** | Car details, agreed price, user profile (with consent + GDPR compliance) |

**Phase 3 — Full Embedded Finance (Y3)**

| Component | Details |
|---|---|
| **User flow** | Financing pre-approval during browsing → Instant decision at checkout |
| **Revenue** | Revenue share on funded deals (est. 1–2% of loan value) |
| **Tech effort** | High — real-time API, credit scoring integration, compliance framework |
| **Existing infrastructure** | `acquisition_quotes` table + `financing_partners` table already in database |

### Revenue Projections from Financing

| Year | Funded Deals/Month | Avg. Loan Value | Commission Rate | Monthly Revenue |
|---|---|---|---|---|
| Y1 | 5 | €12,000 | Referral €75 flat | €375 |
| Y2 | 50 | €14,000 | 0.8% | €5,600 |
| Y3 | 200 | €15,000 | 1.2% | €36,000 |

---

## 2. Insurance Partners

### Strategic Rationale

Every car sale triggers an insurance event — the buyer needs new coverage, the seller may cancel existing coverage. Autozon is uniquely positioned at this moment of transition to provide relevant insurance offers.

### Target Partners

| Partner | Type | Market | Integration Level | Status | Priority |
|---|---|---|---|---|---|
| **Allianz Österreich** | Motor insurance | Austria | Referral → API | Research | High |
| **UNIQA** | Motor + warranty | Austria | Referral | Outreach Q4 | High |
| **Generali AT** | Motor insurance | Austria | Referral | Research | Medium |
| **Wiener Städtische** | Motor + GAP | Austria | Referral | Research | Medium |
| **wefox** | Digital insurance broker | DACH | API integration | Evaluate Y2 | Medium |
| **CarGarantie** | Extended warranty | DACH | API (warranty quotes) | Research | Medium |
| **ÖAMTC Schutzbrief** | Roadside + protection | Austria | Co-marketing | Outreach Q3 | High |

### Insurance Products Pipeline

| Product | Trigger Point | User Value | autozon Revenue |
|---|---|---|---|
| **Motor insurance (Haftpflicht + Kasko)** | Buyer completes purchase | Must-have, time-sensitive | €30–80 per policy referral |
| **GAP insurance** | Buyer uses financing | Covers gap between car value and loan balance | €15–30 per policy |
| **Extended warranty** | Buyer purchases older vehicle (3+ years) | Peace of mind on mechanical issues | €20–40 per warranty sold |
| **Seller's liability cover** | Seller lists car | Protection during sale period | €10–15 per listing |
| **Roadside assistance** | Post-purchase upsell | ÖAMTC/ARBÖ membership cross-sell | €5–10 referral fee |

### Integration Approach

**Phase 1 — Post-Sale Referral (Y1 Q4)**

| Component | Details |
|---|---|
| **User flow** | Sale completed → "Insure your new car" card → Partner landing page |
| **Revenue** | Flat referral fee per quoted/purchased policy |
| **Tech effort** | Minimal — CTA with tracking link |

**Phase 2 — Embedded Quotes (Y2 Q2)**

| Component | Details |
|---|---|
| **User flow** | During acquisition options → See insurance quotes inline → Compare & apply |
| **Revenue** | Commission per sold policy (est. 8–15% of first-year premium) |
| **Tech effort** | Medium — partner quote API, comparison display |

### Revenue Projections from Insurance

| Year | Policies Sold/Month | Avg. Commission | Monthly Revenue |
|---|---|---|---|
| Y1 | 5 | €40 | €200 |
| Y2 | 60 | €55 | €3,300 |
| Y3 | 250 | €65 | €16,250 |

---

## 3. Logistics & Services Partners

### Strategic Rationale

The used car transaction doesn't end at price agreement. Buyers need transport, inspection, registration, and sometimes minor repairs. Each of these services is a partnership opportunity that increases platform stickiness and revenue.

### Target Partners

| Partner | Type | Market | Integration Level | Status | Priority |
|---|---|---|---|---|---|
| **ÖAMTC Prüfdienst** | Vehicle inspection | Austria | Referral → booking API | Outreach Q3 | High |
| **ARBÖ** | Vehicle inspection | Austria | Referral | Research | Medium |
| **TÜV Austria** | Technical inspection | Austria | Referral | Research | Medium |
| **Cargo24 / Shiply** | Car transport | DACH | Quote API | Evaluate Y2 | Medium |
| **A.T.U** | Workshop / minor repairs | DACH | Referral | Research | Low |
| **Zulassungsstelle Online** | Digital registration | Austria | API (future) | Research | Low |
| **meinAuto.de** | Registration service | Germany (Y2) | API | Research | Low |

### Services Pipeline

| Service | Trigger Point | User Value | autozon Revenue |
|---|---|---|---|
| **Pre-purchase inspection** | Buyer shortlists car | Independent condition verification | €15–25 per booking referral |
| **Car transport** | Buyer and seller in different cities | Door-to-door delivery | €20–50 per transport booked |
| **Registration service** | Post-purchase | Save time on paperwork | €10–15 per service |
| **Minor repair network** | Pre-listing (seller) | Fix minor issues to increase sale price | Referral commission |
| **Detailing / cleaning** | Pre-listing (seller) | Professional presentation for better photos | Referral commission |

### Integration Approach

**Phase 1 — Curated Recommendations (Y1 Q3)**

| Component | Details |
|---|---|
| **User flow** | Post-sale checklist → "Book an inspection" / "Arrange transport" → Partner page |
| **Revenue** | Flat referral fees |
| **Tech effort** | Minimal — curated partner list with tracking links |

**Phase 2 — Integrated Booking (Y2)**

| Component | Details |
|---|---|
| **User flow** | In-app service marketplace → Compare providers → Book & pay within autozon |
| **Revenue** | Commission per booking (10–20%) |
| **Tech effort** | Medium-High — booking API, payment splitting, status tracking |

---

## 4. Automotive Clubs & Associations

### Strategic Rationale

Austrian automobile clubs (ÖAMTC: 2.1M members, ARBÖ: 400K members) are trusted institutions. A co-marketing partnership provides instant credibility and massive reach at low cost.

### Partnership Opportunities

| Partner | Members | Opportunity | Value to Partner | Value to autozon |
|---|---|---|---|---|
| **ÖAMTC** | 2.1M | "Know your car's true value" co-branded tool | Member benefit, digital innovation showcase | Brand credibility, user acquisition |
| **ARBÖ** | 400K | Fair-value widget on ARBÖ website | Member benefit | Lead generation |
| **Wirtschaftskammer (WKO)** | Business network | Featured as Austrian startup success | Innovation narrative | PR, credibility with dealers |
| **Austrian Startups** | Startup community | Member showcase | Deal flow | Ecosystem visibility |

### ÖAMTC Partnership Concept

| Component | Details |
|---|---|
| **Product** | Co-branded "ÖAMTC x autozon Fair Value Check" |
| **Distribution** | ÖAMTC app, website, member emails |
| **Revenue share** | ÖAMTC earns referral fee per transaction originating from their channels |
| **Timeline** | Pitch Q3 Y1, pilot Q4 Y1, rollout Q1 Y2 |
| **Impact estimate** | 0.5% conversion of ÖAMTC members = 10,500 users |

---

## 5. Technology & Data Partners

| Partner | Type | Purpose | Status |
|---|---|---|---|
| **Eurotax / Schwacke** | Vehicle valuation data | Benchmark pricing data for AI model training | Research |
| **carVertical / CARFAX EU** | Vehicle history reports | VIN-based history checks for buyer confidence | Evaluate Y2 |
| **Stripe** | Payment processing | Success fee collection, placement payments | ✅ Integrated |
| **OpenAI / Google AI** | AI models | Fair value, damage detection, chat, descriptions | ✅ Integrated |
| **Mapbox / Google Maps** | Location services | Buyer-seller proximity, transport quotes | Evaluate Y2 |

---

## 6. Advertising & Sponsored Content Partners

### Strategic Rationale

Autozon's user base is 100% in-market for automotive-related services — financing, insurance, accessories, maintenance. This makes every page view exceptionally valuable to advertisers compared to generic display networks. Advertising creates a **high-margin, scalable revenue stream** that grows proportionally with traffic.

### Advertising Partner Categories

| Partner Type | Examples | Ad Format | Revenue Model |
|---|---|---|---|
| **Dealers & Used Car Groups** | Local dealers, Carvago, Autohero | Sponsored listings, homepage banners | CPC €1.50–3.00, monthly spotlight €199–499 |
| **Banks & Financing** | BAWAG, Santander, Raiffeisen, easybank | Fair value page cards, post-sale offers | CPA €5–15 per application |
| **Insurance Companies** | Allianz, UNIQA, Generali, wefox | Post-sale interstitial, car detail sidebar | CPA €10–30 per policy |
| **Leasing Companies** | Porsche Bank, Raiffeisen Leasing | Acquisition options page, sidebar | CPA €8–20 per lead |
| **Accessories & Parts** | A.T.U, Forstinger, Amazon Auto | Car detail page, email newsletter | CPM €8–15 |
| **Automotive Clubs** | ÖAMTC, ARBÖ, ADAC (DE) | Homepage, post-sale, email | Flat fee per campaign |
| **Workshops & Service** | Bosch Car Service, local mechanics | Seller dashboard, pre-listing tips | CPC €0.80–1.50 |

### Ad Inventory & Placements

| Placement | Page | Format | Pricing |
|---|---|---|---|
| Homepage hero banner | Landing page | 728×90 / 300×250 display | €8–15 CPM |
| Vehicle listing sidebar | Car detail page | Contextual display / native | €12–25 CPM |
| Sponsored listing | Car selection feed | Promoted native listing | €1.50–3.00 CPC |
| Fair value results card | Fair value page | Financing/insurance offer | €5–15 CPA |
| Post-sale interstitial | After negotiation | Full-screen offer | €10–30 CPA |
| Email sponsorship | Weekly insights email | Sponsored section | €200–500 flat per send |
| Dealer spotlight badge | Buyer matches | Featured dealer badge | €199–499/month |

### Integration Approach

**Phase 1 — Direct Sales (V1.5)**
- Founder-sold sponsorships to 5–10 partners
- Static ad placements with impression tracking
- Flat monthly fee per placement (€200–500/month)

**Phase 2 — Self-Serve Platform (V2)**
- Admin dashboard for advertisers: create, target, track campaigns
- Targeting by make/model, price range, location, buyer/seller intent
- CPM / CPC / CPA pricing with minimum spend

**Phase 3 — Programmatic (V3)**
- Real-time bidding integration
- ML-powered ad optimization
- Automated floor pricing, 100+ advertisers

### Advertising Revenue Projections

| Year | Active Advertisers | Avg. Monthly Spend | Monthly Revenue | Annual Revenue |
|---|---|---|---|---|
| Y1 | 3–5 | €300 | €1,200 | **€14,400** |
| Y2 | 20–30 | €500 | €12,500 | **€150,000** |
| Y3 | 50–100 | €800 | €60,000 | **€720,000** |

---

## Partnership Revenue Summary

| Category | Y1 Revenue | Y2 Revenue | Y3 Revenue |
|---|---|---|---|
| **Financing** | €4,500 | €67,200 | €432,000 |
| **Insurance** | €2,400 | €39,600 | €195,000 |
| **Logistics & Services** | €1,200 | €18,000 | €96,000 |
| **Advertising & Sponsored Content** | €14,400 | €150,000 | €720,000 |
| **Automotive Clubs** | €0 | €12,000 | €48,000 |
| **Data Partners** | €0 | €0 | €24,000 |
| **Total Partnership Revenue** | **€22,500** | **€287,000** | **€1,515,000** |
| **% of Total Revenue** | 8% | 15% | 22% |

---

## Partnership Prioritization Framework

| Criterion | Weight | Description |
|---|---|---|
| **Revenue potential** | 30% | Estimated annual revenue contribution |
| **User value** | 25% | How much it improves the user experience |
| **Integration effort** | 20% | Technical and operational complexity (inverse) |
| **Strategic alignment** | 15% | Fit with autozon's mission and positioning |
| **Time to revenue** | 10% | Speed to first revenue from partnership |

### Priority Matrix

| Priority | Partners | Timeline |
|---|---|---|
| **P0 — Launch partners** | ÖAMTC (co-marketing), 1 bank (referral), Stripe (done) | Y1 Q2–Q3 |
| **P1 — Growth partners** | 2nd bank, UNIQA/Allianz (insurance), ÖAMTC Prüfdienst | Y1 Q3–Q4 |
| **P2 — Scale partners** | Embedded finance API, wefox, CarGarantie, transport | Y2 Q1–Q3 |
| **P3 — Expansion partners** | German banks, ADAC, TÜV, meinAuto.de, carVertical | Y2 Q4–Y3 |

---

## Partnership Outreach Tracker

| Partner | Contact Made | Meeting | Proposal Sent | Terms Agreed | Live |
|---|---|---|---|---|---|
| Stripe | ✅ | ✅ | ✅ | ✅ | ✅ |
| ÖAMTC | — | — | — | — | — |
| Santander Consumer Bank | — | — | — | — | — |
| BAWAG P.S.K. | — | — | — | — | — |
| UNIQA | — | — | — | — | — |
| Allianz AT | — | — | — | — | — |
| ÖAMTC Prüfdienst | — | — | — | — | — |
| CarGarantie | — | — | — | — | — |

---

*Document status: V1 — For investor data room. Pipeline updated as outreach progresses.*
