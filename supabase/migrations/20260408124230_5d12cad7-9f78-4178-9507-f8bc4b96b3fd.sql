
-- Create email_otp table
CREATE TABLE public.email_otp (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  code text NOT NULL,
  expires_at timestamp with time zone NOT NULL DEFAULT (now() + interval '5 minutes'),
  verified boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.email_otp ENABLE ROW LEVEL SECURITY;

-- Users can view their own OTP records
CREATE POLICY "Users can view own OTP"
ON public.email_otp
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Only service role can insert/update/delete (edge functions)
-- No authenticated insert/update/delete policies = only service_role can modify

-- Validation trigger to reject expired codes on insert
CREATE OR REPLACE FUNCTION public.validate_email_otp_expiry()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.expires_at <= now() THEN
    RAISE EXCEPTION 'Cannot insert an already-expired OTP code';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_validate_email_otp_expiry
BEFORE INSERT ON public.email_otp
FOR EACH ROW
EXECUTE FUNCTION public.validate_email_otp_expiry();

-- Index for quick lookup
CREATE INDEX idx_email_otp_user_id ON public.email_otp (user_id, verified, expires_at);
