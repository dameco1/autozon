# Architecture Overview

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React 18 + TypeScript | SPA with component-based UI |
| **Build** | Vite | Fast dev server and optimized production builds |
| **Styling** | Tailwind CSS + shadcn/ui | Utility-first CSS with accessible component library |
| **Animation** | Framer Motion | Page transitions, micro-interactions |
| **Routing** | React Router v6 | Client-side routing with nested layouts |
| **State** | TanStack Query + React state | Server-state caching and local UI state |
| **Backend** | Lovable Cloud (Supabase) | PostgreSQL, Auth, Edge Functions, Storage |
| **Payments** | Stripe | Placement checkout, webhook verification |
| **AI** | Lovable AI (Gemini) | Damage detection, description generation, concierge chat, market comparison |
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
              └───────────────────┘
```

## Project Structure

```
src/
├── assets/              # Images, logos, pitch deck photos
├── components/
│   ├── home/            # Landing page sections (Hero, CTA, HowItWorks, etc.)
│   ├── car-upload/      # Multi-step car listing wizard (5 steps)
│   ├── pitch/           # Investor pitch slide components
│   ├── admin/           # Admin Command Center components
│   │   ├── AdminOverview.tsx      # KPI cards + signup chart
│   │   ├── AdminCarsTable.tsx     # All-cars table with actions
│   │   ├── AdminUsersTable.tsx    # All-users table
│   │   ├── AdminNegotiations.tsx  # All-offers monitor
│   │   └── AdminActivityFeed.tsx  # Platform activity stream
│   ├── ui/              # shadcn/ui primitives (button, card, dialog, etc.)
│   ├── Navbar.tsx       # Global navigation with auth state + admin link
│   ├── ConciergeChat.tsx # AI-powered chat widget
│   ├── AppraisalBreakdown.tsx
│   ├── MarketComparison.tsx
│   └── SEO.tsx          # Dynamic meta/OG/JSON-LD
│   ├── MfaGuard.tsx     # Enforces TOTP 2FA on all protected routes
├── hooks/               # Custom hooks (useMobile, useCarModels, useMfaStatus, useToast, useAdminAuth)
├── i18n/                # Translations (EN/DE) and LanguageContext
├── integrations/        # Auto-generated Supabase client + types
├── lib/                 # Utilities (chatStream, generateNegotiationPdf, utils)
├── pages/               # Route-level page components (20+ pages incl. AdminDashboard, MfaEnroll, MfaVerify)
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
│   ├── seed-car-models/        # Static database seeder
│   └── seed-car-models-ai/     # AI-powered model seeder (Gemini)
└── migrations/          # SQL migration files (auto-managed)

docs/                    # This documentation folder
public/                  # Static assets (favicon, OG image, sitemap, robots.txt)
```

## Authentication Flow

1. User signs up via `/signup` (email + password)
2. Email verification required before first login
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
     → /car-upload (5-step wizard)
       Step 1: Basic Info (make, model, year, mileage, price)
       Step 2: Photos (7 mandatory angles, client-side compression)
       Step 3: Equipment selection
       Step 4: Condition sliders + accident history
       Step 5: AI damage scan + review
     → calculateFairValue() runs client-side
     → Car saved to `cars` table with fair_value_price
     → /fair-value/:id (appraisal result + market comparison)
     → /buyer-matches/:carId (matched buyers)
     → /negotiate/:offerId (structured negotiation)
     → /acquire/:offerId (financing/acquisition options)
```
