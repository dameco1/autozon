-- Allow anonymous users to view available, paid-placement cars
CREATE POLICY "Anon can view available cars"
  ON public.cars
  FOR SELECT
  TO anon
  USING (status = 'available' AND placement_paid = true);
