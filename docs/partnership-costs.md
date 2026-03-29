# Partnership Costs & ROI Analysis

## Overview

This document provides a detailed cost-benefit analysis of each proposed API integration partner, including setup costs, ongoing expenses, revenue projections, and break-even timelines. All figures are in EUR.

---

## 1. Qover — Embedded Motor Insurance API

### Partner Profile

| Attribute | Details |
|---|---|
| **Company** | Qover (Brussels, Belgium) |
| **Type** | API-first embedded insurance platform |
| **Coverage** | Pan-European (AT, DE, FR, NL, BE, ES, IT, UK) |
| **Products** | Motor liability (Haftpflicht), partial cover (Teilkasko), comprehensive (Vollkasko) |
| **Regulatory** | Licensed insurance intermediary (EU-wide) |
| **Integration** | REST API — quotes, policy binding, claims management |

### Cost Structure

| Cost Item | Amount | Notes |
|---|---|---|
| **Setup fee** | €0 | Commission-based model — no upfront cost |
| **Monthly platform fee** | €0 | No minimum commitment |
| **API development effort** | ~20–30 hours | Edge function for quote retrieval + UI for comparison |
| **Ongoing maintenance** | ~2 hours/month | API version updates, monitoring |
| **Compliance review** | ~€1,000 one-time | Legal review of intermediary agreement |

### Revenue Model

| Metric | Value |
|---|---|
| **Commission type** | % of first-year premium |
| **Commission rate** | 15–25% (depending on product and volume) |
| **Average motor premium (AT)** | €800–1,200/year |
| **Per-policy commission** | €120–300 |
| **Renewal commission** | 5–10% of renewal premium (ongoing) |

### Revenue Projections

| Year | Policies/Month | Avg. Commission | Monthly Revenue | Annual Revenue |
|---|---|---|---|---|
| **Y1** | 10–15 | €180 | €2,250 | **€27,000** |
| **Y2** | 60–80 | €200 | €14,000 | **€168,000** |
| **Y3** | 200–300 | €220 | €55,000 | **€660,000** |

### Break-Even Analysis

| Metric | Value |
|---|---|
| **Total setup cost** | ~€4,000 (dev time + legal) |
| **Break-even** | Month 2 (at 10 policies/month) |
| **ROI Year 1** | ~575% |
| **Priority** | 🔴 **HIGH** — zero upfront cost, immediate revenue |

---

## 2. finAPI — PSD2 Open Banking (AT/DE)

### Partner Profile

| Attribute | Details |
|---|---|
| **Company** | finAPI GmbH (Munich, Germany) |
| **Type** | PSD2-licensed open banking middleware |
| **Coverage** | Austria, Germany, Switzerland |
| **Products** | Bank account verification, SEPA instant payments, identity verification, credit checks |
| **Regulatory** | BaFin-regulated payment initiation service provider (PISP) |
| **Integration** | REST API with OAuth2 + webhooks |

### Cost Structure

| Cost Item | Amount | Notes |
|---|---|---|
| **Setup fee** | €0–2,000 | Depends on plan tier |
| **Monthly base fee** | €200–500 | Scales with call volume |
| **Per-API-call fee** | €0.05–0.50 | Depends on service (identity €0.50, payments €0.10) |
| **API development effort** | ~40–60 hours | Payment initiation + identity verification flows |
| **Ongoing maintenance** | ~3 hours/month | PSD2 compliance updates, monitoring |
| **Compliance review** | ~€2,000 one-time | GDPR data processing agreement |

### Revenue / Savings Model

| Use Case | Impact | Value |
|---|---|---|
| **SEPA instant payments** | Replace Stripe for bank transfers (2.9% → 0.1% per txn) | €2.80 saved per €100 transaction |
| **Identity verification (KYC)** | Automated seller verification | Enables KYC feature (V1.5 roadmap) |
| **Credit checks** | Pre-qualify buyers for financing | Increases financing conversion by 20–30% |
| **Account verification** | Confirm buyer has funds | Reduces failed transactions |

### Cost-Savings Projections

| Year | Monthly Transactions | Stripe Fee Saved | finAPI Cost | Net Monthly Savings |
|---|---|---|---|---|
| **Y1** | 50 | €725 | €350 | **€375** |
| **Y2** | 300 | €4,350 | €800 | **€3,550** |
| **Y3** | 1,000 | €14,500 | €1,500 | **€13,000** |

### Break-Even Analysis

| Metric | Value |
|---|---|
| **Total setup cost** | ~€8,000 (dev time + compliance + setup fee) |
| **Break-even** | Month 8–10 (net savings vs. Stripe) |
| **ROI Year 1** | ~-15% (investment year) |
| **ROI Year 2** | ~430% |
| **Priority** | 🟡 **MEDIUM** — strategic value for KYC + payment savings, but higher upfront cost |

