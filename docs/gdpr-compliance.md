# GDPR Compliance

## Overview

Autozon processes personal data of EU residents as part of its core marketplace operations. As an Austrian GmbH operating initially in Austria and expanding to DACH/CEE, full compliance with the **General Data Protection Regulation (EU) 2016/679** is both a legal requirement and a trust differentiator. This document details autozon's data protection framework, processing activities, data flows, and compliance controls.

---

## Legal Basis & Roles

### Data Controller

| Field | Detail |
|---|---|
| **Entity** | autozon GmbH (to be incorporated) |
| **Jurisdiction** | Vienna, Austria |
| **Supervisory authority** | Österreichische Datenschutzbehörde (DSB) |
| **Contact** | privacy@autozon.at (planned) |
| **Data Protection Officer** | Not legally required (< 250 employees, no large-scale special category processing) — voluntary DPO appointment planned at growth stage |

### Processing Roles

| Role | Entity | Relationship |
|---|---|---|
| **Controller** | autozon GmbH | Determines purposes and means of processing |
| **Processor** | Lovable Cloud (Supabase) | Database, auth, storage, edge functions |
| **Processor** | Stripe Inc. | Payment processing |
| **Processor** | OpenAI / Google | AI inference (damage detection, chat, descriptions) |
| **Processor** | AWS (post-migration) | Infrastructure, compute, storage |
| **Sub-processor** | Stripe's banking partners | Payment settlement |

---

## Data Processing Activities (ROPA)

### Record of Processing Activities

| # | Activity | Data Categories | Data Subjects | Legal Basis | Retention |
|---|---|---|---|---|---|
| 1 | **User registration** | Email, password (hashed), full name | Platform users | Art. 6(1)(b) — Contract performance | Account lifetime + 3 years |
| 2 | **Profile management** | Name, phone, city, country, language, avatar | Platform users | Art. 6(1)(b) — Contract performance | Account lifetime + 3 years |
| 3 | **Car listing creation** | Vehicle details (make, model, year, mileage, VIN, photos) | Sellers | Art. 6(1)(b) — Contract performance | Listing lifetime + 5 years (tax) |
| 4 | **AI fair value calculation** | Vehicle data, market comparisons | Sellers | Art. 6(1)(b) — Contract performance | Calculation lifetime |
| 5 | **AI damage detection** | Vehicle photos | Sellers | Art. 6(1)(b) — Contract performance | Listing lifetime |
| 6 | **Buyer matching** | Buyer preferences, budget, location | Buyers | Art. 6(1)(b) — Contract performance | Account lifetime |
| 7 | **Negotiation** | Offer amounts, counter-offers, messages | Buyers & sellers | Art. 6(1)(b) — Contract performance | Transaction + 7 years (tax) |
| 8 | **Payment processing** | Transaction amounts, Stripe payment IDs | Buyers & sellers | Art. 6(1)(b) — Contract performance | 7 years (Austrian tax law) |
| 9 | **AI concierge chat** | Chat messages, user context | Platform users | Art. 6(1)(b) — Contract performance | 90 days (auto-purge planned) |
| 10 | **Notifications** | User ID, message content, read status | Platform users | Art. 6(1)(f) — Legitimate interest | 90 days |
| 11 | **Authentication & MFA** | Email, hashed password, TOTP secrets | Platform users | Art. 6(1)(b) — Contract performance | Account lifetime |
| 12 | **Analytics (web)** | Page views, sessions (anonymized) | Website visitors | Art. 6(1)(f) — Legitimate interest | 26 months |
| 13 | **Cookie consent** | Consent preferences | Website visitors | Art. 6(1)(a) — Consent | 12 months |
| 14 | **Admin actions** | Admin user ID, action type, target user | Admin users | Art. 6(1)(f) — Legitimate interest | 5 years (audit trail) |
| 15 | **Investor data room** | Access logs (IP-based rate limiting) | Investors | Art. 6(1)(f) — Legitimate interest | 15 minutes (in-memory only) |

