# KPI Dashboard

## Overview

This document defines the key performance indicators (KPIs) that autozon tracks across growth, revenue, product, and operations. Each metric includes its definition, data source, tracking frequency, and targets across the 3-year plan.

---

## North Star Metric

| Metric | Definition | Why It Matters |
|---|---|---|
| **Monthly Gross Merchandise Value (GMV)** | Total value of cars sold through autozon per month | Captures platform adoption, pricing power, and market traction in a single number |

**Targets:**

| Period | GMV Target |
|---|---|
| Y1 Q2 | €150K/month |
| Y1 Q4 | €500K/month |
| Y2 Q4 | €3M/month |
| Y3 Q4 | €8M/month |

---

## Growth Metrics

| KPI | Definition | Source | Frequency | Y1 Target | Y2 Target | Y3 Target |
|---|---|---|---|---|---|---|
| **Monthly Active Listings** | Cars listed and visible on platform | `cars` table (status = active) | Weekly | 200 | 1,500 | 5,000 |
| **Monthly New Listings** | New cars listed per month | `cars` table (created_at) | Weekly | 80 | 500 | 1,500 |
| **Monthly Completed Sales** | Transactions with agreed price | `offers` table (status = accepted) | Weekly | 30 | 250 | 800 |
| **Registered Users** | Total user accounts | `profiles` table | Monthly | 2,000 | 15,000 | 50,000 |
| **Monthly Active Users (MAU)** | Users who logged in within 30 days | Auth sessions | Monthly | 500 | 5,000 | 20,000 |
| **Seller Conversion Rate** | % of registered users who list a car | `cars` / `profiles` | Monthly | 25% | 30% | 35% |
| **Listing-to-Sale Rate** | % of listings that result in a completed sale | `offers` / `cars` | Monthly | 40% | 50% | 55% |

---

## Revenue Metrics

| KPI | Definition | Source | Frequency | Y1 Target | Y2 Target | Y3 Target |
|---|---|---|---|---|---|---|
| **Monthly Revenue** | Total platform revenue (success fees + placement) | Stripe + DB | Monthly | €5K | €50K | €200K |
| **Success Fee Revenue** | 2.5% commission on completed sales | `offers` (agreed_price × 0.025) | Monthly | €3K | €40K | €170K |
| **Placement Fee Revenue** | €49 per premium listing | `cars` (placement_paid = true) | Monthly | €2K | €10K | €30K |
| **Average Revenue Per Transaction (ARPT)** | Revenue earned per completed sale | Revenue / completed sales | Monthly | €100 | €160 | €200 |
| **Take Rate** | Revenue as % of GMV | Revenue / GMV | Monthly | 2.8% | 3.0% | 3.2% |
| **Monthly Recurring Revenue (MRR)** | Recurring subscription revenue (future) | Stripe subscriptions | Monthly | €0 | €5K | €25K |

---

## Unit Economics

| KPI | Definition | Source | Frequency | Y1 Target | Y2 Target | Y3 Target |
|---|---|---|---|---|---|---|
| **Customer Acquisition Cost (CAC)** | Total marketing spend / new transacting users | Marketing budget / new sellers | Monthly | €40 | €35 | €25 |
| **Lifetime Value (LTV)** | Average revenue per user over their lifetime | Revenue cohort analysis | Quarterly | €375 | €455 | €520 |
| **LTV:CAC Ratio** | Return on acquisition investment | LTV / CAC | Quarterly | 9.4x | 13.0x | 20.8x |
| **Payback Period** | Months to recover CAC | CAC / monthly revenue per user | Quarterly | < 2 months | < 1 month | < 1 month |
| **Gross Margin** | Revenue minus direct costs / Revenue | Financial model | Monthly | 94% | 95% | 96% |

---

## Product & Engagement Metrics

| KPI | Definition | Source | Frequency | Y1 Target | Y2 Target | Y3 Target |
|---|---|---|---|---|---|---|
| **Time to First Listing** | Minutes from signup to first car listed | `profiles.created_at` → `cars.created_at` | Weekly | < 15 min | < 10 min | < 8 min |
| **Time to Sale** | Days from listing to accepted offer | `cars.created_at` → `offers.updated_at` | Weekly | < 30 days | < 21 days | < 14 days |
| **Fair Value Accuracy** | % of sales within ±10% of AI fair value | `cars.fair_value_price` vs `offers.agreed_price` | Monthly | 70% | 80% | 85% |
| **Negotiation Completion Rate** | % of started negotiations that reach agreement | `offers` (accepted / total) | Weekly | 50% | 60% | 65% |
| **Average Negotiation Rounds** | Mean rounds used before agreement | `offers.current_round` on accepted | Monthly | 2.1 | 1.8 | 1.6 |
| **Photo Upload Completion** | % of listings with all required photos | `cars.photos` array length | Weekly | 60% | 75% | 85% |
| **Damage Detection Usage** | % of listings that used AI damage scan | `cars.detected_damages` not null | Monthly | 40% | 65% | 80% |
| **Concierge Chat Sessions** | Monthly AI chat conversations | `chat_messages` table | Monthly | 200 | 2,000 | 8,000 |
| **Buyer Match Acceptance Rate** | % of AI-suggested matches liked by buyers | `buyer_selections` (liked = true) | Monthly | 30% | 40% | 50% |

---

