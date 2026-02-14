
-- Tighten the car_views INSERT policy: only allow inserting views for available cars
DROP POLICY "Anyone can record a view" ON public.car_views;
CREATE POLICY "Anyone can record a view for available cars"
  ON public.car_views FOR INSERT
  WITH CHECK (
    car_id IN (SELECT id FROM public.cars WHERE status = 'available')
  );
