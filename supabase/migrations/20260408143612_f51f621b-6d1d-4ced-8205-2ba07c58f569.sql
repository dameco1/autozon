CREATE OR REPLACE VIEW public.cars_public
WITH (security_invoker = true)
AS
SELECT
  id, make, model, year, mileage, fuel_type, transmission, body_type, color,
  power_hp, price, description, features, equipment, image_url, photos,
  condition_score, condition_exterior, condition_interior, demand_score,
  fair_value_price, detected_damages, inspection_checklist,
  accident_history, accident_details, has_roof_box, has_roof_rack,
  second_wheel_set, maintenance_receipts, original_docs_available,
  service_book_updated, smoker_car, placement_paid, market_blended,
  is_seed, status, owner_id, created_at, updated_at
FROM cars
WHERE status = 'available' AND placement_paid = true;