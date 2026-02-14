
-- Extend offers table for negotiation flow
ALTER TABLE public.offers 
  ADD COLUMN agreed_price numeric NULL,
  ADD COLUMN current_round integer NOT NULL DEFAULT 1,
  ADD COLUMN max_rounds integer NOT NULL DEFAULT 3;

-- Create financing_partners table (seeded with placeholder providers)
CREATE TABLE public.financing_partners (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  type text NOT NULL DEFAULT 'bank', -- 'bank', 'leasing', 'insurance'
  logo_url text NULL,
  description text NULL,
  base_rate numeric NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.financing_partners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active partners"
  ON public.financing_partners FOR SELECT
  USING (is_active = true);

-- Create acquisition_quotes table
CREATE TABLE public.acquisition_quotes (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  offer_id uuid NOT NULL REFERENCES public.offers(id) ON DELETE CASCADE,
  partner_id uuid NOT NULL REFERENCES public.financing_partners(id),
  user_id uuid NOT NULL,
  quote_type text NOT NULL DEFAULT 'credit', -- 'credit', 'leasing', 'insurance'
  agreed_price numeric NOT NULL,
  down_payment numeric NULL DEFAULT 0,
  term_months integer NULL DEFAULT 48,
  annual_mileage integer NULL DEFAULT 15000,
  monthly_payment numeric NULL,
  total_cost numeric NULL,
  interest_rate numeric NULL,
  residual_value numeric NULL,
  selected boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.acquisition_quotes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own quotes"
  ON public.acquisition_quotes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own quotes"
  ON public.acquisition_quotes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own quotes"
  ON public.acquisition_quotes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own quotes"
  ON public.acquisition_quotes FOR DELETE
  USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_acquisition_quotes_updated_at
  BEFORE UPDATE ON public.acquisition_quotes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Seed financing partners
INSERT INTO public.financing_partners (name, type, base_rate, description) VALUES
  ('AutoBank Direct', 'bank', 4.9, 'Competitive auto loans with quick approval'),
  ('EuroFinance', 'bank', 5.4, 'Flexible financing with no early repayment fees'),
  ('DriveCredit AG', 'bank', 6.1, 'Accessible credit for all profiles'),
  ('LeasePlan Pro', 'leasing', 3.2, 'Full-service leasing with maintenance included'),
  ('FlexLease', 'leasing', 3.8, 'Flexible contracts with gap insurance options'),
  ('AutoLease Direct', 'leasing', 4.1, 'Budget-friendly leasing for everyday drivers'),
  ('Allianz Auto', 'insurance', 0, 'Comprehensive coverage from Germany''s leading insurer'),
  ('HUK-COBURG', 'insurance', 0, 'Best value insurance with excellent claims service'),
  ('ADAC Insurance', 'insurance', 0, 'Trusted protection backed by ADAC');
