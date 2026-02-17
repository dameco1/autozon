

# Fair Value Algorithm: Industry Review and Enhancement Plan

## Current State Assessment

The algorithm follows a solid multi-factor approach similar to industry leaders (Schwacke/DAT in DACH, Eurotax, KBB in the US), but has several gaps compared to professional-grade valuation systems.

## 1. Industry Benchmarks and What We're Missing

### How the Pros Do It (DAT/Schwacke, Eurotax, KBB)

| Factor | Industry Standard | Autozon Current | Gap |
|--------|------------------|-----------------|-----|
| Base Price | Real MSRP by **model + trim + variant** | Flat brand-tier estimate (e.g. "BMW = 48K") | Major — a BMW 116i vs M5 differ by 60K+ |
| Depreciation | Non-linear curves per **specific model** | Brand-tier only (3 tiers) | Moderate |
| Mileage | Segment-specific expected km/year | Flat 15K km/year for all | Minor |
| Condition | Standardized scales + **repair cost deduction** | Slider 0-100 with flat penalty | Major |
| Equipment | OEM option price lists, residual value % | Flat point scoring (2.5/1.8/1.2) | Major |
| Market Data | Real transaction prices (millions of records) | AI-generated comparison (no real data) | Major |
| Damage Costs | Brand-specific labor rates + OEM parts pricing | Flat -18% for any accident | Major |

## 2. Damage Cost Estimation (Brand-Specific)

This is the biggest quick win. Currently, all damage is either ignored or gets a flat -18% accident penalty. In reality:

```text
Repainting a door:
  Dacia Sandero:  ~EUR 300-500
  BMW 3 Series:   ~EUR 800-1,200
  Porsche 911:    ~EUR 1,500-3,000

Replacing a bumper:
  Dacia:          ~EUR 200-400
  BMW:            ~EUR 1,000-2,500
  Porsche:        ~EUR 3,000-8,000
```

### Available APIs for Repair Cost Data

| Provider | Coverage | Use Case |
|----------|----------|----------|
| **DAT/SilverDAT** | DACH + Europe, OEM data | Gold standard for insurance/dealers. Includes paint codes, labor times, OEM parts pricing. Enterprise pricing. |
| **GT Motive (GT Estimate)** | Pan-European | Cloud-based repair estimation. Used by insurers. Bodywork + mechanical. |
| **VehicleDatabases.com Repair API** | US-focused but growing | Parts + labor costs by year/make/model. Simpler integration. |
| **Audatex (Solera)** | Global | Insurance-grade repair costing. Enterprise. |

### Recommended Approach (No External API Needed Initially)

Build a **brand-tier repair cost matrix** directly into the algorithm, using the AI damage detection output (which already provides damage type, location, severity). The AI prompt can be enhanced to also estimate repair costs per detected damage.

**Enhancement to `detect-damage` edge function:**
- Add `estimated_repair_cost_eur` to the damage report schema
- Prompt the AI to estimate cost based on brand + model + damage type + location
- Feed confirmed damages as a **EUR deduction** from fair value instead of a flat percentage

## 3. VIN Decoding for Equipment Auto-Population

### Available APIs

| API | Coverage | Pricing | Equipment Data |
|-----|----------|---------|----------------|
| **NHTSA vPIC** | Free, US-focused | Free | Basic specs only, no equipment |
| **CarsXE International VIN** | Europe + global | From $49/mo | Make, model, year, engine, fuel, emissions |
| **Zyla Europe VIN Decoder** | Europe-specific | From $49/mo | Model, body, engine |
| **VINdecoder.eu** | European specialist | Paid | Equipment packages for many EU brands |
| **AutoDNA / carVertical** | CEE + Europe | Per-report | Full history + equipment |
| **DAT VIN Decode** | DACH | Enterprise | Full OEM equipment list by VIN |

### Recommended: Use AI to Bridge the Gap

Since VIN contains the WMI (World Manufacturer Identifier) + VDS (Vehicle Descriptor Section), the AI can decode basic specs. For equipment, the `car_models` table already has variant data. We can:

1. Decode VIN prefix to confirm make/model/year/plant
2. Cross-reference with `car_models` table to suggest likely equipment
3. Let the user confirm/adjust (current flow already supports this)

