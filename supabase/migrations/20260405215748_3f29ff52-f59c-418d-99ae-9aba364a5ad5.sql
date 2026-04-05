
-- Add contract PDF URL to transactions
ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS contract_pdf_url text;

-- Create storage bucket for contracts
INSERT INTO storage.buckets (id, name, public) VALUES ('contracts', 'contracts', false)
ON CONFLICT (id) DO NOTHING;

-- Buyers and sellers can read their own contract files
CREATE POLICY "Users can view own contract PDFs"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'contracts'
  AND auth.uid() IS NOT NULL
  AND (
    (storage.foldername(name))[1] IN (
      SELECT id::text FROM public.transactions
      WHERE buyer_id = auth.uid() OR seller_id = auth.uid()
    )
  )
);

-- Service role / edge functions upload contracts (no user upload needed directly)
CREATE POLICY "Authenticated users can upload contracts"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'contracts'
  AND auth.role() = 'authenticated'
);
