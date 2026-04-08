-- Fix 1: Change profiles admin update policy from {public} to {authenticated}
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
CREATE POLICY "Admins can update all profiles"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Fix 2: Fix car_views INSERT policy to enforce viewer_id = auth.uid()
DROP POLICY IF EXISTS "Authenticated users can record a view" ON public.car_views;
CREATE POLICY "Authenticated users can record a view"
  ON public.car_views
  FOR INSERT
  TO authenticated
  WITH CHECK (
    (viewer_id = auth.uid() OR viewer_id IS NULL)
    AND car_id IN (SELECT id FROM cars WHERE status = 'available')
  );

-- Fix 3: Add DELETE policy on contracts bucket for admins only
CREATE POLICY "Only admins can delete contracts"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'contracts'
    AND has_role(auth.uid(), 'admin'::app_role)
  );