---

## Data Flow Maps

### User Registration & Authentication Flow

```
User Browser                autozon Frontend            Lovable Cloud (Auth)
    │                             │                            │
    │  1. Email + Password        │                            │
    │  ─────────────────────────▶ │                            │
    │                             │  2. Create account         │
    │                             │  ─────────────────────────▶│
    │                             │                            │  3. Hash password (bcrypt)
    │                             │                            │  4. Store in auth.users
    │                             │                            │  5. Send verification email
    │  6. Verification link       │                            │
    │  ◀──────────────────────────────────────────────────────│
    │                             │                            │
    │  7. Click verify            │                            │
    │  ─────────────────────────▶ │  8. Confirm email          │
    │                             │  ─────────────────────────▶│
    │                             │                            │  9. Trigger: create profile
    │                             │                            │     (profiles table)
    │  10. JWT token              │                            │
    │  ◀─────────────────────────────────────────────────────│
```

**Data at rest:** Email (auth.users), hashed password (auth.users), profile (profiles table)
**Data in transit:** TLS 1.3 encrypted
**Third parties:** None — fully within Lovable Cloud

### Car Listing & AI Processing Flow

```
Seller                   autozon App              Lovable Cloud           AI Providers
  │                          │                        │                      │
  │ 1. Upload car details    │                        │                      │
  │ ────────────────────────▶│                        │                      │
  │                          │ 2. Store in cars table │                      │
  │                          │ ──────────────────────▶│                      │
  │                          │                        │                      │
  │ 3. Upload photos         │                        │                      │
  │ ────────────────────────▶│ 4. Compress & upload   │                      │
  │                          │ ──────────────────────▶│ (car-images bucket)  │
  │                          │                        │                      │
  │                          │ 5. Detect damage       │                      │
  │                          │ ──────────────────────▶│ 6. Call AI API ─────▶│
  │                          │                        │                      │ 7. Analyze
  │                          │                        │ 8. Damage results ◀──│
  │                          │ 9. Store damages       │                      │
  │                          │ ──────────────────────▶│ (cars.detected_damages)
  │                          │                        │                      │
  │                          │ 10. Calculate fair val │                      │
  │                          │ ──────────────────────▶│ (local algorithm)    │
  │ 11. Fair value result    │                        │                      │
  │ ◀────────────────────────│                        │                      │
```

**Data sent to AI providers:** Vehicle photos (temporary, not stored by provider per DPA), car specifications
**Data NOT sent:** User identity, email, financial information

### Payment & Transaction Flow

```
Buyer/Seller             autozon App              Lovable Cloud           Stripe
  │                          │                        │                    │
  │ 1. Accept offer          │                        │                    │
  │ ────────────────────────▶│ 2. Update offer status │                    │
  │                          │ ──────────────────────▶│                    │
  │                          │                        │                    │
  │                          │ 3. Create checkout      │                    │
  │                          │ ──────────────────────▶│ 4. Edge function ─▶│
  │                          │                        │                    │ 5. Create session
  │ 6. Redirect to Stripe    │                        │                    │
  │ ─────────────────────────────────────────────────────────────────────▶│
  │                          │                        │                    │ 7. Process payment
  │                          │                        │ 8. Webhook ◀───────│
  │                          │                        │ 9. Verify signature │
  │                          │ 10. Update DB          │                    │
  │ 11. Confirmation         │                        │                    │
  │ ◀────────────────────────│                        │                    │
```

**Data sent to Stripe:** Transaction amount, car ID, user email (for receipt)
**Data NOT sent:** Car photos, personal profile details, negotiation history
**Stripe DPA:** Stripe acts as data processor under its standard DPA

---

## Data Processing Agreements (DPAs)

### Required DPAs

