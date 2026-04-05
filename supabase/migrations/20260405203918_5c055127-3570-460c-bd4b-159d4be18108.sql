
-- Enable realtime for negotiation_rounds
ALTER PUBLICATION supabase_realtime ADD TABLE public.negotiation_rounds;

-- Drop and recreate the action check constraint to allow admin actions
ALTER TABLE public.negotiation_rounds DROP CONSTRAINT IF EXISTS negotiation_rounds_action_check;
ALTER TABLE public.negotiation_rounds ADD CONSTRAINT negotiation_rounds_action_check
  CHECK (action IN ('offer', 'counter', 'accept', 'reject', 'admin_cancel', 'admin_restart'));

-- Allow admins to insert audit rounds
CREATE POLICY "Admins can insert audit rounds"
ON public.negotiation_rounds
FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'));
