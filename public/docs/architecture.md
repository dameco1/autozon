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
| **AI** | Lovable AI (Gemini) | Zoni agent (tool-calling), damage detection, description generation, market comparison |
| **Vehicle Data** | VINCARIO API | Commercial VIN decoding (4-endpoint merge: info + decode + OEM + stolen check), equipment auto-fill, fair value enrichment |
| **KYC** | didit | Identity verification for transaction participants |
| **i18n** | Custom context (EN/DE) | Bilingual support (English + German) |
| **SEO** | react-helmet-async | Dynamic meta tags, JSON-LD structured data, AI crawler optimization |
| **PDF** | jsPDF | Client-side negotiation agreement generation |
| **Charts** | Recharts | Depreciation curves, market comparisons |
| **Email** | Resend + pgmq | Transactional emails with queue-based delivery |

## High-Level Architecture

```
┌─────────────────────────────────────────────────┐
│                   Browser (SPA)                  │
│  React + Vite + Tailwind + shadcn/ui            │
│                                                  │
│  ┌──────────┐ ┌──────────┐ ┌──────────────────┐ │
│  │ Pages    │ │Components│ │ Hooks / Context  │ │
│  └──────────┘ └──────────┘ └──────────────────┘ │
│                                                  │
│  ┌──────────────────────────────────────────────┐│
│  │ Global Layout: Navbar (App.tsx) + pt-16      ││
│  │ → All pages inherit consistent navigation    ││
│  └──────────────────────────────────────────────┘│
└───────────────────────┬─────────────────────────┘
                        │ HTTPS
           ┌────────────┴────────────┐
           │   Lovable Cloud (API)   │
           │                         │
           │  ┌───────────────────┐  │
           │  │  Edge Functions   │  │
           │  │  (Deno runtime)   │  │
           │  │  20+ functions    │  │
           │  └────────┬──────────┘  │
           │           │             │
           │  ┌────────┴──────────┐  │
           │  │  PostgreSQL DB    │  │
           │  │  + Auth + Storage │  │
           │  │  + pgmq queues   │  │
           │  └───────────────────┘  │
           └────────────┬────────────┘
                        │
               ┌─────────┴─────────┐
               │  External APIs    │
               │  • Stripe         │
               │  • Lovable AI     │
               │  • VINCARIO       │
               │  • didit (KYC)    │
               │  • Resend (email) │
               └───────────────────┘
```

## Project Structure

