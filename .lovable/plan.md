

# Rewrite Investor Pitch Deck -- 14 Slides

## Overview

Full rewrite of `src/components/pitch/slides.tsx` replacing the current 24 slides with 14 investor-focused slides matching the provided content outline. All existing infrastructure (SlideLayout, InvestorPitch page, PDF export) remains unchanged.

## New Slide Order

| # | Component | Headline |
|---|-----------|----------|
| 1 | SlideCover | Autozon -- Fair Value. Full Transaction. |
| 2 | SlideExecutiveSummary | One platform that turns used-car friction into predictable, high-margin transactions. |
| 3 | SlideWhyNow | Market forces and regulation create a rare window to capture massive share. |
| 4 | SlideProblem | Sellers lose thousands; buyers face friction; platforms capture little of the transaction value. |
| 5 | SlideProduct | Live product: AI valuation, VIN intelligence, structured negotiation, and transaction orchestration. |
| 6 | SlideReturnDrivers | Multiple, compounding revenue streams and clear scale economics. |
| 7 | SlideMoat | Data, integrations, and execution create a durable competitive advantage. |
| 8 | SlideGTM | A repeatable funnel to seed liquidity and scale across DACH to Europe. |
| 9 | SlideTraction | Live MVP with measurable seller uplift and transaction flow validation. |
| 10 | SlideFinancials | Conservative projections with clear scaling levers and high gross margins. |
| 11 | SlideTeam | Founders with deep domain experience and execution track record. |
| 12 | SlideRisk | Practical approach to legal, compliance and operational risks. |
| 13 | SlideAsk | Seed raise to scale product, liquidity, and DACH expansion. |
| 14 | SlideAppendix | Full diligence materials and live demo access. |

## Technical Details

### Single file change: `src/components/pitch/slides.tsx`

- Keep all existing imports (icons, photos, car images) and design tokens
- Replace all 24 slide components with 14 new ones
- Update `allSlides` array to the new 14-element order
- Same 1920x1080 coordinate system, same CSS classes (`heading`, `subheading`, `body`, `cardBg`, `accent`, etc.)

### Preserved content
- **SlideTeam**: Reuses existing 3-column photo card layout with Emina, Damir, Nenad bios and photos
- **SlideAsk**: Includes cap table bar chart and investment details (EUR 300K / 23.08% / EUR 1.3M post-money)
- **SlideAppendix**: Carries forward data room module grid

### Slide design patterns
- Cover: logo + headline + 3 bullet points + key stats row
- Content slides: icon + headline header, 3 bullet cards with icons, consistent `px-40 py-16` padding
- Financials: table/card grid with Y1-Y3 projections
- Team: 3-column photo cards (existing layout)
- Ask: stacked bar cap table + 3 metric cards + use-of-funds breakdown

### No changes to
- `src/components/pitch/SlideLayout.tsx`
- `src/pages/InvestorPitch.tsx`
- `src/lib/exportPitchPdf.ts`
- Any image assets

