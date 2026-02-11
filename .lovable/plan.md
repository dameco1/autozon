

# Cascading Car Selection with Auto-Fill

## Overview

Transform the car upload form from free-text inputs into smart cascading dropdowns powered by a comprehensive car database. When a user selects a Make, the Model dropdown filters accordingly. When they pick a Model, the Variant/Trim dropdown shows available options and auto-fills power (HP), fuel type, body type, and transmission.

**Free input fields kept**: Mileage, Asking Price, VIN  
**Everything else**: Dropdown selection

---

## Data Source: Database Table + Edge Function Seeder

We will create a `car_models` table in the database and populate it using an edge function that fetches data from the **NHTSA vPIC API** (free, no API key needed) combined with a curated European car dataset hardcoded in the function. This gives us:

- All major makes (50+)
- Models per make (e.g., BMW: 1 Series, 3 Series, X5...)  
- Variants/trims per model (e.g., BMW 3 Series: 320i, 330i, M340i, 320d...)
- Specs per variant: power_hp, fuel_type, body_type, transmission

A predefined color list replaces the free-text color field.

---

## What Changes

### 1. New Database Table: `car_models`

| Column | Type | Description |
|--------|------|-------------|
| id | uuid (PK) | Auto-generated |
| make | text | e.g. "BMW" |
| model | text | e.g. "3 Series" |
| variant | text | e.g. "320i" |
| year_from | integer | First production year |
| year_to | integer | Last production year (null = current) |
| power_hp | integer | Horsepower |
| fuel_type | text | Petrol, Diesel, Electric, etc. |
| transmission | text | Manual or Automatic |
| body_type | text | Sedan, SUV, etc. |

RLS: Public read access (no auth needed to browse car specs), no write access from client.

### 2. Edge Function: `seed-car-models`

A one-time seeder function that populates the `car_models` table with a comprehensive dataset of European and global car makes/models/variants. This includes curated data for the top 20+ makes with their most common models and variants, each with accurate power specs.

### 3. Updated Form: `StepBasicInfo.tsx`

The form fields become a cascading selection flow:

```text
Make (dropdown) --> Model (dropdown, filtered by make) --> Variant (dropdown, filtered by model)
                                                              |
                                                              v
                                                    Auto-fills: Power HP, Fuel Type,
                                                    Transmission, Body Type
```

- **Make**: Dropdown populated from distinct makes in `car_models`
- **Model**: Dropdown filtered by selected make
- **Variant**: Dropdown filtered by selected model (and year range)
- **Year**: Dropdown (range from 2000 to current year)
- **Power HP**: Auto-filled from variant, shown as read-only
- **Fuel Type**: Auto-filled from variant, shown as read-only
- **Transmission**: Auto-filled from variant, shown as read-only
- **Body Type**: Auto-filled from variant, shown as read-only
- **Color**: Dropdown with standard car colors (Black, White, Silver, Grey, Blue, Red, Green, Brown, Beige, Yellow, Orange)
- **Mileage**: Free number input (kept as-is)
- **Price**: Free number input (kept as-is)
- **VIN**: Free text input (kept as-is)

### 4. New Hook: `useCarModels`

A React Query hook that fetches car model data from the database with caching:
- `useCarMakes()` -- all distinct makes
- `useCarModels(make)` -- models for a make
- `useCarVariants(make, model)` -- variants with specs

### 5. Updated Types

Add `variant` field to `CarFormData` to store the selected trim/submodel.

---

## Technical Details

### Files to Create

**Database migration** (via migration tool)
- Create `car_models` table with columns listed above
- Add RLS policy for public read access
- Add index on `(make, model)` for fast filtering

**`supabase/functions/seed-car-models/index.ts`**
- Edge function containing a curated dataset of ~500 car variants covering the top 20+ makes
- Uses service role key to insert data into `car_models`
- Idempotent (checks if data exists before inserting)

**`src/hooks/useCarModels.ts`**
- React Query hooks for fetching makes, models, and variants from the `car_models` table
- Cascading queries: model query depends on selected make, variant query depends on selected model

### Files to Modify

**`src/components/car-upload/types.ts`**
- Add `variant: string` to `CarFormData`
- Update `defaultCarFormData` accordingly

**`src/components/car-upload/constants.ts`**
- Remove `MAKES` array (now comes from database)
- Add `COLORS` array for the color dropdown
- Keep `EQUIPMENT_LIST`, `STEPS`, and other constants

**`src/components/car-upload/StepBasicInfo.tsx`**
- Replace all free-text inputs (except mileage, price, VIN) with Select dropdowns
- Implement cascading logic: selecting a make loads models, selecting a model loads variants
- Auto-fill power_hp, fuel_type, transmission, body_type when a variant is selected
- Show auto-filled fields as read-only styled selects or badges
- Year becomes a dropdown (2000-2026)
- Color becomes a dropdown from `COLORS` constant

**`src/pages/CarUpload.tsx`**
- Pass variant data to submit handler
- Store variant in car record if needed

### Data Coverage

The seed function will include comprehensive data for at least these makes:
Audi, BMW, Mercedes-Benz, Volkswagen, Porsche, Opel, Ford, Toyota, Hyundai, Kia, Skoda, SEAT, Peugeot, Renault, Volvo, Fiat, Mazda, Honda, Nissan, Tesla, Citroen, Dacia, Alfa Romeo, Jeep, Land Rover, MINI, Suzuki, Mitsubishi

Each with their most popular models and 2-5 variants per model with accurate specs.

