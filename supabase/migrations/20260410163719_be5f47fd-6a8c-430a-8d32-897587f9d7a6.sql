CREATE POLICY "Anon can upload to temp folder"
ON storage.objects
FOR INSERT
TO anon
WITH CHECK (bucket_id = 'car-images' AND (storage.foldername(name))[1] = 'temp');