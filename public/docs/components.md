# Component Library & Design System

## Design System

### Colors (HSL-based tokens in `index.css`)

| Token | Usage |
|---|---|
| `--background` (charcoal) | Main app background `#19191F` |
| `--primary` (electric green) | CTAs, accents `#00D97E` |
| `--secondary` | Cards, panels |
| `--silver` | Body text |
| `--muted` | Subtle backgrounds, borders |
| `--destructive` | Error states, delete actions |

### Typography
- **Display font**: Montserrat (headings, logo, brand)
- **Body font**: System stack via Tailwind defaults
- **Logo**: "auto**zon**" — white with green "zon" suffix

### Component Primitives (shadcn/ui)
All from [shadcn/ui](https://ui.shadcn.com/), customized to dark theme:
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
| `CarTicker` | Scrolling car image carousel |
| `ProblemSection` | Pain points of traditional car trading |
| `SolutionSection` | How Autozon solves each pain point |
| `HowItWorksSection` | 3-step process explanation |
| `TrustSection` | Social proof and trust signals |
| `CtaSection` | Final conversion call-to-action |
| `FooterSection` | Links, legal, language toggle |

### Car Upload Wizard (`src/components/car-upload/`)
| Component | Purpose |
|---|---|
| `StepBasicInfo` | Make/model selection with DB-backed autocomplete |
| `StepPhotos` | 7 mandatory photo slots with compression |
| `StepEquipment` | Categorized equipment checklist |
| `StepCondition` | Interior/exterior sliders + accident history |
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

### Admin Command Center (`src/components/admin/`)
| Component | Purpose |
|---|---|
| `AdminOverview` | KPI stat cards (users, cars, negotiations, revenue breakdown by source) + 7-day signup sparkline |
| `AdminCarsTable` | All cars across all users with search, filter, status change, delete |
| `AdminUsersTable` | All user profiles with join date, city, country |
| `AdminNegotiations` | All offers with amount, counter, round, status tracking |
| `AdminActivityFeed` | Merged feed of notifications, car views, and shortlists |
| `AdminMatches` | All car-to-buyer matches with scores and status |

### Auth & Admin Hooks (`src/hooks/`)
| Hook | Purpose |
|---|---|
| `useAdminAuth` | Checks `user_roles` table for admin role; redirects non-admins |
| `useIsAdmin` | Lightweight boolean check for conditional UI (e.g. navbar admin link) |
| `useMfaStatus` | Checks user's MFA enrollment/verification status |

### MFA & Auth Components
| Component | Purpose |
|---|---|
| `MfaGuard` | Wrapper that enforces AAL2 (TOTP verified) on all protected routes |
| `MfaEnroll` (page) | QR code setup with MS Authenticator recommendation + manual key fallback |
| `MfaVerify` (page) | 6-digit TOTP input for session verification |
| `ResetPassword` (page) | Email-based password reset flow (send link + update password) |

---

## Internationalization (i18n)

- **Languages**: English (EN), German (DE)
- **Implementation**: React Context (`LanguageContext.tsx`)
- **Translation file**: `src/i18n/translations.ts` (~1400 lines, includes MFA strings)
- **Toggle**: Globe icon in Navbar
- **Coverage**: All user-facing strings, including form labels, error messages, and legal pages
