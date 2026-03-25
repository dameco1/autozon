

# Redesign Hero + Add Search Engine Below It

## Inspiration from Competitors

- **AutoScout24**: Clean search form right on the homepage — Make, Model, Price, Registration Year, Location, big results button
- **mobile.de**: Hero image with tagline + search form with Make, Model, Year, Mileage, Price, Location
- **willhaben**: Category-based entry, less car-specific

The common pattern: **short punchy headline + integrated search form = immediate utility for buyers**.

## What Changes

### 1. Simplify the Hero Section (`HeroSection.tsx`)
- **Remove** the SVG car silhouettes (too abstract, adds visual noise)
- **New headline**: "The Easiest Way to Sell and Buy Cars" (orange accent on key words)
- **Subheadline**: Keep it tight — one line about AI fair pricing, no dealer markup
- **Two clear CTAs**: "Sell My Car" (orange) and "Browse Cars" (outline) — same as now but cleaner
- **Trust badges**: Keep the 3 existing ones below CTAs
- **Background**: Keep the dark navy + subtle radial gradients (no silhouettes)
- **Height**: Reduce from `min-h-screen` to a more compact hero (~60vh) so the search engine is visible without scrolling

### 2. New Search Engine Section (`CarSearchSection.tsx`)
A new component placed directly below the hero on the Index page. Styled as a prominent card/bar on a slightly lighter background.

**Search Fields** (inspired by AutoScout24/mobile.de):
- **Make** — dropdown, populated from `cars` table distinct makes
- **Model** — dropdown, dependent on selected make
- **Price up to** — dropdown with preset ranges (€5k, €10k, €15k, €20k, €30k, €50k+)
- **Year from** — dropdown with year ranges
- **Fuel type** — dropdown (Petrol, Diesel, Electric, Hybrid)
- **Mileage up to** — dropdown with preset ranges

**Search button**: Orange, shows result count text like "Search X cars"

**Behavior**: On submit, navigates to `/car-selection` with query params for the filters. The CarSelection page already filters by these fields, so we pass them as URL search params and the page picks them up.

**No auth required**: This search is public — it queries the `cars` table for available listings (status = 'available'). Users only need auth when they want to interact (like, negotiate).

### 3. Update `Index.tsx`
- Import and render `CarSearchSection` between `HeroSection` and `AiEngineSection`

### 4. Update Translations (`translations.ts`)
- Update `hero.headline` / `hero.headlineAccent` / `hero.subheadline` for EN + DE
- Add `carSearch` translation keys for the search section (title, placeholders, button text)

### 5. Update `CarSelection.tsx`
- Read URL search params on mount and use them as initial filter values
- Remove the auth requirement for browsing (keep auth for liking/interacting)

## Files to Create/Edit
| File | Action |
|------|--------|
| `src/components/home/HeroSection.tsx` | Simplify: remove silhouettes, new headline, compact height |
| `src/components/home/CarSearchSection.tsx` | **New** — search form with dropdowns |
| `src/pages/Index.tsx` | Add CarSearchSection after HeroSection |
| `src/i18n/translations.ts` | New hero copy + carSearch keys (EN+DE) |
| `src/pages/CarSelection.tsx` | Accept URL params as initial filters, allow unauthenticated browsing |

## Technical Details

- Search dropdowns use `supabase.from('cars').select('make').eq('status','available')` with distinct to populate Make options dynamically
- Model dropdown filters by selected make
- Result count queries the count with current filters before navigating
- Navigation: `navigate(/car-selection?make=BMW&maxPrice=20000&...)`
- CarSelection reads `useSearchParams()` and applies them to its existing query logic

