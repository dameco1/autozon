
CREATE OR REPLACE FUNCTION public.transaction_set_contract(_transaction_id uuid, _contract_type text)
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
  -- Mark car as sold immediately upon contract signing
  UPDATE cars SET status = 'sold'
  WHERE id = (SELECT car_id FROM transactions WHERE id = _transaction_id);
END;
$$;
