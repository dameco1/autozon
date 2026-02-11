

# Plan: Investor Pitch Slides for Autozon (Merged & Expanded)

## Overview

Create a 16-slide in-app investor presentation at `/pitch` with keyboard/click navigation, fullscreen mode, and Autozon branding. All content from the original plan plus the new Investor & Business Package is merged into a comprehensive deck.

## Slide Deck (16 Slides)

| # | Title | Content |
|---|-------|---------|
| 1 | **Title** | "Autozon — Fair value. Zero friction. The Amazon of cars." |
| 2 | **The Problem** | Sellers lose 10-20% instantly. Dealerships control pricing. Selling is stressful and unfair. Stats: 10-20% loss, 45 days avg sale time, 67% feel cheated. |
| 3 | **The Insight** | "Depreciation isn't natural. It's engineered." Single powerful statement slide. |
| 4 | **The Solution** | Fair-value engine, intelligent matching, curated next-car recommendations, full concierge execution. |
| 5 | **Product** | Visual breakdown: AI appraisal, buyer matching, concierge handling, damage detection, market comparison. |
| 6 | **Why Now** | Trust collapsing, transparency demand, AI enables personalization, no dominant "Amazon of cars" exists, cross-border markets more connected. |
| 7 | **Business Model** | Free for buyers, sellers pay success fee. Asymmetric pricing mirrors Amazon/Airbnb/Uber. |
| 8 | **Revenue Streams** | 6 streams: Seller success fee (primary), Dealer lead fees, Financing/Insurance commissions, Logistics add-ons, Premium subscription, Data intelligence. |
| 9 | **The Flywheel** | Buyers create liquidity -> liquidity builds trust -> trust attracts sellers -> sellers generate revenue -> data improves everything. |
| 10 | **Pricing** | 3 tiers: Basic EUR 99 (valuation + listing), Premium EUR 199 (matching + concierge), Full Service 2.5% capped at EUR 499 (everything + pickup + paperwork). |
| 11 | **Market Size** | EUR 300B+ European used-car market. 1% = multi-billion opportunity. |
| 12 | **Financial Projections** | Y1: 2K txns / EUR 1M rev. Y2: 10K txns / EUR 5-6M. Y3: 40K txns / EUR 25M+. Unit economics: EUR 500 avg fee, 70% gross margin, LTV/CAC > 5x. |
| 13 | **Competitive Landscape** | Listings (AutoScout/mobile.de) are not intelligence. Dealers are not fairness. Autozon = value preservation ecosystem. |
| 14 | **Moat & Roadmap** | Data flywheel (every valuation/match/transaction improves prediction). Roadmap: MVP -> V1 -> V2 -> V3, marketplace to lifecycle platform. GTM: Austria+Germany -> DACH -> CEE. |
| 15 | **The Ask** | Raising capital to build MVP, seed liquidity, expand DACH then CEE. |
| 16 | **Closing** | "Cars shouldn't lose value because the system is broken. Autozon fixes the system — with fairness, intelligence, and trust." Investor soundbite: "Autozon is not a marketplace. It's a value-preservation engine for the EUR 300B used-car market." |

## Technical Approach

### New Files

| File | Purpose |
|------|---------|
| `src/pages/InvestorPitch.tsx` | Main page: slide navigation, viewport scaling (1920x1080 base), fullscreen (F5/Escape), back button |
| `src/components/pitch/SlideLayout.tsx` | Wrapper rendering children at 1920x1080, scaled via `transform: scale(Math.min(vw/1920, vh/1080))` |
| `src/components/pitch/slides.tsx` | All 16 slide content components with icons from lucide-react |

### Modified Files

| File | Change |
|------|--------|
| `src/App.tsx` | Add `/pitch` route |

### Features

- Arrow keys, Space, Escape for navigation
- Slide counter (e.g. "5 / 16")
- On-screen prev/next buttons
- Fullscreen toggle button
- Back button to return to app
- Fade transitions between slides
- Dark charcoal background with green accent highlights
- Large presentation-sized text (minimum 24px at 1920x1080)
- Key numbers and stats in bold green for visual impact

