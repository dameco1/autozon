CREATE POLICY "Service role can update suppressed emails"
ON public.suppressed_emails
FOR UPDATE TO service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "Service role can delete suppressed emails"
ON public.suppressed_emails
FOR DELETE TO service_role
USING (true);