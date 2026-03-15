

# Rewrite Homepage Marketing Copy

## The Problem with Current Copy
The current messaging makes vague claims like "We built AI that actually understands the car market" without explaining **what the AI actually does**. The user clarified the real value prop:

1. AI analyzes car photos + data to calculate fair market value
2. It compares against real market prices
3. The seller gets the fairest price and keeps the full margin (no dealer cut, no buyer lowball)

The copy needs to clearly communicate: **what Autozon is, what it does, and what the seller/buyer gets**.

## Files to Change

### 1. `src/i18n/translations.ts` — EN + DE sections
### 2. `src/components/home/AiEngineSection.tsx` — hardcoded EN/DE content

## Revised Copy (English)

### AiEngineSection
- **Badge**: `"HOW IT WORKS"`
- **Title**: `"Your Photos. Your Data. Your Fair Price."`
- **Subtitle**: `"Upload your car. Our AI analyzes your photos, specs, and condition — then compares it against live market data to calculate the fairest price you can sell for. You keep the margin. Not the dealer."`
- **Seller card title**: `"Upload. Get Your Real Price. Sell."`
- **Seller card body**: `"Take a few photos. Enter your car's details. Our AI scans the images for condition and damage, cross-references mileage, specs, and equipment against thousands of live market listings — and returns your car's true market value.\n\nNo dealer markdown. No guesswork. The price reflects what real buyers are paying right now.\n\nList it for €49. Your ad stays live until it sells."`
- **Buyer card title**: `"Stop Overpaying. Start Finding."`  
- **Buyer card body**: `"Tell us your budget, preferences, and lifestyle. Our AI matches you with fairly priced, verified cars — not random listings padded with dealer margins.\n\nEvery car is AI-appraised. Every price is market-verified.\n\nFound the one? Negotiate directly. Pay by card up to €10,000. Done."`

### WhyAutozon cards
- Card 1: `"AI That Shows You the Real Number"` / `"Our engine analyzes your photos, condition, mileage, and equipment — then compares it against live market data. You get your car's actual worth, not a dealer's estimate."`
- Card 2: unchanged (ad doesn't expire)
- Card 3: unchanged (pay by card)

### Problem section
- Description: `"Dealers buy low and sell high — that's their business model. You lose up to 30% of your car's value the moment you accept a trade-in. Other platforms let you post a price and hope for the best. Nobody tells you what your car is actually worth."`
- Italic line: `"Autozon does. AI analyzes your car. Market data sets the price.\nYou keep the margin."`

### Solution section
- Feature 1: `"AI Fair Value Engine"` / `"Analyzes your photos, condition, mileage, and specs — then cross-references live market listings to calculate your car's true worth in seconds."`
- Feature 2: `"AI Smart Matching"` / `"Connects you with verified buyers actively looking for a car like yours, at the right price."`
- Feature 3-5: minor clarity tweaks

### CTA section
- Title: `"Your car has a fair price. We'll find it."`
- AI line: `"AI-powered valuation. Real market data.\n€49 flat. Your ad never expires."`

### Comparison title
- `"See Why Sellers Switch to Autozon"`

### German translations — mirror all changes

## What stays unchanged
- All layout, styling, backgrounds, buttons, badges structure
- Component file structure (only text content changes)
- Pricing section (already clear and effective)
- How It Works steps (already accurate)
- Trust badges in hero