For a more robust solution later, integrating **CarsXE** or **VINdecoder.eu** would provide OEM equipment lists.

## 4. Algorithm Improvements

### 4a. Model-Specific MSRP (Instead of Brand-Flat)

Replace the flat `brandBase` map with a lookup from the `car_models` table. Each variant should store an `msrp_eur` column. The AI seeder (`seed-car-models-ai`) can populate this.

### 4b. Brand-Specific Damage Cost Deduction

Replace the flat `-18% accident penalty` with:

```text
For each confirmed damage:
  cost = lookupRepairCost(make, bodyType, damageType, location, severity)
  
totalDamageCost = sum of all confirmed damage costs
damageFactor = 1 - (totalDamageCost / attributeValue)
```

This means a scratch on a Dacia reduces value by EUR 300, while the same scratch on a Porsche reduces it by EUR 1,500.

### 4c. Blend Ratio Tuning

Current: `85% attribute + 15% asking price`
Then on FairValueResult page: `30% formula + 70% AI market`

**Problem**: The asking price leaks into both stages. A seller who prices at 2x market still shifts the value.

**Recommendation**: Remove asking price from the formula entirely (100% attribute-based), and apply market blending only from real comparable data. If no market data is available, use 100% formula.

```text
New blend:
  Stage 1: 100% attribute-based (no asking price influence)
  Stage 2: If market data available: 40% formula + 60% market
           If no market data: 100% formula
```

### 4d. Segment-Specific Mileage Expectations

Instead of flat 15K km/year:

```text
City cars (Fiat 500, Smart):     10,000 km/year
Sedans/Hatchbacks:               15,000 km/year  
SUVs/Wagons (family):            18,000 km/year
Commercial/Vans:                 25,000 km/year
Sports cars (911, Z4):           8,000 km/year
```

### 4e. Equipment Value Based on Original Option Price

Instead of flat 2.5/1.8/1.2 points, use a residual value curve:

```text
Equipment residual = original_option_price * residual_rate(age)

residual_rate:
  Year 0-1: 60% of option price retained
  Year 2-3: 40%
  Year 4-6: 25%
  Year 7+:  10%
```

This requires knowing option prices, which the AI seeder or VIN decoder can provide.

## 5. Implementation Plan

### Phase 1: Quick Wins (No External APIs)

1. **Enhanced AI damage costing** -- Update `detect-damage` prompt to include `estimated_repair_cost_eur` per damage, factoring in brand/model
2. **Replace flat accident penalty** -- Use sum of confirmed damage repair costs as a EUR deduction
3. **Fix blend ratio** -- Remove asking price from Stage 1; adjust Stage 2 to 40/60
4. **Segment-specific mileage** -- Add body-type-aware expected km/year

### Phase 2: Data Enrichment

5. **Add `msrp_eur` to `car_models`** -- Update the AI seeder to populate original MSRP per variant
6. **Model-specific MSRP lookup** -- Replace flat brand base with DB lookup
7. **VIN auto-decode** -- Add edge function that uses AI to decode VIN and pre-fill make/model/year/equipment

### Phase 3: External API Integration (Optional)

8. **VIN equipment API** -- Integrate CarsXE or VINdecoder.eu for OEM equipment lists
9. **Real market data** -- Integrate with mobile.de/AutoScout24 APIs for actual listing prices
10. **DAT/SilverDAT** -- Enterprise integration for insurance-grade repair costing

## Technical Details

### Files to Modify
- `src/components/car-upload/calculateFairValue.ts` -- Core algorithm changes (blend ratio, mileage, damage deduction)
- `supabase/functions/detect-damage/index.ts` -- Enhanced prompt with repair cost estimation
- `src/components/car-upload/types.ts` -- Add damage cost fields to CarFormData
- `src/components/car-upload/damageTypes.ts` -- Add `estimated_repair_cost_eur` to DetectedDamage
- `src/pages/FairValueResult.tsx` -- Update blend logic
- `src/components/AppraisalBreakdown.tsx` -- Show itemized damage costs
- Database migration: Add `msrp_eur` column to `car_models` table

### New Edge Function
- `supabase/functions/vin-decode/index.ts` -- AI-powered VIN decoder that returns make, model, year, and suggested equipment

