# Sitemap & Routes

## Public Pages (No Auth Required)

| Route | Page | Purpose |
|---|---|---|
| `/` | Landing Page | Hero, problem/solution, how-it-works, trust signals, CTA |
| `/login` | Login | Email/password + Google/Apple OAuth authentication |
| `/signup` | Signup | New user registration with lifestyle profiling |
| `/reset-password` | Reset Password | Email-based password reset (send link + set new password) |
| `/verify-otp` | Email OTP | 6-digit email OTP verification for 2FA |
| `/check-email` | Check Email | Email verification reminder |
| `/intent` | Intent Selection | Choose between "Buy" or "Sell" flow |
| `/cars` | Car Catalog | Browse all available cars (anonymous access) |
| `/car/:id` | Car Detail | Full car listing view (anonymous access) |
| `/about` | About Us | Company information |
| `/qa` | Q&A | Frequently asked questions |
| `/privacy-policy` | Privacy Policy | GDPR-compliant privacy policy |
| `/terms` | Terms & Conditions | Legal terms of service |
| `/cookie-policy` | Cookie Policy | Cookie usage disclosure |
| `/impressum` | Impressum | Legal entity information (DACH requirement) |
| `/pitch` | Investor Pitch | Full-screen pitch deck for investors |
| `/brand` | Brand Book | Logo, colors, typography, banner assets |
| `/docs` | Documentation Hub | Password-protected investor data room |
| `/docs/:slug` | Doc Viewer | Individual documentation page |
| `/unsubscribe` | Unsubscribe | Email unsubscribe page |

## Admin Pages (Admin Role Required)

| Route | Page | Purpose |
|---|---|---|
| `/admin` | Command Center | Admin dashboard with tabs: Overview, Cars, Users, Negotiations, Transactions, Matches, Activity, Agent, Reports, Contracts, Financing, Insurance |

## Authenticated Pages (Seller Flow)

| Route | Page | Purpose |
|---|---|---|
| `/dashboard` | Dashboard | Selling/Buying tabs — listings, matches, offers, shortlists, acquisitions |
| `/car-upload` | Car Upload Wizard | 6-step listing creation with AI features |
| `/car-upload?edit=<id>` | Edit Listing | Re-enter wizard to update existing car |
| `/fair-value/:id` | Fair Value Result | Appraisal breakdown, depreciation chart, market comparison |
| `/buyer-matches/:carId` | Buyer Matches | AI-matched potential buyers for a listing |
| `/negotiate/:offerId` | Negotiation | Structured counter-offer rounds with PDF export |
| `/acquire/:offerId` | Acquisition Options | Financing/leasing quotes from partners |
| `/financing` | Financing Calculator | Financing cost estimation tool |

## Authenticated Pages (Buyer Flow)

| Route | Page | Purpose |
|---|---|---|
| `/onboarding` | Onboarding | Preference wizard (budget, brands, fuel, body type) |
| `/buyer-questionnaire` | Buyer Questionnaire | Detailed buying preferences |
| `/car-selection` | Car Selection | Swipe-style car discovery (Tinder for cars) |
| `/compare` | Car Comparison | Side-by-side comparison of shortlisted cars |
| `/recommendations` | Recommendations | AI-suggested next cars based on preferences |

## KYC & Verification

| Route | Page | Purpose |
|---|---|---|
| `/kyc` | KYC Verification | Identity verification for transaction participants |

## User Flow Diagrams

### Anonymous Browsing
```
Landing → Browse Cars (/cars) → Car Detail (/car/:id) → [Login Required for Interaction]
```

### Seller Journey
```
Landing → Sign Up → Email Verify → OTP → Intent ("Sell") → Car Upload (6 steps) → Fair Value Result
                                                                                         ↓
                                                                                   Buyer Matches
                                                                                         ↓
                                                                                   Negotiation
                                                                                         ↓
                                                                                Acquisition Options
```

### Buyer Journey
```
Landing → Browse Anonymously → Sign Up → Email Verify → OTP → Intent ("Buy") → Onboarding
                                                                                     ↓
                                                                              Car Selection (swipe)
                                                                                     ↓
                                                                              Car Detail / Compare
                                                                                     ↓
                                                                              Make Offer → Negotiate
```

---

*Document status: V2 — Updated April 2026 with anonymous browsing routes, OTP verification, KYC, and complete admin tabs.*
