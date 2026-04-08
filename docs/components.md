# Component Library & Design System

## Design System

### Theme: Warm & Premium Light

Autozon uses a light-mode-first design with warm cream tones and amber/orange accents. All colors are defined as HSL-based semantic tokens in `index.css` and `tailwind.config.ts`.

### Colors (HSL-based tokens in `index.css`)

| Token | Usage | Value |
|---|---|---|
| `--background` (warm cream) | Main app background | `#FAF8F5` |
| `--foreground` (warm black) | Primary text | `#2C2924` |
| `--primary` / `--orange` | CTAs, accents, brand orange | `hsl(24, 95%, 53%)` |
| `--secondary` (warm beige) | Cards, panels | `#F0ECE6` |
| `--muted` | Subtle backgrounds | warm beige tones |
| `--accent` | Hover states, highlights | warm amber tones |
| `--card` | Card backgrounds | `#FFFFFF` |
| `--border` | Borders, dividers | `#E8E2D9` |
| `--destructive` | Error states, delete actions | red tones |

**Design rules:**
- **Never use hardcoded color classes** in components (no `bg-charcoal`, `bg-navy`, `text-silver`)
- Always use semantic tokens: `bg-background`, `text-foreground`, `bg-secondary`, `text-muted-foreground`, etc.
- Charts and data visualizations use `hsl(var(--border))`, `hsl(var(--muted-foreground))` for theme-aware rendering
- The only intentional dark sections are the **Investor Pitch slides** (`/pitch`) which use a dark presentation theme

### Typography
- **Display font**: Montserrat (headings, logo, brand)
- **Body font**: System stack via Tailwind defaults
- **Logo**: "auto**zon**" — dark text with orange "zon" suffix

