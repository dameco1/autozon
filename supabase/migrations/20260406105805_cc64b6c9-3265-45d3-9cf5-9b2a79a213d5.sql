
-- Allow transaction participants to view each other's profiles
CREATE POLICY "Transaction participants can view counterparty profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  user_id IN (
    SELECT buyer_id FROM public.transactions WHERE seller_id = auth.uid()
    UNION
    SELECT seller_id FROM public.transactions WHERE buyer_id = auth.uid()
  )
);