## Trust & Quality Metrics

| KPI | Definition | Source | Frequency | Y1 Target | Y2 Target | Y3 Target |
|---|---|---|---|---|---|---|
| **Net Promoter Score (NPS)** | Seller satisfaction (post-sale survey) | Survey tool | Quarterly | > 40 | > 50 | > 60 |
| **Seller Savings vs. Dealer** | Average € saved compared to dealer trade-in | Fair value vs. market dealer offer | Monthly | €2,500 | €3,000 | €3,500 |
| **Dispute Rate** | % of completed sales with disputes | Support tickets / completed sales | Monthly | < 3% | < 2% | < 1% |
| **Fraud Incidents** | Attempted or successful fraud cases | Manual tracking + automated flags | Monthly | 0 | < 5/year | < 10/year |
| **MFA Adoption Rate** | % of users with MFA enrolled | Auth system (AAL2 users) | Monthly | 30% | 50% | 70% |
| **Platform Uptime** | % availability of core services | Infrastructure monitoring | Monthly | 99.5% | 99.9% | 99.95% |

---

## Marketing & Acquisition Metrics

| KPI | Definition | Source | Frequency | Y1 Target | Y2 Target | Y3 Target |
|---|---|---|---|---|---|---|
| **Website Visits** | Monthly unique visitors | Analytics | Monthly | 10K | 80K | 300K |
| **Organic Traffic Share** | % of visits from SEO | Analytics | Monthly | 50% | 65% | 70% |
| **Google Ads CPC** | Cost per click on search campaigns | Google Ads | Weekly | €0.80 | €0.60 | €0.50 |
| **Social Media Followers** | Combined LinkedIn + Instagram | Social platforms | Monthly | 500 | 5,000 | 20,000 |
| **Referral Rate** | % of new users from referrals | Referral tracking | Monthly | 15% | 25% | 30% |
| **Media Mentions** | Press coverage count | PR tracking | Quarterly | 3 | 15 | 30 |
| **Email List Size** | Newsletter subscribers | Email platform | Monthly | 1,000 | 10,000 | 40,000 |

---

## Operational Metrics

| KPI | Definition | Source | Frequency | Y1 Target | Y2 Target | Y3 Target |
|---|---|---|---|---|---|---|
| **Support Response Time** | Average time to first response | Support system | Weekly | < 4 hours | < 2 hours | < 1 hour |
| **Support Ticket Volume** | Monthly support requests | Support system | Weekly | 50 | 300 | 800 |
| **AI Resolution Rate** | % of support queries resolved by AI concierge | `chat_messages` analysis | Monthly | 40% | 60% | 75% |
| **Edge Function Latency (p95)** | 95th percentile response time | Backend logs | Weekly | < 2s | < 1.5s | < 1s |
| **Database Query Performance** | Average query execution time | Backend analytics | Weekly | < 100ms | < 80ms | < 50ms |
| **Deployment Frequency** | Code deployments per week | Git/CI | Weekly | 5 | 10 | 15 |

---

## Geographic Expansion Metrics (Y2+)

| KPI | Definition | Y2 Target (DE) | Y3 Target (DACH) |
|---|---|---|---|
| **New Market Listings** | Monthly listings in expansion markets | 200 | 2,000 |
| **Cross-Border Transactions** | Sales between AT-DE or AT-CH | 10/month | 100/month |
| **Local Partnership Count** | Workshops, banks, clubs per market | 10 (DE) | 30 (DACH) |
| **Market-Specific NPS** | NPS per country | > 35 (DE) | > 40 (DACH) |
| **Regulatory Compliance** | Market-specific legal requirements met | 100% | 100% |

---

## Dashboard Implementation Plan

### Phase 1 — Internal (Y1 Q1–Q2)

| Component | Tool | Status |
|---|---|---|
| Revenue tracking | Stripe Dashboard + manual spreadsheet | Active |
| User metrics | Database queries (SQL) | Active |
| Marketing metrics | Google Analytics + Google Ads | Active |
| KPI spreadsheet | Weekly manual update by founder | Active |

### Phase 2 — Automated (Y1 Q3–Q4)

| Component | Tool | Status |
|---|---|---|
| Real-time admin dashboard | Admin Command Center (built-in) | Ready |
| Automated revenue reports | Stripe webhooks + database views | Planned |
| Cohort analysis | Custom SQL views + charting | Planned |
| Alerting | Threshold-based email alerts | Planned |

### Phase 3 — Investor Portal (Y2)

| Component | Tool | Status |
|---|---|---|
| Investor-facing dashboard | Read-only KPI view in data room | Planned |
| Monthly investor updates | Automated report generation | Planned |
| Benchmark comparison | Industry data integration | Planned |

---

## Reporting Cadence

| Report | Audience | Frequency | Format |
|---|---|---|---|
| **Weekly Pulse** | Founder / team | Weekly (Monday) | 5-metric snapshot (GMV, listings, sales, CAC, NPS) |
| **Monthly Deep Dive** | Founder / advisors | Monthly | Full KPI review with commentary |
| **Quarterly Board Report** | Investors / board | Quarterly | Narrative + metrics + forecast update |
| **Annual Review** | All stakeholders | Annually | Year-in-review with Y+1 targets |

---

*Document status: V1 — For investor data room. Targets calibrated to Base Case financial projections.*
