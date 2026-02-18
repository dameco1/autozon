# Use of Funds

## Overview

This document details the allocation plan for autozon's current funding round. The plan is designed for capital efficiency — extending runway while achieving product-market fit in Austria and building the foundation for DACH expansion.

---

## Funding Scenarios

| Scenario | Amount | Runway | Primary Use |
|---|---|---|---|
| **Bootstrapped** | €0 (revenue-funded) | Indefinite (lean) | Founder-only, organic growth |
| **Seed Round** | €150K–€300K | 18–24 months | First hire, marketing, partnerships |
| **Pre-Series A** | €500K–€1M | 24–36 months | Team of 3–5, Germany expansion, full marketing |

---

## Seed Round Allocation (€300K Base Case)

### Summary

| Category | Allocation | % of Total | Purpose |
|---|---|---|---|
| **Technology & Hosting** | €60,000 | 20% | Infrastructure, AI, cloud services |
| **Marketing & Growth** | €72,000 | 24% | Paid acquisition, content, PR |
| **Team & Talent** | €90,000 | 30% | First hire + contractor support |
| **Legal & Compliance** | €22,000 | 7.3% | FlexCo setup, GDPR, contracts |
| **Partnerships & BD** | €18,000 | 6% | Partner onboarding, events |
| **Operations & Admin** | €13,000 | 4.3% | Office, tools, accounting |
| **Reserve / Contingency** | €25,000 | 8.3% | Unexpected costs, opportunity fund |
| **Total** | **€300,000** | **100%** | |

---

## Detailed Breakdown

### 1. Technology & Hosting — €60,000 (20%)

#### Monthly Running Costs

| Service | Monthly Cost | Annual Cost | Notes |
|---|---|---|---|
| **Lovable Cloud (Supabase)** | €75 | €900 | Database, auth, edge functions, storage |
| **Lovable Platform** | €50 | €600 | Development environment, deployments |
| **Domain & DNS** | €5 | €60 | autozon.at + autozon.de |
| **AI API Costs (OpenAI/Google)** | €150 | €1,800 | Fair value, damage detection, chat, descriptions |
| **Stripe Fees** | Variable | ~€500 | 1.4% + €0.25 per transaction (EU cards) |
| **Email Service (Transactional)** | €25 | €300 | Signup confirmations, notifications |
| **Analytics (Plausible/Umami)** | €15 | €180 | Privacy-first web analytics |
| **Error Monitoring (Sentry)** | €30 | €360 | Runtime error tracking, performance |
| **SSL / CDN** | €0 | €0 | Included in Lovable Cloud |
| **Subtotal (Monthly)** | **~€350** | **€4,700** | |

#### AI Cost Scaling Projections

| Period | Monthly AI Calls | Est. Cost/Month | Annual |
|---|---|---|---|
| Y1 Q1–Q2 | 500 | €80 | €480 |
| Y1 Q3–Q4 | 2,000 | €200 | €1,200 |
| Y2 Q1–Q2 | 8,000 | €500 | €3,000 |
| Y2 Q3–Q4 | 20,000 | €1,000 | €6,000 |

#### Development & Infrastructure Investment

| Item | Cost | Timeline | Purpose |
|---|---|---|---|
| **Lovable Cloud upgrade (Pro)** | €3,500 | Y1 | Higher limits, priority support |
| **AI model fine-tuning** | €5,000 | Y1 Q3 | Custom damage detection model training |
| **Load testing & optimization** | €2,500 | Y1 Q4 | Pre-scaling performance validation |
| **Security audit** | €4,500 | Y1 Q3 | External penetration testing |
| **Backup & disaster recovery** | €2,000 | Y1 | Automated DB backups, recovery procedures |
| **Monitoring & alerting setup** | €1,200 | Y1 Q2 | Uptime monitoring, alerting |
| **Development tools & licenses** | €1,800 | Y1 | IDE, design tools, testing |
| **AWS migration planning** | €3,000 | Y1 Q4 | Architecture design, VPC planning, IAM setup |

#### AWS Migration Budget (Series A / Y2)

The platform will migrate from Lovable Cloud to AWS when growth-stage thresholds are reached (~5K users, ~€1M GMV/month). Migration costs are not included in the seed round but are budgeted for Series A:

| Migration Phase | Est. Cost | Timeline |
|---|---|---|
| Architecture planning & AWS account setup | €5,000 | Y2 Q2 |
| Data layer (PostgreSQL → RDS/Aurora, storage → S3) | €15,000 | Y2 Q3 |
| Auth migration (Supabase Auth → Cognito) | €8,000 | Y2 Q3 |
| Functions migration (Edge → Lambda) | €12,000 | Y2 Q3–Q4 |
| AI workload migration (APIs → SageMaker) | €10,000 | Y2 Q4 |
| Testing, load testing & cutover | €5,000 | Y2 Q4 |
| **Total migration cost** | **€55,000** | ~6 months |

