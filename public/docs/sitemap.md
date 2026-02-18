# Sitemap & Routes

## Public Pages (No Auth Required)

| Route | Page | Purpose |
|---|---|---|
| `/` | Landing Page | Hero, problem/solution, how-it-works, trust signals, CTA |
| `/login` | Login | Email/password authentication with "Forgot password?" link |
| `/signup` | Signup | New user registration |
| `/reset-password` | Reset Password | Email-based password reset (send link + set new password) |
| `/mfa-enroll` | MFA Enrollment | QR code setup for authenticator app (MS Authenticator, Google, Authy) |
| `/mfa-verify` | MFA Verification | 6-digit TOTP code entry on each login |
| `/intent` | Intent Selection | Choose between "Buy" or "Sell" flow |
| `/privacy-policy` | Privacy Policy | GDPR-compliant privacy policy |
| `/terms` | Terms & Conditions | Legal terms of service |
| `/cookie-policy` | Cookie Policy | Cookie usage disclosure |
| `/impressum` | Impressum | Legal entity information (DACH requirement) |
| `/pitch` | Investor Pitch | Full-screen pitch deck for investors |
| `/brand` | Brand Book | Logo, colors, typography, banner assets |
| `/docs` | Documentation Hub | Password-protected technical docs index |

## Admin Pages (Admin Role Required)

| Route | Page | Purpose |
|---|---|---|
| `/admin` | Command Center | Admin dashboard with 5 tabs: Overview, Cars, Users, Negotiations, Activity |

## Authenticated Pages (Seller Flow)

| Route | Page | Purpose |
|---|---|---|
| `/dashboard` | Dashboard | Selling/Buying tabs — listings, matches, offers, shortlists, acquisitions |
| `/car-upload` | Car Upload Wizard | 5-step listing creation with AI features |
| `/car-upload?edit=<id>` | Edit Listing | Re-enter wizard to update existing car |
| `/fair-value/:id` | Fair Value Result | Appraisal breakdown, depreciation chart, market comparison |
| `/buyer-matches/:carId` | Buyer Matches | AI-matched potential buyers for a listing |
| `/negotiate/:offerId` | Negotiation | Structured counter-offer rounds with PDF export |
| `/acquire/:offerId` | Acquisition Options | Financing/leasing quotes from partners |

## Authenticated Pages (Buyer Flow)

| Route | Page | Purpose |
|---|---|---|
| `/onboarding` | Onboarding | Preference wizard (budget, brands, fuel, body type) |
| `/buyer-questionnaire` | Buyer Questionnaire | Detailed buying preferences |
| `/car-selection` | Car Selection | Swipe-style car discovery (Tinder for cars) |
| `/compare` | Car Comparison | Side-by-side comparison of shortlisted cars |
| `/car/:id` | Car Detail | Full listing view with photos, specs, fair value |
| `/recommendations` | Recommendations | AI-suggested next cars based on preferences |

## User Flow Diagrams

### Seller Journey
```
Landing → Sign Up → Intent ("Sell") → Car Upload (5 steps) → Fair Value Result
                                                                    ↓
                                                              Buyer Matches
                                                                    ↓
                                                              Negotiation
                                                                    ↓
                                                           Acquisition Options
```

### Buyer Journey
```
Landing → Sign Up → Intent ("Buy") → Onboarding → Car Selection (swipe)
                                                         ↓
                                                    Car Detail / Compare
                                                         ↓
                                                    Make Offer → Negotiate
```
