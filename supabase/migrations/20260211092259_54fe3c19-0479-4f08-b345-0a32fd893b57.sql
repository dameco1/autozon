
-- Add new columns to user_preferences
ALTER TABLE public.user_preferences 
ADD COLUMN IF NOT EXISTS user_intent text DEFAULT NULL,
ADD COLUMN IF NOT EXISTS preferred_colors text[] DEFAULT '{}';

-- Create buyer_selections table for tracking narrowing rounds
CREATE TABLE public.buyer_selections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  car_id UUID NOT NULL REFERENCES public.cars(id) ON DELETE CASCADE,
  round INTEGER NOT NULL DEFAULT 1,
  liked BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.buyer_selections ENABLE ROW LEVEL SECURITY;

-- RLS policies: users can only manage their own selections
CREATE POLICY "Users can view own selections" ON public.buyer_selections
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own selections" ON public.buyer_selections
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own selections" ON public.buyer_selections
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own selections" ON public.buyer_selections
FOR DELETE USING (auth.uid() = user_id);