#### Post-Migration AWS Running Costs (Estimated)

| Service | Monthly Cost | Notes |
|---|---|---|
| Amazon RDS (PostgreSQL) | €150–€300 | db.t3.medium → db.r5.large as traffic grows |
| Amazon S3 + CloudFront | €50–€200 | Image storage + global CDN |
| AWS Lambda | €30–€100 | Edge function replacement |
| Amazon Cognito | €50–€150 | Auth service (first 50K MAU free) |
| Amazon SageMaker | €200–€500 | AI inference endpoints |
| CloudWatch + monitoring | €30–€80 | Logging, metrics, alerting |
| WAF + Shield | €30–€50 | DDoS protection, rate limiting |
| **Total (post-migration)** | **€540–€1,380/mo** | Scales with usage |

*Note: AWS costs are higher than Lovable Cloud but provide enterprise-grade SLAs, global infrastructure, autoscaling, and compliance certifications (SOC2, ISO 27001) that investors expect at growth stage.*

#### Technology Budget Summary

| Subcategory | Amount |
|---|---|
| Monthly running costs (18 months) | €8,500 |
| AI scaling reserve | €12,000 |
| Infrastructure investment | €23,500 |
| Development tools | €1,800 |
| Scaling buffer (Y1 Q4+) | €14,200 |
| **Total Technology** | **€60,000** |

*AWS migration costs (~€55K) are budgeted separately under Series A funding, not seed round.*

---

### 2. Marketing & Growth — €72,000 (24%)

| Item | Q1 | Q2 | Q3 | Q4 | Y1 Total | Notes |
|---|---|---|---|---|---|---|
| **Google Ads** | €0 | €1,500 | €3,000 | €4,500 | €9,000 | "Auto verkaufen", "Auto Wert" |
| **Social Media Ads** | €0 | €750 | €2,250 | €3,000 | €6,000 | Facebook/Instagram carousel |
| **Content Creation** | €750 | €750 | €1,200 | €1,200 | €3,900 | Blog posts, video, graphics |
| **SEO Tools & Content** | €300 | €300 | €450 | €450 | €1,500 | Ahrefs, keyword research |
| **PR & Media** | €0 | €750 | €1,500 | €1,500 | €3,750 | Press releases, journalist outreach |
| **Referral Program Credits** | €0 | €375 | €750 | €1,125 | €2,250 | €25 per successful referral |
| **Events & Sponsorships** | €0 | €750 | €750 | €1,500 | €3,000 | Car meetups, startup events |
| **Branding & Design** | €3,000 | €0 | €750 | €0 | €3,750 | Professional brand assets |
| **Email Marketing Platform** | €150 | €150 | €150 | €150 | €600 | Newsletter, drip campaigns |
| **Quarterly subtotal** | €4,200 | €5,325 | €10,800 | €13,425 | **€33,750** | |

**Y2 Marketing Reserve:** €38,250 (Germany soft-launch preparation)

---

### 3. Team & Talent — €90,000 (30%)

| Role | Type | Monthly Cost | Duration | Total | Timeline |
|---|---|---|---|---|---|
| **Growth / Marketing Manager** | Part-time hire | €3,750 | 12 months | €45,000 | Y1 Q3 start |
| **Frontend Developer (contract)** | Freelance | €4,500 | 6 months | €27,000 | Y1 Q2–Q4 (burst) |
| **Customer Success (part-time)** | Contract | €1,500 | 8 months | €12,000 | Y1 Q3 start |
| **Legal / Compliance Advisor** | Retainer | €750 | 8 months | €6,000 | Y1 Q2 start |
| **Total** | | | | **€90,000** | |

**Founder compensation:** €0 in Y1 (equity-only until break-even)

---

### 4. Legal & Compliance — €22,000 (7.3%)

| Item | Cost | Timeline | Notes |
|---|---|---|---|
| **GmbH incorporation (Vienna)** | €4,000 | Y1 Q1 | Notary, registration, tax advisor |
| **GDPR compliance package** | €4,500 | Y1 Q1–Q2 | DPA templates, privacy impact assessment |
| **Terms & conditions (legal review)** | €3,000 | Y1 Q1 | Platform ToS, seller/buyer agreements |
| **Trademark registration (AT + EU)** | €3,500 | Y1 Q2 | "autozon" wordmark + logo |
| **Insurance (D&O + liability)** | €2,500 | Y1 Q1 | Directors & officers, professional liability |
| **Ongoing legal retainer** | €4,500 | Y1 | Ad-hoc legal questions, contract reviews |
| **Total** | **€22,000** | | |

---

### 5. Partnerships & Business Development — €18,000 (6%)

