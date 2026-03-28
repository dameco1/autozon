CREATE POLICY "Admins can view all feedback"
ON public.appraisal_feedback
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));