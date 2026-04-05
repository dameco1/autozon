
ALTER TABLE public.user_preferences
ADD COLUMN sports text[] DEFAULT '{}'::text[],
ADD COLUMN needs_towing boolean DEFAULT false,
ADD COLUMN towing_weight_kg integer DEFAULT NULL;
