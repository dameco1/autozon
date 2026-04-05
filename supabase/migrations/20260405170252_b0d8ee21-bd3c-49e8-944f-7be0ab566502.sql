
DROP POLICY "Authenticated users can insert own feedback" ON public.appraisal_feedback;

CREATE POLICY "Only car owners can insert appraisal feedback"
  ON public.appraisal_feedback FOR INSERT
  TO authenticated
  WITH CHECK (
    car_id IN (
      SELECT id FROM public.cars WHERE owner_id = auth.uid()
    )
  );