| Processor | DPA Status | Type | Key Terms |
|---|---|---|---|
| **Lovable Cloud / Supabase** | ✅ Platform standard DPA | SaaS processor agreement | EU data residency, encryption at rest, SOC2 compliance |
| **Stripe** | ✅ Stripe standard DPA | Payment processor agreement | PCI DSS Level 1, EU data processing, SCCs for US transfer |
| **OpenAI** | 📋 To be executed | AI processor agreement | Data not used for training (API), 30-day deletion, SCCs |
| **Google (Gemini API)** | 📋 To be executed | AI processor agreement | EU processing option, data not used for training |
| **AWS** (post-migration) | 📋 Planned | Infrastructure processor | GDPR DPA, EU-only regions, encryption, SOC2/ISO 27001 |

### DPA Key Requirements

Every DPA must include:

| Requirement | Article | Status |
|---|---|---|
| Subject matter and duration of processing | Art. 28(3) | ✅ All DPAs |
| Nature and purpose of processing | Art. 28(3) | ✅ All DPAs |
| Types of personal data processed | Art. 28(3) | ✅ All DPAs |
| Categories of data subjects | Art. 28(3) | ✅ All DPAs |
| Obligations and rights of the controller | Art. 28(3) | ✅ All DPAs |
| Processor security measures (Art. 32) | Art. 28(3)(c) | ✅ All DPAs |
| Sub-processor authorization | Art. 28(2) | ✅ All DPAs |
| Assistance with data subject rights | Art. 28(3)(e) | ✅ All DPAs |
| Deletion/return of data on termination | Art. 28(3)(g) | ✅ All DPAs |
| Audit rights | Art. 28(3)(h) | ✅ All DPAs |

---

## International Data Transfers

### Current Transfer Mechanisms

| Transfer | From | To | Mechanism | Risk Level |
|---|---|---|---|---|
| **Lovable Cloud** | EU (user) | EU (infrastructure) | No transfer — EU data residency | Low |
| **Stripe** | EU (user) | US (Stripe Inc.) | Standard Contractual Clauses (SCCs) + DPF | Medium |
| **OpenAI API** | EU (data) | US (OpenAI servers) | SCCs + supplementary measures | Medium |
| **Google AI API** | EU (data) | EU/US (Google) | SCCs + EU processing option | Low-Medium |

### Post-AWS Migration

| Transfer | From | To | Mechanism |
|---|---|---|---|
| **AWS eu-central-1** | EU (user) | EU (Frankfurt) | No transfer — EU data residency |
| **AWS backups** | EU (primary) | EU (eu-west-1, Ireland) | Intra-EU — no additional mechanism |

**Policy:** All AWS services will be configured to use **EU-only regions** (eu-central-1 Frankfurt as primary, eu-west-1 Ireland as DR).

### Supplementary Measures for US Transfers

| Measure | Implementation |
|---|---|
| **Encryption in transit** | TLS 1.3 for all API calls |
| **Encryption at rest** | AES-256 (processor-managed keys) |
| **Data minimization** | Only necessary data sent to processors |
| **Pseudonymization** | User IDs (UUIDs) used instead of PII where possible |
| **Access controls** | Role-based access, MFA for admin accounts |
| **Contractual safeguards** | SCCs with processor-specific annexes |

---

## Data Subject Rights

### Implementation Status

| Right | Article | Implementation | Response Time |
|---|---|---|---|
| **Right of access** | Art. 15 | User dashboard shows all personal data; manual request via email for full export | 30 days |
| **Right to rectification** | Art. 16 | Self-service profile editing; car listing editing | Immediate (self-service) |
| **Right to erasure** | Art. 17 | Account deletion via support request; automated cascade delete | 30 days |
| **Right to restriction** | Art. 18 | Manual process via support; account suspension feature | 30 days |
| **Right to portability** | Art. 20 | JSON export of profile + listings + transactions (planned) | 30 days |
| **Right to object** | Art. 21 | Opt-out of marketing; cookie consent withdrawal | Immediate |
| **Right re: automated decisions** | Art. 22 | AI fair value is advisory, not binding; human review available | 30 days |

