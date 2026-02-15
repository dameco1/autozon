# Product Roadmap

## Phase Overview

| Phase | Focus | Status |
|---|---|---|
| **MVP** | Core valuation + matching | ✅ Complete |
| **V1** | Concierge service + dealer network | 🔄 In Progress |
| **V1.5** | Seller KYC + automated financing + PWA | 📋 Planned |
| **V2** | Full financing, insurance, logistics + native mobile app | 📋 Planned |
| **V3** | Lifecycle platform + data insights | 📋 Planned |

---

## MVP (Complete)
- [x] Fair value algorithm (multi-factor, brand-tiered)
- [x] 5-step car upload wizard with photo compression
- [x] AI damage detection from photos
- [x] AI listing description generator
- [x] Buyer matching engine
- [x] Swipe-based car discovery for buyers
- [x] Multi-round negotiation with PDF export
- [x] Stripe-powered premium placement
- [x] Dashboard with listing management
- [x] Email authentication with verification
- [x] Mandatory TOTP 2FA (authenticator app) for all users
- [x] Bilingual support (EN/DE)
- [x] SEO optimization (meta, JSON-LD, sitemap)
- [x] GDPR compliance (cookie consent, privacy policy, impressum)
- [x] Investor pitch deck (`/pitch`)
- [x] Brand book (`/brand`)

## V1 (In Progress)
- [x] AI Concierge chat (streaming, context-aware)
- [x] Market comparison with AI insights
- [x] AI-powered car model database (2,700+ variants, 48 makes)
- [x] Admin Command Center with KPI dashboard
- [ ] Dealer network integration
- [ ] Enhanced buyer onboarding questionnaire
- [ ] Car comparison tool (side-by-side)

## V1.5 (Planned)
- [ ] Seller identity verification (KYC)
- [ ] Vehicle ownership verification
- [ ] Automated financing arrangements
- [ ] Partner bank/leasing integrations
- [ ] **Advertising Module V1** — Homepage banner ads (dealer/partner sponsors), contextual ads on vehicle detail pages, self-serve ad booking for dealers
- [ ] **PWA (Progressive Web App)** — installable from browser to home screen (iOS + Android), offline support, ~1.5 hours setup

## V2 (Planned)
- [ ] Full financing flow (application → approval → disbursement)
- [ ] Insurance comparison and bundling
- [ ] Logistics and delivery coordination
- [ ] Escrow payment system
- [ ] **Advertising Module V2** — Programmatic ad network, partner co-branded content, email/newsletter sponsorships, retargeting ads for dealers, analytics dashboard for advertisers
- [ ] **Native mobile app (Capacitor)** — iOS App Store + Google Play, full device access (camera, push notifications, sensors), ~5–8 hours setup + app store submissions

## V3 (Planned)
- [ ] Car lifecycle tracking (service history, value over time)
- [ ] Predictive analytics for optimal sell timing
- [ ] Fleet management tools for dealers
- [ ] Data insights marketplace
- [ ] **AWS migration** — full infrastructure migration from Lovable Cloud

---

## Infrastructure Evolution

| Stage | Users | Platform | Rationale |
|---|---|---|---|
| **MVP** (current) | 0–5K | Lovable Cloud | Speed of iteration, low cost, simplicity |
| **Growth** | 5K–100K | Hybrid (Lovable Cloud + AWS services) | Add S3 for image storage, SageMaker for AI, CloudFront CDN |
| **Scale** | 100K+ | Full AWS | Enterprise-grade reliability, global infrastructure, autoscaling, compliance certs |

### Migration Trigger Criteria

Migration planning begins when **any two** of these thresholds are met:

| Trigger | Threshold |
|---|---|
| Monthly active users | > 5,000 |
| Monthly image uploads | > 50,000 |
| AI inference calls / month | > 100,000 |
| GMV per month | > €1M |
| Investor / compliance requirement | SOC2 or ISO 27001 requested |

### Planned AWS Architecture (Post-Migration)

| Component | Current (Lovable Cloud) | Target (AWS) |
|---|---|---|
| **Database** | Supabase PostgreSQL | Amazon RDS (PostgreSQL) or Aurora |
| **Authentication** | Supabase Auth | Amazon Cognito + custom JWT |
| **Edge Functions** | Supabase Edge Functions (Deno) | AWS Lambda (Node.js/Python) |
| **File Storage** | Supabase Storage | Amazon S3 + CloudFront CDN |
| **AI Inference** | OpenAI / Google API calls | Amazon SageMaker + Bedrock (custom models) |
| **Search** | PostgreSQL full-text | Amazon OpenSearch |
| **Monitoring** | Basic (Sentry) | CloudWatch + X-Ray + GuardDuty |
| **CI/CD** | Lovable deployments | AWS CodePipeline + CodeDeploy |
| **Hosting** | Lovable preview/publish | AWS Amplify or S3 + CloudFront |

### Migration Timeline (Estimated)

| Phase | Timeline | Scope | Est. Cost |
|---|---|---|---|
| **Planning & architecture** | Y2 Q2 | AWS account setup, VPC design, IAM policies | €5,000 |
| **Data layer migration** | Y2 Q3 | PostgreSQL → RDS/Aurora, storage → S3 | €15,000 |
| **Auth migration** | Y2 Q3 | Supabase Auth → Cognito (zero-downtime) | €8,000 |
| **Functions migration** | Y2 Q3–Q4 | Edge functions → Lambda, API Gateway | €12,000 |
| **AI workload migration** | Y2 Q4 | External APIs → SageMaker endpoints | €10,000 |
| **Testing & cutover** | Y2 Q4 | Load testing, canary deployment, DNS switch | €5,000 |
| **Total** | ~6 months | Full migration | **€55,000** |

---

## Geographic Expansion

| Phase | Markets |
|---|---|
| Launch | Austria 🇦🇹 |
| Expansion 1 | Germany 🇩🇪 |
| Expansion 2 | DACH region (Switzerland 🇨🇭) |
| Expansion 3 | Central & Eastern Europe (CEE) |

## Revenue Model

1. **Listing fees** — €49 Basic / €99 Premium (Stripe checkout)
2. **Full Service commission** — 2.5% of completed sales, capped at €499 (planned V2)
3. **Financing referrals** — Commission from partner banks/leasers (planned)
4. **Advertising & Sponsored Content** — Display ads, sponsored listings, partner promotions (planned V1.5+)
5. **Data insights** — Market analytics for dealers (planned)

---

## Mobile Strategy

| Phase | Approach | Effort | Reach |
|---|---|---|---|
| **V1.5** | PWA (installable web app) | ~1.5 hours | All phones via browser |
| **V2** | Capacitor (native app) | ~5–8 hours | App Store + Google Play |

### PWA (V1.5) — First Mobile Milestone
- Install `vite-plugin-pwa`, configure manifest & icons
- Add mobile meta tags, offline caching, `/install` page
- No app store submission needed — users install from browser
- Shared codebase — zero backend changes required

### Native App (V2) — Full Mobile Experience
- Capacitor wraps the existing React app into native iOS/Android
- Full device access: camera, push notifications, sensors
- Requires Xcode (iOS) + Android Studio (Android)
- Apple Developer ($99/yr) + Google Play ($25 one-time)
- Each release: `npx cap sync` → rebuild → submit to stores
