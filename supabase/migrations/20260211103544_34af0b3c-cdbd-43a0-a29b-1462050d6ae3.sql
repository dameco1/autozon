
-- Add column to store AI-detected confirmed damages as JSONB
ALTER TABLE public.cars
ADD COLUMN detected_damages jsonb DEFAULT '[]'::jsonb;

COMMENT ON COLUMN public.cars.detected_damages IS 'Array of AI-detected and user-confirmed damages with type, location, severity, confidence, description';
