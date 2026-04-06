# Architecture Overview

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React 18 + TypeScript | SPA with component-based UI |
| **Build** | Vite | Fast dev server and optimized production builds |
| **Styling** | Tailwind CSS + shadcn/ui | Utility-first CSS with accessible component library |
| **Theme** | Warm light mode (cream/amber) | Premium, warm aesthetic with semantic HSL tokens |
| **Animation** | Framer Motion | Page transitions, micro-interactions |
| **Routing** | React Router v6 | Client-side routing with nested layouts |
| **State** | TanStack Query + React state | Server-state caching and local UI state |
| **Backend** | Lovable Cloud (Supabase) | PostgreSQL, Auth, Edge Functions, Storage |
| **Payments** | Stripe | Placement checkout, webhook verification |
| **AI** | Lovable AI (Gemini) | Damage detection (brand-specific costing), description generation, concierge chat, market comparison |
| **Vehicle Data** | VINCARIO API | Commercial VIN decoding (4-endpoint merge: info + decode + OEM + stolen check), equipment auto-fill, fair value enrichment |
| **i18n** | Custom context (EN/DE) | Bilingual support (English + German) |
| **SEO** | react-helmet-async | Dynamic meta tags, JSON-LD structured data |
| **PDF** | jsPDF | Client-side negotiation agreement generation |
| **Charts** | Recharts | Depreciation curves, market comparisons |

## High-Level Architecture

```
┌─────────────────────────────────────────────────┐
│                   Browser (SPA)                  │
│  React + Vite + Tailwind + shadcn/ui            │
│                                                  │
│  ┌──────────┐ ┌──────────┐ ┌──────────────────┐ │
│  │ Pages    │ │Components│ │ Hooks / Context  │ │
│  └──────────┘ └──────────┘ └──────────────────┘ │
└───────────────────────┬─────────────────────────┘
                        │ HTTPS
           ┌────────────┴────────────┐
           │   Lovable Cloud (API)   │
           │                         │
           │  ┌───────────────────┐  │
           │  │  Edge Functions   │  │
           │  │  (Deno runtime)   │  │
           │  └────────┬──────────┘  │
           │           │             │
           │  ┌────────┴──────────┐  │
           │  │  PostgreSQL DB    │  │
           │  │  + Auth + Storage │  │
           │  └───────────────────┘  │
           └────────────┬────────────┘
                        │
               ┌─────────┴─────────┐
               │  External APIs    │
               │  • Stripe         │
               │  • Lovable AI     │
               │  • VINCARIO       │
               └───────────────────┘
```

## Project Structure

```
src/
├── assets/              # Images, logos, pitch deck photos
├── components/
│   ├── home/            # Landing page sections (Hero, CTA, HowItWorks, Search, etc.)
│   ├── car-upload/      # Multi-step car listing wizard (6 steps)
│   ├── pitch/           # Investor pitch slide components (dark theme)
│   ├── transaction/     # Transaction step components (Method, Contract, Payment, Insurance, Complete)
│   ├── dashboard/       # Dashboard tab components (DashboardBuyerTab)
│   ├── admin/           # Admin Command Center components
│   │   ├── AdminOverview.tsx      # KPI cards + signup chart
│   │   ├── AdminCarsTable.tsx     # All-cars table with actions
│   │   ├── AdminUsersTable.tsx    # All-users table
│   │   ├── AdminNegotiations.tsx  # All-offers monitor
│   │   ├── AdminTransactions.tsx  # All-transactions monitor
│   │   ├── AdminMatches.tsx       # All car-to-buyer matches
│   │   └── AdminActivityFeed.tsx  # Platform activity stream
│   ├── ui/              # shadcn/ui primitives (button, card, dialog, etc.)
│   ├── Navbar.tsx       # Global navigation with auth state + admin link
│   ├── ConciergeChat.tsx # AI-powered chat widget
│   ├── AppraisalBreakdown.tsx
│   ├── MarketComparison.tsx
│   ├── CookieConsent.tsx
│   └── SEO.tsx          # Dynamic meta/OG/JSON-LD
│   ├── MfaGuard.tsx     # Enforces TOTP 2FA on all protected routes
├── hooks/               # Custom hooks (useMobile, useCarModels, useMfaStatus, useToast, useAdminAuth)
├── i18n/                # Translations (EN/DE) and LanguageContext
├── integrations/        # Auto-generated Supabase client + types
├── lib/                 # Utilities
│   ├── lifestyleMatch.ts          # Lifestyle-aware car matching algorithm (4D scoring)
│   ├── chatStream.ts              # SSE streaming for AI concierge
│   ├── generateNegotiationPdf.ts  # PDF agreement generation
│   ├── exportPitchPdf.ts          # Pitch deck PDF export
│   └── utils.ts                   # General utilities
├── pages/               # Route-level page components (25+ pages)
└── main.tsx             # App entry point

supabase/
├── config.toml          # Backend configuration (auto-managed)
├── functions/           # Serverless edge functions (Deno)
│   ├── concierge-chat/         # AI chat with streaming SSE
│   ├── detect-damage/          # AI-powered photo damage detection
│   ├── generate-description/   # AI listing description writer
│   ├── market-comparison/      # AI market analysis
│   ├── create-placement-checkout/ # Stripe checkout session
│   ├── stripe-webhook/         # Stripe payment confirmation
│   ├── verify-placement/       # Payment verification
│   ├── get-placement-receipts/ # Stripe receipt retrieval
│   ├── admin-actions/          # Admin API (user suspension, transaction cancellation + Stripe refund)
│   ├── check-deadlines/       # Scheduled deadline enforcement (pg_cron hourly)
│   ├── seed-car-models/        # Static database seeder
│   ├── seed-car-models-ai/     # AI-powered model seeder with MSRP (Gemini)
│   ├── vin-decode/             # VINCARIO VIN decoder (4-endpoint: info + decode + OEM + stolen check)
│   └── verify-docs-password/   # Investor data room auth
└── migrations/          # SQL migration files (auto-managed)

docs/                    # Investor data room documentation
public/docs/             # Public-facing copies of documentation
public/                  # Static assets (favicon, OG image, sitemap, robots.txt)
```

