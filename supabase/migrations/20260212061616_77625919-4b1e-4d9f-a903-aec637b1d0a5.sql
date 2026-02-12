-- Restrict car_models table to authenticated users only
DROP POLICY IF EXISTS "Anyone can read car models" ON public.car_models;

CREATE POLICY "Authenticated users can read car models"
ON public.car_models
FOR SELECT
TO authenticated
USING (true);