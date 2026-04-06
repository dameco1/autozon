-- Add deadline enforcement columns to transactions
ALTER TABLE public.transactions
  ADD COLUMN IF NOT EXISTS grace_period_started_at timestamptz DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS cancellation_reason text DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS stripe_payment_intent_id text DEFAULT NULL;

-- Create a function for the check-deadlines edge function to use (service role)
-- This finds transactions at step 5 with overdue manual deadlines
CREATE OR REPLACE FUNCTION public.find_overdue_transactions()
RETURNS TABLE (
  transaction_id uuid,
  buyer_id uuid,
  seller_id uuid,
  car_id uuid,
  agreed_price numeric,
  payment_method text,
  stripe_payment_intent_id text,
  grace_period_started_at timestamptz,
  status text,
  overdue_step text,
  deadline_at timestamptz
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT DISTINCT ON (t.id)
    t.id as transaction_id,
    t.buyer_id,
    t.seller_id,
    t.car_id,
    t.agreed_price,
    t.payment_method,
    t.stripe_payment_intent_id,
    t.grace_period_started_at,
    t.status,
    td.step_type as overdue_step,
    td.deadline_at
  FROM transactions t
  JOIN transaction_deadlines td ON td.transaction_id = t.id
  WHERE t.current_step = 5
    AND t.status IN ('completed', 'grace_period')
    AND td.status = 'pending'
    AND td.deadline_at < now()
  ORDER BY t.id, td.deadline_at ASC;
$$;