### Erasure Cascade

When a user requests account deletion:

```
DELETE user account
  ├── auth.users record → deleted
  ├── profiles → deleted
  ├── cars (owned) → anonymized (owner_id = null, keep for market data)
  ├── offers (as buyer/seller) → anonymized (user IDs nulled)
  ├── chat_messages → deleted
  ├── notifications → deleted
  ├── buyer_selections → deleted
  ├── car_shortlists → deleted
  ├── user_preferences → deleted
  ├── car_views → anonymized (viewer_id = null)
  ├── matches → deleted
  ├── car photos → deleted from storage (30-day grace period)
  └── user_roles → deleted
```

**Retention exceptions:** Transaction records kept for 7 years per Austrian tax law (BAO §132), anonymized.

---

## Cookie Compliance

### Cookie Categories

| Category | Cookies | Purpose | Legal Basis | Consent Required |
|---|---|---|---|---|
| **Strictly necessary** | Supabase auth tokens, CSRF | Authentication, security | Art. 6(1)(f) — Legitimate interest | No |
| **Functional** | Language preference, theme | User experience | Art. 6(1)(f) — Legitimate interest | No |
| **Analytics** | Plausible/Umami (cookieless) | Usage statistics | Art. 6(1)(f) — Legitimate interest | No (cookieless) |
| **Marketing** | None currently | — | — | N/A |

### Cookie Consent Implementation

| Component | Status |
|---|---|
| Cookie consent banner | ✅ Implemented (`CookieConsent` component) |
| Cookie policy page | ✅ Published (`/cookie-policy`) |
| Consent withdrawal mechanism | ✅ Available via banner |
| Consent logging | 📋 Planned (store consent records) |
| Cookie-free analytics | ✅ Using privacy-first analytics |

---

## Security Measures (Art. 32)

### Technical Measures

| Measure | Implementation |
|---|---|
| **Encryption in transit** | TLS 1.3 on all connections |
| **Encryption at rest** | AES-256 (database, storage, backups) |
| **Pseudonymization** | UUIDs for user identification, no PII in logs |
| **Access control** | Role-based (RBAC via user_roles table + has_role function) |
| **Authentication** | Email + password with mandatory MFA (TOTP) |
| **Database security** | Row-Level Security on all tables |
| **API security** | JWT validation in all edge functions |
| **Webhook security** | Signature verification (Stripe) |
| **Rate limiting** | IP-based on sensitive endpoints |
| **Backup** | Automated database backups |

### Organizational Measures

| Measure | Implementation |
|---|---|
| **Data minimization** | Only collect data necessary for service delivery |
| **Purpose limitation** | Data used only for stated purposes |
| **Storage limitation** | Retention periods defined per data category |
| **Access logging** | Admin actions logged with user ID and timestamp |
| **Incident response plan** | 72-hour notification procedure (documented below) |
| **Staff training** | GDPR awareness for all team members (planned) |
| **Privacy by design** | Data protection considered in every feature design |
| **Privacy by default** | Minimal data collection, strictest settings as default |

---

## Data Breach Response Plan

### Notification Timeline (Art. 33 & 34)

```
Breach Detected
  │
  ├── Hour 0–4: Contain & assess severity
  │     └── Identify affected data, scope, and risk
  │
  ├── Hour 4–24: Internal escalation
  │     └── CEO + legal advisor notified
  │     └── Document breach details
  │
  ├── Hour 24–48: Risk assessment
  │     └── Determine if "risk to rights and freedoms"
  │     └── If yes → prepare DSB notification
  │
  ├── Hour 48–72: Supervisory authority notification (if required)
  │     └── Notify Österreichische Datenschutzbehörde
  │     └── Include: nature of breach, categories of data,
  │           approximate number of subjects, likely consequences,
  │           measures taken
  │
  └── Without undue delay: Data subject notification (if high risk)
        └── Direct communication to affected users
        └── Include: nature of breach, DPO contact,
              likely consequences, measures taken
```

