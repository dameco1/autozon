
-- Extend user_preferences with lifestyle/timing fields
ALTER TABLE public.user_preferences
  ADD COLUMN IF NOT EXISTS commute_distance text DEFAULT '',
  ADD COLUMN IF NOT EXISTS family_size integer DEFAULT 1,
  ADD COLUMN IF NOT EXISTS usage_pattern text DEFAULT 'daily',
  ADD COLUMN IF NOT EXISTS parking_type text DEFAULT 'street',
  ADD COLUMN IF NOT EXISTS ownership_preference text DEFAULT 'buy',
  ADD COLUMN IF NOT EXISTS insurance_tolerance text DEFAULT 'medium',
  ADD COLUMN IF NOT EXISTS timing_preference text DEFAULT 'planning',
  ADD COLUMN IF NOT EXISTS onboarding_completed boolean DEFAULT false;

-- Extend cars with condition/valuation fields
ALTER TABLE public.cars
  ADD COLUMN IF NOT EXISTS vin text DEFAULT '',
  ADD COLUMN IF NOT EXISTS equipment text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS condition_exterior integer DEFAULT 80,
  ADD COLUMN IF NOT EXISTS condition_interior integer DEFAULT 80,
  ADD COLUMN IF NOT EXISTS accident_history boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS accident_details text DEFAULT '',
  ADD COLUMN IF NOT EXISTS condition_score integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS fair_value_price numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS demand_score integer DEFAULT 0;