## Authentication Flow

1. User signs up via `/signup` (email + password + lifestyle questions)
2. Auto-confirm is currently enabled (no email verification) — will be disabled before marketing launch
3. **Mandatory TOTP-based 2FA (MFA)** for all users:
   - After first login, users are redirected to `/mfa-enroll` to set up an authenticator app (QR code)
   - Supported apps: Microsoft Authenticator (recommended), Google Authenticator, Authy
   - On subsequent logins, users must verify via `/mfa-verify` (6-digit TOTP code)
   - `MfaGuard` wrapper checks Authenticator Assurance Level (AAL2) on all protected routes
   - Enforced for all roles: buyers, sellers, and admins
4. **Password reset**: `/reset-password` — email-based reset flow using `resetPasswordForEmail()` + `updateUser()`
5. Auth state managed via `supabase.auth.onAuthStateChange()`
6. Protected routes check session; redirect to `/login` if unauthenticated
7. JWT tokens passed to edge functions via `Authorization: Bearer <token>`

## Data Flow: Selling a Car

```
User → /intent (choose "Sell")
     → /car-upload (6-step wizard)
       Step 1: Basic Info (make, model, year, mileage, price) + VINCARIO VIN decode (auto-fill specs + equipment + stolen check)
       Step 2: Photos (6 mandatory + 1 optional angles, client-side compression)
       Step 3: Equipment selection (VIN-detected items pre-selected, user can add/remove)
       Step 4: Inspection checklist (20-point transparent disclosure — No/Unknown answers penalize fair value)
       Step 5: Condition sliders + accident history + AI damage scan (brand-specific repair costs)
       Step 6: Review + AI description generator
     → calculateFairValue() runs client-side (100% attribute-based, model-specific MSRP when available, inspection scoring)
     → Car saved to `cars` table with fair_value_price
     → /fair-value/:id (appraisal result + market comparison, 40/60 blend if market data available)
       → Seller can accept AI fair value OR set custom listing price (with deviation % feedback)
     → /buyer-matches/:carId (matched buyers)
     → /negotiate/:offerId (structured negotiation)
     → /acquire/:offerId (financing/acquisition options)
```

## Data Flow: Buying a Car

```
User → /signup (lifestyle data: relationship, kids, purpose, current car, budget)
     → /onboarding (detailed preferences: commute, parking, family size, ownership, insurance)
     → /cars (lifestyle-scored car selection — algorithm ranks by 4D match score)
       Cars ranked by: 30% lifestyle fit + 30% financial fit + 25% preference match + 15% condition
     → Swipe-style like/dislike → narrow down → /compare (side-by-side)
     → /car/:id (detailed view + shortlist)
     → /negotiate/:offerId (make offer → negotiation rounds)
     → /acquire/:offerId (financing/acquisition options)
```
