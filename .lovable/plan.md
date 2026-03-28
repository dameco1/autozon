

## Root Cause Analysis

The formula overvalues this car because of several compounding weaknesses:

### Problem 1: Depreciation Curve Too Gentle for Old Cars
BMW at 10%/year with the `^(age × 0.75)` flattening exponent means a 16-year-old BMW retains ~28% of a €49K MSRP = ~€14K base. A 2010 BMW 318d Touring realistically has a base residual of €5-7K before damages.

**Fix**: Steepen depreciation for cars older than 10 years. Add an "aging cliff" where depreciation accelerates after a threshold (e.g., beyond 10 years, apply a secondary decay factor).

### Problem 2: Mileage Penalty Too Weak
329,000 km vs 288,000 expected = ratio 1.14. The penalty formula `(0.14)^1.4 × 0.25` yields only ~2% penalty. A car with 329K km should be penalized far more heavily — this is extreme mileage.

**Fix**: Add an absolute high-mileage cap. Cars above 200K km should get an additional progressive penalty regardless of age-relative ratio. E.g., above 250K: extra -10%, above 300K: extra -20%.

### Problem 3: Condition Factor Range Too Narrow (0.85-1.02)
Exterior at 65/100 only produces a condition factor of ~0.97. A car in visibly poor exterior condition should lose significantly more value.

**Fix**: Widen the range to 0.70-1.02, making low condition scores (below 70) penalize much more aggressively.

### Problem 4: Smoker Car Penalty Not Applied in Formula
The `calculateFairValue` function does not account for `smokerCar` at all — it's only shown in the AppraisalBreakdown display. The actual fair value number ignores it.

**Fix**: Apply a -3% to -5% multiplier for smoker cars in the formula.

### Problem 5: Accident History Double-Counting Gap
When `totalDamageCostEur > 0` (€1,900), the flat accident penalty is skipped entirely. But €1,900 in paint damages does not account for the structural/resale stigma of having accident history. Both should apply partially.

**Fix**: When both accident history AND itemized damages exist, apply itemized costs PLUS a reduced accident stigma penalty (e.g., 50% of the flat rate).

### Problem 6: Blend Ratio Favors Formula Too Much
40% formula + 60% market still lets an inflated formula pull the result above market. When the formula is 3x the market average, the blend is meaningless.

**Fix**: Add a confidence-weighted dynamic blend. When formula deviates from market by >50%, increase market weight to 80-90%. Cap the final value to not exceed market max_price.

### Problem 7: No Learning / Feedback Loop
The system does NOT learn from past appraisals. Each calculation is independent. There is no mechanism to adjust weights based on actual sale prices or user feedback.

**Fix (Phase 1 — lightweight)**: Store the market AI response alongside the formula result. When future cars of similar make/model/year are appraised, use historical market data as an additional reference point instead of always calling the AI fresh.

**Fix (Phase 2 — proper feedback)**: Add a "Was this valuation accurate?" prompt after transactions complete. Store the agreed_price vs fair_value_price delta. Use aggregate deltas per brand/segment to calibrate formula coefficients over time.

---

## Implementation Plan

### Step 1: Fix `calculateFairValue.ts` formula
- Add aging cliff: extra decay for cars >10 years old
- Add absolute high-mileage penalty tiers (200K, 250K, 300K+)
- Widen condition factor range to 0.70-1.02
- Add smoker car penalty (-3% to -5%)
- Combine accident stigma + itemized damage costs (not either/or)

### Step 2: Fix blend ratio in `FairValueResult.tsx`
- Dynamic blend: if formula > market_max, cap to market_max
- If formula deviates >50% from market avg, shift to 20/80 blend
- Add guard: final value should not exceed max(asking_price × 1.1, market_max)

### Step 3: Update `AppraisalBreakdown.tsx`
- Ensure all new factors (smoker, high-mileage tier, aging cliff) display as separate breakdown items with explanations

### Step 4: Add feedback loop table (database migration)
- Create `appraisal_feedback` table to store formula vs market vs final vs actual sale price
- On transaction completion, record the delta for future calibration

### Technical Details

**Aging cliff formula** (Step 1):
```text
if carAge > 10:
  depreciationFactor *= max(0.60, 1 - (carAge - 10) * 0.04)
```
This would reduce the 16-year BMW by an additional 24%, bringing the base from ~€14K to ~€10.6K.

**High-mileage tiers** (Step 1):
```text
if mileage > 300000: mileageFactor *= 0.75
elif mileage > 250000: mileageFactor *= 0.82
elif mileage > 200000: mileageFactor *= 0.90
```

**Combined effect for this BMW**: Formula result would drop from ~€12,200 to ~€5,500-6,500, which blended with market €3,800 at 40/60 gives ~€4,500-5,000 — much more realistic.

**Files to modify**:
- `src/components/car-upload/calculateFairValue.ts` — core formula fixes
- `src/pages/FairValueResult.tsx` — dynamic blend logic
- `src/components/AppraisalBreakdown.tsx` — new factor display
- `src/i18n/translations.ts` — labels for new factors
- Database migration — `appraisal_feedback` table for learning

