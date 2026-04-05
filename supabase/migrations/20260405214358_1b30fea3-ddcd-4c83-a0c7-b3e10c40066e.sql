
-- Add new fields to cars table
ALTER TABLE public.cars
  ADD COLUMN IF NOT EXISTS first_registration_month integer,
  ADD COLUMN IF NOT EXISTS first_registration_year integer,
  ADD COLUMN IF NOT EXISTS pickerl_valid_month integer,
  ADD COLUMN IF NOT EXISTS pickerl_valid_year integer,
  ADD COLUMN IF NOT EXISTS warranty_type text DEFAULT 'none';

-- Make VIN mandatory (update existing empty strings to null first won't work, so set a default)
UPDATE public.cars SET vin = 'UNKNOWN-' || id WHERE vin IS NULL OR vin = '';

ALTER TABLE public.cars ALTER COLUMN vin SET NOT NULL;

-- Create trigger to prevent VIN modification after insert
CREATE OR REPLACE FUNCTION public.prevent_vin_change()
  RETURNS trigger
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path TO 'public'
AS $$
BEGIN
  IF OLD.vin IS NOT NULL AND OLD.vin != '' AND NEW.vin IS DISTINCT FROM OLD.vin THEN
    RAISE EXCEPTION 'VIN cannot be changed after car creation. Delete the car and create a new one.';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER guard_vin_immutable
  BEFORE UPDATE ON public.cars
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_vin_change();
