
-- Fix 1: Drop overly permissive notifications insert policy
DROP POLICY IF EXISTS "System can insert notifications" ON public.notifications;

-- Fix 2: Drop existing public cars policy and replace with one that also checks placement_paid
DROP POLICY IF EXISTS "Anyone can view available cars" ON public.cars;
CREATE POLICY "Anyone can view available cars"
  ON public.cars FOR SELECT
  TO public
  USING (status = 'available' AND placement_paid = true);