### Component Primitives (shadcn/ui)
All from [shadcn/ui](https://ui.shadcn.com/), customized to warm light theme:
- `Button`, `Card`, `Dialog`, `Sheet`, `Tabs`, `Accordion`
- `Select`, `Input`, `Textarea`, `Slider`, `Checkbox`, `Switch`
- `Toast` (sonner), `Tooltip`, `Popover`, `DropdownMenu`
- `Table`, `Badge`, `Progress`, `Skeleton`

---

## Key Custom Components

### Landing Page (`src/components/home/`)
| Component | Purpose |
|---|---|
| `HeroSection` | Animated hero with seller/buyer split CTA |
| `HeroCarShowcase` | Featured car display with animations |
| `HeroProcessCircle` | Visual process indicator |
| `CarTicker` | Scrolling car image carousel |
| `ProblemSection` | Pain points of traditional car trading |
| `SolutionSection` | How Autozon solves each pain point |
| `HowItWorksSection` | 3-step process explanation |
| `AiEngineSection` | AI capabilities showcase |
| `AiInspectionSection` | AI inspection feature highlight |
| `CarSearchSection` | Dual-mode search (lifestyle profile OR traditional filters) |
| `ComparisonSection` | Platform comparison |
| `WhyAutozonSection` | Value proposition |
| `PricingSection` | Pricing tiers |
| `StatsBar` | Platform statistics banner |
| `TrustSection` | Social proof and trust signals |
| `CtaSection` | Final conversion call-to-action |
| `FooterSection` | Links, legal, language toggle |

### Car Upload Wizard (`src/components/car-upload/`)
| Component | Purpose |
|---|---|
| `StepBasicInfo` | Make/model selection with DB-backed autocomplete |
| `StepPhotos` | 7 mandatory photo slots with compression |
| `StepEquipment` | Categorized equipment checklist |
| `StepCondition` | 1–4 grade condition selector + accident history + documentation/accessories toggles + **prominent AI description generator** (CTA card with explanation when empty, inline regenerate button when filled) |
| `StepInspection` | 20-point inspection checklist (transparent disclosure) |
| `StepDamageReview` | AI damage detection results |
| `AppraisalDisclaimer` | Legal disclaimer before appraisal |
| `calculateFairValue` | Pure function — fair value algorithm |

### Shared Components
| Component | Purpose |
|---|---|
| `Navbar` | Global nav with auth state, language toggle, notifications, admin link |
| `ConciergeChat` | Floating AI chat widget (SSE streaming) |
| `AppraisalBreakdown` | Visual breakdown of fair value factors |
| `MarketComparison` | AI-powered market positioning chart |
| `NotificationBell` | Real-time notification indicator |
| `SEO` | Dynamic meta tags, OG, JSON-LD |
| `CookieConsent` | GDPR cookie consent banner |
| `MfaGuard` | Enforces Email OTP 2FA on all protected routes |

### Admin Command Center (`src/components/admin/`)
| Component | Purpose |
|---|---|
| `AdminOverview` | KPI stat cards (users, cars, negotiations, revenue breakdown by source) + 7-day signup sparkline |
| `AdminCarsTable` | All cars across all users with search, filter, status change, delete |
| `AdminUsersTable` | All user profiles with join date, city, country |
| `AdminNegotiations` | All offers with amount, counter, round, status tracking |
| `AdminActivityFeed` | Merged feed of notifications, car views, and shortlists |
| `AdminMatches` | All car-to-buyer matches with scores and status |
| `AdminTransactions` | All transaction monitoring |

### Auth & Admin Hooks (`src/hooks/`)
| Hook | Purpose |
|---|---|
| `useAdminAuth` | Checks `user_roles` table for admin role; redirects non-admins |
| `useIsAdmin` | Lightweight boolean check for conditional UI (e.g. navbar admin link) |
| `useMfaStatus` | Checks user's Email OTP verification status |
| `useCarModels` | Paginated car model data fetching (handles 2,500+ entries) |

### Auth Components
| Component | Purpose |
|---|---|
| `MfaGuard` | Wrapper that enforces Email OTP verification on all protected routes |
| `EmailOtpVerify` (page) | 6-digit Email OTP input for session verification (`/verify-otp`) |
| `Login` (page) | Email/password login + Google OAuth + Apple OAuth |
| `Signup` (page) | Email/password registration with password visibility toggle (no OAuth — ensures lifestyle profiling) |
| `ResetPassword` (page) | Email-based password reset flow (send link + update password) |

---

## Registration & Lifestyle Profiling

The **Signup page** (`/signup`) collects lifestyle data alongside account credentials:
- Full name, email, password
- Relationship status (single, married, divorced)
- Number of kids (0, 1, 2, 3, 3+)
- Car purpose (daily, work, pleasure, summer, winter)
- Budget range
- **Current car** (free text, e.g. "BMW 3 Series 2019") — used for brand loyalty and upgrade path recommendations

### Optional Buyer Preferences (collapsible at signup)

All optional — helps pre-fill the buyer questionnaire and improve matching from day one:
- Preferred brands (multi-select from DB-backed makes)
- Body type (Sedan, SUV, Hatchback, Wagon, Coupe, Convertible, Van, Pickup)
- Fuel type (Petrol, Diesel, Electric, Hybrid, Plug-in Hybrid)
- Transmission (Manual, Automatic)
- Budget range (min/max sliders)
- Year range (min/max sliders)
- Must-have features (Navigation, Heated Seats, Parking Sensors, etc.)
- Preferred colors
- Timing preference (Immediately, 1–3 Months, Just Browsing)

This data is stored in `profiles` (lifestyle) and `user_preferences` (buyer prefs) tables and feeds directly into the **lifestyle-aware matching algorithm**.

## Edit & Resubmit

When editing an existing car listing, **all data from every step is restored**: specs, photos, equipment, condition grade, inspection checklist, documentation flags (smoker, service book, maintenance receipts, accessories), and AI-detected damages with costs. Users only need to change what they want — no re-entry required.

---

## Internationalization (i18n)

- **Languages**: English (EN), German (DE)
- **Implementation**: React Context (`LanguageContext.tsx`)
- **Translation file**: `src/i18n/translations.ts` (~1950+ lines)
- **Toggle**: Globe icon in Navbar
- **Coverage**: All user-facing strings, including form labels, error messages, legal pages, dashboard tabs (Selling/Buying), SOLD labels, transaction summaries, buyer tab content, and lifestyle questions

## Dashboard

The dashboard uses a **Selling / Buying** tab layout:

### Selling Tab
- My Cars list with status badges: **Ad Live** (green), **Not Placed** (amber), **SOLD** (red)
- Sold cars show a "Transaction" link instead of edit/delete/place-ad actions
- Active Negotiations sidebar (only `pending` and `countered` offers)
- Recent Matches (shortlists from other users)
- Payment History (Stripe receipts)

### Buying Tab (`DashboardBuyerTab`)
- Active Acquisitions with step progress (Method → Contract → Payment → Insurance → Complete)
- My Offers (negotiations where user is buyer)
- Shortlisted Cars
