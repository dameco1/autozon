
-- Transactions table to track the full acquisition journey
CREATE TABLE public.transactions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  offer_id uuid NOT NULL REFERENCES public.offers(id),
  car_id uuid NOT NULL REFERENCES public.cars(id),
  buyer_id uuid NOT NULL,
  seller_id uuid NOT NULL,
  agreed_price numeric NOT NULL,

  -- Step 1: Completion method
  completion_method text, -- 'digital' or 'manual'

  -- Step 2: Contract
  contract_type text, -- 'oeamtc' (Austria) or 'adac' (Germany)
  contract_generated_at timestamptz,
  contract_signed_buyer boolean NOT NULL DEFAULT false,
  contract_signed_seller boolean NOT NULL DEFAULT false,

  -- Step 3: Payment / Financing
  payment_method text, -- 'cash', 'credit', 'leasing'
  financing_partner_id uuid REFERENCES public.financing_partners(id),
  payment_confirmed boolean NOT NULL DEFAULT false,

  -- Step 4: Insurance
  insurance_tier text, -- 'liability', 'partial', 'comprehensive'
  insurance_partner_id uuid REFERENCES public.financing_partners(id),
  insurance_confirmed boolean NOT NULL DEFAULT false,

  -- Overall status
  status text NOT NULL DEFAULT 'initiated', -- initiated, contract_pending, payment_pending, insurance_pending, completed, cancelled
  current_step integer NOT NULL DEFAULT 1,

  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Buyers can view/update their transactions
CREATE POLICY "Buyers can view own transactions"
  ON public.transactions FOR SELECT
  USING (auth.uid() = buyer_id);

CREATE POLICY "Buyers can insert own transactions"
  ON public.transactions FOR INSERT
  WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "Buyers can update own transactions"
  ON public.transactions FOR UPDATE
  USING (auth.uid() = buyer_id);

-- Sellers can view transactions on their cars
CREATE POLICY "Sellers can view own transactions"
  ON public.transactions FOR SELECT
  USING (auth.uid() = seller_id);

CREATE POLICY "Sellers can update own transactions"
  ON public.transactions FOR UPDATE
  USING (auth.uid() = seller_id);

-- Admins full access
CREATE POLICY "Admins can view all transactions"
  ON public.transactions FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update all transactions"
  ON public.transactions FOR UPDATE
  USING (has_role(auth.uid(), 'admin'));

-- Trigger for updated_at
CREATE TRIGGER update_transactions_updated_at
  BEFORE UPDATE ON public.transactions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