```
src/
├── assets/              # Images, logos, Zoni avatar
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
│   │   ├── AdminActivityFeed.tsx  # Platform activity stream
│   │   ├── AdminAgentTab.tsx      # Zoni AI agent monitoring
│   │   ├── AdminReports.tsx       # Reports dashboard
│   │   ├── AdminContracts.tsx     # Contract management
│   │   ├── AdminFinancingRequests.tsx  # Financing requests
│   │   └── AdminInsuranceRequests.tsx  # Insurance requests
│   ├── ui/              # shadcn/ui primitives (button, card, dialog, etc.)
│   ├── Navbar.tsx       # Global navigation (rendered in App.tsx layout)
│   ├── ConciergeChat.tsx # Zoni AI agent — floating chat widget with SSE streaming
│   ├── AppraisalBreakdown.tsx
│   ├── MarketComparison.tsx
│   ├── CookieConsent.tsx
│   ├── NotificationBell.tsx  # User-scoped real-time notifications
│   └── SEO.tsx          # Dynamic meta/OG/JSON-LD
├── hooks/               # Custom hooks (useMobile, useCarModels, useMfaStatus, useToast, useAdminAuth, usePwaInstall)
├── i18n/                # Translations (EN/DE) and LanguageContext
├── integrations/        # Auto-generated Supabase client + types
├── lib/                 # Utilities
│   ├── lifestyleMatch.ts          # Lifestyle-aware car matching algorithm (4D scoring)
│   ├── chatStream.ts              # SSE streaming for Zoni AI agent
│   ├── roleWorkflow.ts            # Role-based workflow logic
│   ├── generateNegotiationPdf.ts  # PDF agreement generation
│   ├── generateContractPdf.ts     # Contract PDF generation
│   ├── exportPitchPdf.ts          # Pitch deck PDF export
│   └── utils.ts                   # General utilities
├── pages/               # Route-level page components (30+ pages)
└── main.tsx             # App entry point

supabase/
├── config.toml          # Backend configuration (auto-managed)
├── functions/           # Serverless edge functions (Deno) — 20+ functions
│   ├── concierge-chat/         # Zoni AI agent with tool-calling
│   ├── detect-damage/          # AI-powered photo damage detection
│   ├── generate-description/   # AI listing description writer
│   ├── market-comparison/      # AI market analysis
│   ├── create-placement-checkout/ # Stripe checkout session
│   ├── create-car-payment/     # Stripe car payment
│   ├── stripe-webhook/         # Stripe payment confirmation
│   ├── verify-placement/       # Payment verification
│   ├── get-placement-receipts/ # Stripe receipt retrieval
│   ├── admin-actions/          # Admin API (user suspension, etc.)
│   ├── seed-car-models/        # Static database seeder
│   ├── seed-car-models-ai/     # AI-powered model seeder with MSRP
│   ├── vin-decode/             # VINCARIO VIN decoder
│   ├── verify-docs-password/   # Investor data room auth
│   ├── detect-location/        # Geographic location detection
│   ├── send-email-otp/         # Email OTP 2FA
│   ├── verify-email-otp/       # OTP verification
│   ├── kyc-create-session/     # KYC identity verification
│   ├── kyc-webhook/            # KYC webhook handler
│   ├── get-kyc-status/         # KYC status checker
│   ├── check-deadlines/        # Scheduled deadline enforcer
│   ├── auth-email-hook/        # Custom auth email templates
│   ├── send-transactional-email/ # Transactional email sender
│   ├── process-email-queue/    # Email queue processor (pgmq)
│   ├── handle-email-suppression/ # Bounce/complaint handler
│   ├── handle-email-unsubscribe/ # Email unsubscribe handler
│   └── preview-transactional-email/ # Email template preview
└── migrations/          # SQL migration files (auto-managed)

docs/                    # Investor data room documentation
public/docs/             # Public-facing copies of documentation
public/                  # Static assets (favicon, OG image, sitemap, robots.txt)
```

## Global Navigation

The `Navbar` component is rendered at the **root layout level** in `App.tsx`, providing consistent navigation across all pages. All route content is wrapped in a `pt-16` container for uniform spacing below the fixed header. Individual pages do not render their own Navbar instances.

## Authentication Flow

1. **Anonymous browsing**: Users can browse the car catalog, view car details, and use Zoni (guest mode) without logging in
2. User signs up via `/signup` (email + password + lifestyle questions)
3. Email verification required before first login
4. **Mandatory Email OTP 2FA** for all users:
   - After login, users verify via `/verify-otp` (6-digit code sent to email)
   - 5-minute TTL, rate-limited (5 requests / 10 min)
   - OTP verified status persisted in `app_metadata`
5. **Password security**: HIBP (Have I Been Pwned) breach checking
6. **Social auth**: Google + Apple OAuth on login page
7. **Password reset**: `/reset-password` — email-based reset flow
8. Auth state managed via `supabase.auth.onAuthStateChange()`
9. Protected routes check session; redirect to `/login` if unauthenticated
10. JWT tokens passed to edge functions via `Authorization: Bearer <token>`

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
User → Browse anonymously OR /signup (lifestyle data: relationship, kids, purpose, current car, budget)
     → /onboarding (detailed preferences: commute, parking, family size, ownership, insurance)
     → /cars (lifestyle-scored car selection — algorithm ranks by 4D match score)
       Cars ranked by: 30% lifestyle fit + 30% financial fit + 25% preference match + 15% condition
     → Swipe-style like/dislike → narrow down → /compare (side-by-side)
     → /car/:id (detailed view + shortlist)
     → /negotiate/:offerId (make offer → negotiation rounds)
     → /acquire/:offerId (financing/acquisition options)
```

---

*Document status: V2 — Updated April 2026 with global navbar, Zoni AI agent, anonymous browsing, email system, KYC, and complete function inventory.*
