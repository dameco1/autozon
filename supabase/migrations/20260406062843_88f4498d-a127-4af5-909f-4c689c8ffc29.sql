
DROP POLICY IF EXISTS "Authenticated users can upload contracts" ON storage.objects;
DROP POLICY IF EXISTS "authenticated users can upload contracts" ON storage.objects;

CREATE POLICY "Transaction participants can upload contracts"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'contracts'
    AND (storage.foldername(name))[1] IN (
      SELECT id::text FROM public.transactions
      WHERE buyer_id = auth.uid() OR seller_id = auth.uid()
    )
  );