---

## 3. Local Banking Partners — BAWAG & Santander Consumer Bank AT

### Partner Profile

| Attribute | BAWAG P.S.K. | Santander Consumer Bank AT |
|---|---|---|
| **Type** | Full-service bank | Auto financing specialist |
| **Market** | Austria | Austria |
| **Products** | Personal loans, auto loans | Auto loans, dealer financing |
| **Integration** | Referral tracking → API (Phase 2) | Referral tracking → API (Phase 2) |
| **Regulatory** | FMA-regulated | FMA-regulated |

### Cost Structure

| Cost Item | Amount | Notes |
|---|---|---|
| **Setup fee** | €0 | Referral partnerships have no setup cost |
| **Monthly fee** | €0 | Performance-based model |
| **Referral tracking development** | ~10–15 hours | UTM links, click tracking, conversion attribution |
| **API integration (Phase 2)** | ~30–50 hours | Embedded quote engine, application handoff |
| **Compliance review** | ~€500 one-time | Referral agreement review |

### Revenue Model

| Metric | BAWAG | Santander |
|---|---|---|
| **Referral fee** | €150–200 per funded deal | €150–200 per funded deal |
| **Conversion rate** | 8–12% of referred users | 10–15% of referred users |
| **Average loan amount** | €12,000–18,000 | €10,000–15,000 |
| **Phase 2 commission** | 0.5–1.5% of loan amount | 0.5–1.5% of loan amount |

### Revenue Projections (Combined)

| Year | Referrals/Month | Funded Deals/Month | Avg. Fee | Monthly Revenue | Annual Revenue |
|---|---|---|---|---|---|
| **Y1** | 30 | 3 | €175 | €525 | **€6,300** |
| **Y2** | 200 | 25 | €175 | €4,375 | **€52,500** |
| **Y3** | 600 | 75 | €200 | €15,000 | **€180,000** |

### Break-Even Analysis

| Metric | Value |
|---|---|
| **Total setup cost** | ~€2,000 (dev time + legal) |
| **Break-even** | Month 4 (at 3 funded deals/month) |
| **ROI Year 1** | ~215% |
| **Priority** | 🔴 **HIGH** — zero cost, immediate revenue, low dev effort |

---

## 4. Nordea Car Finance API — Deprioritized

### Rationale for Deprioritization

| Factor | Assessment |
|---|---|
| **Market coverage** | Nordic focus — no AT/DE banking licenses |
| **API maturity** | Good (PSD2 sandbox, REST API) |
| **Relevance to Autozon** | Low — Austrian/German buyers need local bank partnerships |
| **Recommendation** | Skip for V1–V2. Re-evaluate if expanding to Nordic markets |

---

## Consolidated ROI Summary

| Partner | Setup Cost | Monthly Cost | Y1 Revenue | Y2 Revenue | Y3 Revenue | Break-Even | Priority |
|---|---|---|---|---|---|---|---|
| **Qover (Insurance)** | €4,000 | €0 | €27,000 | €168,000 | €660,000 | Month 2 | 🔴 HIGH |
| **BAWAG + Santander** | €2,000 | €0 | €6,300 | €52,500 | €180,000 | Month 4 | 🔴 HIGH |
| **finAPI (Banking)** | €8,000 | €350–1,500 | €4,500 savings | €42,600 savings | €156,000 savings | Month 8 | 🟡 MEDIUM |
| **Nordea** | — | — | — | — | — | — | ⚪ SKIP |

### Total Partnership Revenue Impact

| Year | New Partnership Revenue | % Uplift on Base Revenue |
|---|---|---|
| **Y1** | €33,300 + €4,500 savings = **€37,800** | +8% on €467K base |
| **Y2** | €220,500 + €42,600 savings = **€263,100** | +11% on €2.5M base |
| **Y3** | €840,000 + €156,000 savings = **€996,000** | +8% on €12M base |

---

## Implementation Sequence

| Phase | Partner | Milestone | Timeline |
|---|---|---|---|
| **V1.5 Sprint 1** | Qover | Edge function for insurance quotes in transaction flow | Q3 Y1 |
| **V1.5 Sprint 1** | BAWAG/Santander | Referral tracking links with UTM attribution | Q3 Y1 |
| **V1.5 Sprint 2** | finAPI | SEPA payment initiation + identity verification | Q4 Y1 |
| **V2** | Qover | Full policy binding (purchase insurance in-app) | Q1 Y2 |
| **V2** | finAPI | Automated credit checks for financing pre-qualification | Q2 Y2 |
| **V2** | BAWAG/Santander | Embedded quote API (inline financing offers) | Q2 Y2 |

---

*Document status: V1 — For investor data room. Cost estimates based on published pricing and industry benchmarks as of Q1 2026. Subject to negotiation and final partner agreements.*
