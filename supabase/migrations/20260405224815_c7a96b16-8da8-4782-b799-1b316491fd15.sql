
-- Add user type and business fields to profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS user_type text NOT NULL DEFAULT 'private',
  ADD COLUMN IF NOT EXISTS company_name text,
  ADD COLUMN IF NOT EXISTS uid_number text,
  ADD COLUMN IF NOT EXISTS commercial_registry_number text,
  ADD COLUMN IF NOT EXISTS authorized_representative text,
  ADD COLUMN IF NOT EXISTS date_of_birth date;

-- Add KYC tracking to transactions
ALTER TABLE public.transactions
  ADD COLUMN IF NOT EXISTS buyer_kyc_status text NOT NULL DEFAULT 'none',
  ADD COLUMN IF NOT EXISTS seller_kyc_status text NOT NULL DEFAULT 'none';

-- Create kyc_verifications table
CREATE TABLE public.kyc_verifications (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  transaction_id uuid,
  role text NOT NULL DEFAULT 'buyer',
  didit_session_id text,
  status text NOT NULL DEFAULT 'not_started',
  decision_json jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.kyc_verifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own kyc verifications"
  ON public.kyc_verifications FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own kyc verifications"
  ON public.kyc_verifications FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own kyc verifications"
  ON public.kyc_verifications FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all kyc verifications"
  ON public.kyc_verifications FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_kyc_verifications_updated_at
  BEFORE UPDATE ON public.kyc_verifications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
