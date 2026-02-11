
-- Create storage bucket for car images
INSERT INTO storage.buckets (id, name, public) VALUES ('car-images', 'car-images', true);

-- Allow authenticated users to upload to their own folder
CREATE POLICY "Users can upload car images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'car-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow public read access
CREATE POLICY "Car images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'car-images');

-- Allow users to delete their own images
CREATE POLICY "Users can delete own car images"
ON storage.objects FOR DELETE
USING (bucket_id = 'car-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Add photos array column to cars table
ALTER TABLE public.cars ADD COLUMN photos text[] DEFAULT '{}';
