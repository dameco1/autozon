
CREATE OR REPLACE FUNCTION public.transaction_seller_sign_contract(_transaction_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM transactions
    WHERE id = _transaction_id
      AND seller_id = auth.uid()
      AND current_step >= 2
      AND completion_method = 'digital'
  ) THEN
    RAISE EXCEPTION 'Permission denied or invalid state';
  END IF;

  UPDATE transactions
  SET contract_signed_seller = true
  WHERE id = _transaction_id;
END;
$$;
