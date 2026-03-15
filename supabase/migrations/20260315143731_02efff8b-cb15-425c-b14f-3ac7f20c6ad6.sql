DROP POLICY "Buyers can insert own transactions" ON public.transactions;

CREATE POLICY "Buyers can insert own transactions"
ON public.transactions
FOR INSERT
TO public
WITH CHECK (
  auth.uid() = buyer_id
  AND buyer_id <> seller_id
  AND EXISTS (
    SELECT 1
    FROM public.offers
    WHERE offers.id = transactions.offer_id
      AND offers.buyer_id = auth.uid()
      AND offers.status = 'accepted'
      AND offers.agreed_price = transactions.agreed_price
  )
);