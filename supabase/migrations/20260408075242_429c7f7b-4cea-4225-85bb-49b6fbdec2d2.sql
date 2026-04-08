
-- Step 1: Remove the anon SELECT policy from cars table (VIN exposure)
DROP POLICY "Public can view available cars" ON public.cars;

-- Step 2: Recreate cars_public view with security_invoker=false (definer mode)
-- so anonymous users can read through the view without needing direct cars table access
DROP VIEW IF EXISTS public.cars_public;

CREATE VIEW public.cars_public
  WITH (security_invoker = false)
AS
SELECT id, make, model, year, mileage, fuel_type, transmission, body_type,
       color, power_hp, price, description, features, equipment, image_url,
       photos, condition_score, condition_exterior, condition_interior,
       demand_score, fair_value_price, detected_damages, inspection_checklist,
       accident_history, accident_details, has_roof_box, has_roof_rack,
       second_wheel_set, maintenance_receipts, original_docs_available,
       service_book_updated, smoker_car, placement_paid, market_blended,
       is_seed, status, owner_id, created_at, updated_at
FROM public.cars
WHERE status = 'available' AND placement_paid = true;

-- Grant anon access to the view only
GRANT SELECT ON public.cars_public TO anon;
GRANT SELECT ON public.cars_public TO authenticated;