| Item | Cost | Timeline | Notes |
|---|---|---|---|
| **ÖAMTC partnership development** | €4,500 | Y1 Q3–Q4 | Meetings, co-branded materials, pilot setup |
| **Financing partner integration** | €3,000 | Y1 Q3–Q4 | Technical integration, testing, legal |
| **Insurance partner onboarding** | €2,500 | Y1 Q4 | Contract negotiation, referral setup |
| **Workshop / mechanic network** | €2,000 | Y1 Q3 | Referral agreements, marketing materials |
| **Industry events & networking** | €3,000 | Y1 | Vienna startup scene, automotive conferences |
| **Travel & meetings** | €3,000 | Y1 | Partner visits, investor meetings |
| **Total** | **€18,000** | | |

---

### 6. Operations & Admin — €13,000 (4.3%)

| Item | Monthly | Annual | Notes |
|---|---|---|---|
| **Co-working space** | €400 | €4,800 | Vienna (e.g., WeXelerate, Impact Hub) |
| **Accounting & tax** | €300 | €3,600 | Monthly bookkeeping, annual filing |
| **Business tools** | €150 | €1,800 | Slack, Notion, Google Workspace |
| **Bank fees** | €40 | €480 | Business account |
| **Miscellaneous** | €193 | €2,320 | Office supplies, subscriptions |
| **Total** | **~€1,083** | **€13,000** | |

---

### 7. Reserve / Contingency — €25,000 (8.3%)

| Purpose | Allocation | Trigger |
|---|---|---|
| **Unexpected technical costs** | €8,000 | Infrastructure scaling, security incidents |
| **Market opportunity fund** | €8,000 | Time-sensitive partnership or acquisition opportunity |
| **Legal contingency** | €5,000 | Regulatory changes, IP disputes |
| **General buffer** | €4,000 | Unforeseen operational costs |

---

## Monthly Burn Rate Projection

| Period | Monthly Burn | Cumulative Spend | Remaining (of €300K) |
|---|---|---|---|
| Month 1–3 | €5,500 | €16,500 | €283,500 |
| Month 4–6 | €8,500 | €42,000 | €258,000 |
| Month 7–9 | €12,000 | €78,000 | €222,000 |
| Month 10–12 | €14,000 | €120,000 | €180,000 |
| Month 13–15 | €13,000 | €159,000 | €141,000 |
| Month 16–18 | €12,500 | €196,500 | €103,500 |
| Month 19–24 | Revenue-funded | — | Reserve |

**Break-even target:** Month 14–16 (base case)

---

## Revenue Offset Timeline

| Period | Monthly Revenue | Monthly Burn | Net Burn |
|---|---|---|---|
| Month 1–3 | €200 | €4,500 | -€4,300 |
| Month 4–6 | €1,200 | €6,800 | -€5,600 |
| Month 7–9 | €3,500 | €10,200 | -€6,700 |
| Month 10–12 | €7,000 | €12,500 | -€5,500 |
| Month 13–15 | €11,000 | €11,000 | **€0 (break-even)** |
| Month 16–18 | €15,000 | €10,800 | +€4,200 |

---

## Capital Efficiency Metrics

| Metric | Value | Benchmark |
|---|---|---|
| **Burn multiple** | 1.8x (Y1 cumulative) | < 2x is excellent for seed stage |
| **Revenue per € invested** | €0.55 by Month 18 | Target > €0.50 |
| **Months to break-even** | 14–16 months | Seed average: 18–24 months |
| **Cash efficiency ratio** | 67% goes to growth (team + marketing) | > 60% is best practice |
| **Tech cost as % of revenue** | 35% (Y1) → 8% (Y3) | SaaS benchmark: 10–25% |

---

## Scenario Comparison

| Metric | Bootstrapped (€0) | Seed (€300K) | Pre-Series A (€750K) |
|---|---|---|---|
| **Team size (Y1)** | 1 (founder) | 2–3 | 5–7 |
| **Time to 100 monthly sales** | 18 months | 10 months | 6 months |
| **Y1 revenue** | €20K | €50K | €120K |
| **Y2 revenue** | €120K | €350K | €800K |
| **Germany launch** | Y3 | Y2 Q3 | Y2 Q1 |
| **Risk level** | High (slow growth) | Medium (balanced) | Low (execution risk) |
| **Investor ROI (5-year)** | N/A | 15–25x | 8–15x |

---

## Key Assumptions

| Assumption | Value | Sensitivity |
|---|---|---|
| Average transaction value | €15,000 | ±20% → ±€10K revenue Y1 |
| Take rate (success fee) | 2.5% | Fixed in Y1 |
| Placement fee conversion | 30% of listings | ±10% → ±€3K revenue Y1 |
| Monthly user growth rate | 15% (M4–M12) | Critical — drives all projections |
| AI cost per call | €0.08 average | Decreasing with model efficiency |
| Hosting cost growth | 10% per quarter | Scales sub-linearly with usage |
| Team cost inflation | 3% annual | Standard AT market |

---

*Document status: V1 — For investor data room. Updated as funding discussions progress.*
