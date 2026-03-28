
-- Drop overly permissive SELECT and UPDATE policies
DROP POLICY IF EXISTS "Authenticated users can view feedback" ON public.appraisal_feedback;
DROP POLICY IF EXISTS "Authenticated users can update feedback" ON public.appraisal_feedback;

-- Users can only view feedback for their own cars
CREATE POLICY "Users can view own car feedback" ON public.appraisal_feedback
  FOR SELECT TO authenticated
  USING (car_id IN (SELECT id FROM public.cars WHERE owner_id = auth.uid()));

-- Users can only update feedback for their own cars
CREATE POLICY "Users can update own car feedback" ON public.appraisal_feedback
  FOR UPDATE TO authenticated
  USING (car_id IN (SELECT id FROM public.cars WHERE owner_id = auth.uid()));
