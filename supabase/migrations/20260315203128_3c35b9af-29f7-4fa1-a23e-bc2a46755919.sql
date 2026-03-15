
-- Drop permissive buyer/seller UPDATE policies
DROP POLICY IF EXISTS "Buyers can update own transactions" ON public.transactions;
DROP POLICY IF EXISTS "Sellers can update own transactions" ON public.transactions;

-- Create SECURITY DEFINER functions for each valid state transition

-- Step 1: Set completion method (buyer only)
CREATE OR REPLACE FUNCTION public.transaction_set_method(
  _transaction_id uuid,
  _completion_method text,
  _status text,
  _current_step integer
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF _completion_method NOT IN ('digital', 'manual') THEN
    RAISE EXCEPTION 'Invalid completion method';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM transactions
    WHERE id = _transaction_id AND buyer_id = auth.uid() AND current_step = 1
  ) THEN
    RAISE EXCEPTION 'Permission denied or invalid state';
  END IF;
  UPDATE transactions SET
    completion_method = _completion_method,
    status = _status,
    current_step = _current_step
  WHERE id = _transaction_id;
END;
$$;

-- Step 2: Set contract info (buyer only)
CREATE OR REPLACE FUNCTION public.transaction_set_contract(
  _transaction_id uuid,
  _contract_type text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM transactions
    WHERE id = _transaction_id AND buyer_id = auth.uid() AND current_step = 2
  ) THEN
    RAISE EXCEPTION 'Permission denied or invalid state';
  END IF;
  UPDATE transactions SET
    contract_type = _contract_type,
    contract_generated_at = now(),
    contract_signed_buyer = true,
    status = 'payment_pending',
    current_step = 3
  WHERE id = _transaction_id;
END;
$$;

-- Step 3: Set payment info (buyer only)
CREATE OR REPLACE FUNCTION public.transaction_set_payment(
  _transaction_id uuid,
  _payment_method text,
  _financing_partner_id uuid DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM transactions
    WHERE id = _transaction_id AND buyer_id = auth.uid() AND current_step = 3
  ) THEN
    RAISE EXCEPTION 'Permission denied or invalid state';
  END IF;
  UPDATE transactions SET
    payment_method = _payment_method,
    financing_partner_id = _financing_partner_id,
    payment_confirmed = true,
    status = 'insurance_pending',
    current_step = 4
  WHERE id = _transaction_id;
END;
$$;

-- Step 4: Set insurance info (buyer only)
CREATE OR REPLACE FUNCTION public.transaction_set_insurance(
  _transaction_id uuid,
  _insurance_tier text DEFAULT NULL,
  _insurance_partner_id uuid DEFAULT NULL,
  _insurance_confirmed boolean DEFAULT false
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM transactions
    WHERE id = _transaction_id AND buyer_id = auth.uid() AND current_step = 4
  ) THEN
    RAISE EXCEPTION 'Permission denied or invalid state';
  END IF;
  UPDATE transactions SET
    insurance_tier = _insurance_tier,
    insurance_partner_id = _insurance_partner_id,
    insurance_confirmed = _insurance_confirmed,
    status = 'completed',
    current_step = 5
  WHERE id = _transaction_id;
  -- Mark car as sold
  UPDATE cars SET status = 'sold'
  WHERE id = (SELECT car_id FROM transactions WHERE id = _transaction_id);
END;
$$;

-- Admin-only UPDATE policy remains unchanged
-- No direct UPDATE for buyers/sellers - they must use the functions above
