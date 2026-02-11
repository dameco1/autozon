
# Plan: Fix Fair Value Algorithm + Dashboard Car Management

## Problem Analysis

Three issues to address:

### 1. Fair Value Algorithm Undervalues Premium/Sports Cars

After tracing through the calculation with a pristine Porsche 911 (2024, 15,000 km, price 145,000 EUR), the system produces ~122,000 EUR instead of ~145,000 EUR. Root causes:

- **Depreciation curve too steep**: `(0.88)^sqrt(carAge*1.8)` causes a 21.5% loss for a 2-year-old premium car. Real-world Porsche 911s hold value much better (~5-8% per year).
- **Condition factor has a ceiling of 1.0**: Even at 100/100 condition, the factor is `0.6 + 1.0*0.4 = 1.0` (neutral). Pristine cars should get a small boost.
- **"Coupe" body type penalized**: It falls into the `else` branch with a 0.97 multiplier. Sports coupes like a 911 should not be penalized.
- **Equipment bonus capped too low**: Max 15% bonus with very small per-item weights.

### 2. Delete Car from Dashboard

Users cannot currently remove cars from their listings. The Dashboard has View and Matches buttons but no Delete or Edit buttons.

### 3. Prevent Duplicate Car Listings

Users should not be able to add the same car twice. Instead, they should be redirected to edit the existing listing.

---

## Implementation

### Step 1: Tune the Fair Value Algorithm

**File: `src/components/car-upload/calculateFairValue.ts`**

| Change | Before | After |
|--------|--------|-------|
| Depreciation curve | `(1-depRate)^sqrt(carAge*1.8)` | `(1-depRate)^(carAge*0.7)` for premium, `(carAge*0.9)` for standard -- gentler power curve |
| Premium dep rate | 0.12 flat | 0.07 for iconic/sports brands (Porsche, Tesla), 0.10 for other premium |
| Condition factor | `0.6 + (avg/100)*0.4` (max 1.0) | `0.65 + (avg/100)*0.40` with a boost for scores above 90: up to 1.05 |
| Body type demand | Coupe = 0.97 (penalty) | Add "Coupe" and "Convertible" to moderate demand (1.02) |
| Equipment cap | Max 15% bonus | Max 20% bonus, slightly higher per-item weights |

This should bring the Porsche 911 example to approximately 135,000-145,000 EUR range.

**File: `src/components/AppraisalBreakdown.tsx`** -- Mirror the same formula changes so the breakdown report stays consistent.

### Step 2: Add Delete Car + Edit Car to Dashboard

**File: `src/pages/Dashboard.tsx`**

- Add a **Delete** button (Trash icon) to each car row alongside the existing View and Matches buttons.
- Add an **Edit** button (Pencil icon) that navigates to `/car-upload?edit={car.id}`.
- Delete action shows a confirmation dialog (using AlertDialog) before removing the car from the database.
- After deletion, the car is removed from the local state immediately.

### Step 3: Prevent Duplicate Car Listings

**File: `src/pages/CarUpload.tsx`**

- Before inserting a new car, query the `cars` table for an existing car with the same `make`, `model`, `year`, and `vin` (if VIN provided) belonging to the same user.
- If a duplicate is found, show a toast notification explaining the car already exists and automatically redirect to edit mode (`/car-upload?edit={existingCarId}`).
- The existing edit flow already works (the `editId` param loads the car data), so no additional edit UI changes are needed.

---

## Technical Details

### Updated Depreciation Formula

```text
Iconic brands (Porsche, Tesla): depRate = 0.07
Other premium (BMW, Mercedes, Audi, Volvo): depRate = 0.10
Standard brands: depRate = 0.15

depreciationFactor = max(0.25, (1 - depRate) ^ (carAge * 0.75))
```

For a 2-year-old Porsche: `(0.93)^1.5 = 0.896` (10.4% depreciation vs previous 21.5%).

### Updated Condition Factor

```text
condAvg = (exterior + interior) / 2
baseFactor = 0.65 + (condAvg / 100) * 0.40  // range: 0.65 to 1.05
// Pristine bonus: scores above 90 get an extra small lift
pristineBonus = condAvg > 90 ? (condAvg - 90) * 0.005 : 0
conditionFactor = baseFactor + pristineBonus  // max ~1.10 for perfect 100/100
```

### Files Changed

| File | Change |
|------|--------|
| `src/components/car-upload/calculateFairValue.ts` | Rebalanced depreciation, condition, body type, equipment formulas |
| `src/components/AppraisalBreakdown.tsx` | Mirror formula changes in breakdown display |
| `src/pages/Dashboard.tsx` | Add Edit and Delete buttons with confirmation dialog |
| `src/pages/CarUpload.tsx` | Add duplicate detection before insert |
