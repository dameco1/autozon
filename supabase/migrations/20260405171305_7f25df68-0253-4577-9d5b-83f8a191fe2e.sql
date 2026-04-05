
-- 1. Create a public view of cars excluding VIN
CREATE OR REPLACE VIEW public.cars_public AS
SELECT
  id, make, model, year, mileage, fuel_type, transmission, body_type,
  color, power_hp, price, description, features, equipment,
  image_url, photos, condition_score, condition_exterior, condition_interior,
  demand_score, fair_value_price, detected_damages, inspection_checklist,
  accident_history, accident_details, has_roof_box, has_roof_rack,
  second_wheel_set, maintenance_receipts, original_docs_available,
  service_book_updated, smoker_car, placement_paid, market_blended,
  is_seed, status, owner_id, created_at, updated_at
FROM public.cars;

-- 2. Add UPDATE policy for car-images storage bucket
CREATE POLICY "Users can update own car images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'car-images'
  AND (auth.uid())::text = (storage.foldername(name))[1]
);

-- 3. Create trigger to prevent owners from tampering with system-controlled fields
CREATE OR REPLACE FUNCTION public.prevent_car_system_field_tampering()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Allow service_role (edge functions, admin) to modify any field
  IF current_setting('request.jwt.claims', true)::json->>'role' = 'service_role' THEN
    RETURN NEW;
  END IF;

  -- For regular users, silently revert system-controlled fields
  NEW.placement_paid := OLD.placement_paid;
  NEW.demand_score := OLD.demand_score;
  NEW.condition_score := OLD.condition_score;
  NEW.fair_value_price := OLD.fair_value_price;
  NEW.is_seed := OLD.is_seed;
  NEW.market_blended := OLD.market_blended;
  NEW.detected_damages := OLD.detected_damages;
  NEW.status := OLD.status;

  RETURN NEW;
END;
$$;

CREATE TRIGGER guard_car_system_fields
  BEFORE UPDATE ON public.cars
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_car_system_field_tampering();
