CREATE TABLE public.appraisal_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  car_id uuid NOT NULL,
  make text NOT NULL,
  model text NOT NULL,
  year integer NOT NULL,
  body_type text NOT NULL DEFAULT 'Sedan',
  fuel_type text NOT NULL DEFAULT 'Petrol',
  mileage integer NOT NULL DEFAULT 0,
  formula_value numeric NOT NULL,
  market_avg_value numeric,
  market_max_value numeric,
  blended_value numeric,
  agreed_sale_price numeric,
  deviation_pct numeric,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.appraisal_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can manage feedback"
ON public.appraisal_feedback
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated users can insert own feedback"
ON public.appraisal_feedback
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can view feedback"
ON public.appraisal_feedback
FOR SELECT
TO authenticated
USING (true);