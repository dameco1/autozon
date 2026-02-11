
-- Create car_models table for cascading dropdowns
CREATE TABLE public.car_models (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  variant TEXT NOT NULL,
  year_from INTEGER NOT NULL DEFAULT 2000,
  year_to INTEGER,
  power_hp INTEGER NOT NULL DEFAULT 0,
  fuel_type TEXT NOT NULL DEFAULT 'Petrol',
  transmission TEXT NOT NULL DEFAULT 'Manual',
  body_type TEXT NOT NULL DEFAULT 'Sedan'
);

-- Enable RLS
ALTER TABLE public.car_models ENABLE ROW LEVEL SECURITY;

-- Public read access (anyone can browse car specs)
CREATE POLICY "Anyone can read car models"
ON public.car_models
FOR SELECT
USING (true);

-- Index for fast cascading lookups
CREATE INDEX idx_car_models_make_model ON public.car_models (make, model);
CREATE INDEX idx_car_models_make ON public.car_models (make);
