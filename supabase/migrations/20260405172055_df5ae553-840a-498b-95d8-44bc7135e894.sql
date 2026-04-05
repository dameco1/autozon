
DROP POLICY "Users can insert own notifications" ON public.notifications;

CREATE POLICY "Only admins can insert notifications"
  ON public.notifications FOR INSERT
  TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'));
