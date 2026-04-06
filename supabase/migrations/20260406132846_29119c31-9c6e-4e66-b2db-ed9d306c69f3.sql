CREATE POLICY "Participants can insert transaction deadlines"
ON public.transaction_deadlines
FOR INSERT
TO authenticated
WITH CHECK (
  transaction_id IN (
    SELECT t.id FROM transactions t
    WHERE t.buyer_id = auth.uid() OR t.seller_id = auth.uid()
  )
);