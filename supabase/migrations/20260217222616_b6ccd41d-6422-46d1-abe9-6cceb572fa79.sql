-- Add documentation and condition fields to cars table
ALTER TABLE public.cars ADD COLUMN IF NOT EXISTS smoker_car boolean DEFAULT false;
ALTER TABLE public.cars ADD COLUMN IF NOT EXISTS service_book_updated boolean DEFAULT false;
ALTER TABLE public.cars ADD COLUMN IF NOT EXISTS original_docs_available boolean DEFAULT false;
ALTER TABLE public.cars ADD COLUMN IF NOT EXISTS maintenance_receipts boolean DEFAULT false;