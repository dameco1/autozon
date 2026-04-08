CREATE POLICY "Service role can insert OTPs"
ON public.email_otp
FOR INSERT TO service_role
WITH CHECK (true);