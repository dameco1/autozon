CREATE POLICY "Authenticated users can update feedback"
ON public.appraisal_feedback
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);