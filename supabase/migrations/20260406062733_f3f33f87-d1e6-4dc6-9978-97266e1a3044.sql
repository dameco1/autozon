
DROP POLICY IF EXISTS "Authenticated users can insert own feedback" ON appraisal_feedback;
DROP POLICY IF EXISTS "Only car owners can insert appraisal feedback" ON appraisal_feedback;

CREATE POLICY "Only car owners can insert appraisal feedback"
  ON appraisal_feedback FOR INSERT
  TO authenticated
  WITH CHECK (
    car_id IN (
      SELECT id FROM cars WHERE owner_id = auth.uid()
    )
  );