### Breach Severity Classification

| Level | Criteria | Action |
|---|---|---|
| **Low** | No personal data exposed; system vulnerability only | Internal log, patch, no notification |
| **Medium** | Limited PII exposed (< 100 users), low sensitivity | DSB notification within 72 hours |
| **High** | Significant PII exposed, financial data, or > 100 users | DSB + data subject notification |
| **Critical** | Authentication bypass, mass data exfiltration | Immediate containment, DSB + subjects + public statement |

---

## Data Protection Impact Assessment (DPIA)

### Processing Activities Requiring DPIA

| Activity | Risk Factor | DPIA Status |
|---|---|---|
| **AI damage detection** | Automated processing of user-uploaded images | 📋 Planned |
| **AI fair value calculation** | Automated decision with financial impact | 📋 Planned |
| **Buyer-seller matching** | Profiling based on preferences and behavior | 📋 Planned |
| **AI concierge chat** | Processing of free-text user communications | 📋 Planned |

### DPIA Template (To Be Completed)

| Section | Content |
|---|---|
| Description of processing | [Processing activity details] |
| Necessity & proportionality | [Why this processing is necessary] |
| Risks to data subjects | [Identified risks and their likelihood/severity] |
| Safeguards & mitigations | [Technical and organizational measures] |
| DPO opinion | [DPO assessment when appointed] |
| Supervisory authority consultation | [If required under Art. 36] |

---

## Compliance Roadmap

| Milestone | Timeline | Status |
|---|---|---|
| Privacy policy published | Y1 Q1 | ✅ Complete |
| Cookie consent implemented | Y1 Q1 | ✅ Complete |
| Cookie policy published | Y1 Q1 | ✅ Complete |
| Impressum published | Y1 Q1 | ✅ Complete |
| Terms & conditions published | Y1 Q1 | ✅ Complete |
| ROPA (this document) | Y1 Q1 | ✅ Complete |
| DPA with Lovable Cloud | Y1 Q1 | ✅ Platform standard |
| DPA with Stripe | Y1 Q1 | ✅ Platform standard |
| DPA with OpenAI | Y1 Q2 | 📋 To execute |
| DPA with Google AI | Y1 Q2 | 📋 To execute |
| Data subject rights process | Y1 Q2 | 📋 In progress |
| DPIA for AI processing | Y1 Q3 | 📋 Planned |
| Consent logging system | Y1 Q3 | 📋 Planned |
| Data portability export (JSON) | Y1 Q3 | 📋 Planned |
| Breach response drill | Y1 Q4 | 📋 Planned |
| Voluntary DPO appointment | Y2 Q1 | 📋 Planned |
| Staff GDPR training program | Y2 Q1 | 📋 Planned |
| AWS migration DPA | Y2 Q2 | 📋 Planned |
| SOC2 Type II preparation | Y2 Q4 | 📋 Planned |
| ISO 27001 gap analysis | Y3 Q1 | 📋 Planned |

---

## Key Contacts

| Role | Name / Entity | Contact |
|---|---|---|
| **Data Controller** | autozon GmbH | privacy@autozon.at |
| **CEO** | Emina Mukic-Buljubasic | emina@autozon.at |
| **CIO** | Damir Buljubasic | damir@autozon.at |
| **CFO** | Nenad Brankovic | nenad@autozon.at |
| **Legal Counsel** | TBD (Vienna startup law firm) | — |
| **DPO** | TBD (voluntary appointment Y2) | dpo@autozon.at |
| **Supervisory Authority** | Österreichische Datenschutzbehörde | dsb@dsb.gv.at |

---

*Document status: V1 — For investor data room. GDPR compliance is an ongoing process; this document is reviewed and updated quarterly.*
