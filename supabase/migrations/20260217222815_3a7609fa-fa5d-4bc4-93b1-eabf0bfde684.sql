ALTER TABLE public.cars ADD COLUMN IF NOT EXISTS second_wheel_set boolean DEFAULT false;
ALTER TABLE public.cars ADD COLUMN IF NOT EXISTS has_roof_rack boolean DEFAULT false;
ALTER TABLE public.cars ADD COLUMN IF NOT EXISTS has_roof_box boolean DEFAULT false;