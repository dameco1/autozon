
CREATE OR REPLACE FUNCTION public.notify_offer_update()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  notify_user_id uuid;
  notif_title text;
  notif_message text;
  notif_type text;
  notif_link text;
BEGIN
  -- Only fire on status changes
  IF OLD.status = NEW.status AND OLD.counter_amount IS NOT DISTINCT FROM NEW.counter_amount THEN
    RETURN NEW;
  END IF;

  -- Verify the current user is authorized (buyer or seller)
  IF auth.uid() IS NULL OR auth.uid() NOT IN (NEW.buyer_id, NEW.seller_id) THEN
    RETURN NEW; -- Silently skip rather than raise to avoid breaking triggers
  END IF;

  notif_link := '/negotiate/' || NEW.id;

  IF NEW.status = 'countered' THEN
    notify_user_id := NEW.seller_id;
    notif_title := 'Counter-Offer Received';
    notif_message := 'A counter-offer of €' || NEW.counter_amount || ' has been made. Round ' || NEW.current_round || '/' || NEW.max_rounds || '.';
    notif_type := 'negotiation';

  ELSIF NEW.status = 'accepted' THEN
    notify_user_id := NEW.seller_id;
    notif_title := 'Deal Accepted! 🎉';
    notif_message := 'The offer has been accepted at €' || NEW.agreed_price || '. Proceed to acquisition options.';
    notif_type := 'deal';

  ELSIF NEW.status = 'rejected' THEN
    notify_user_id := NEW.seller_id;
    notif_title := 'Offer Rejected';
    notif_message := 'The negotiation has been rejected.';
    notif_type := 'negotiation';

  ELSE
    RETURN NEW;
  END IF;

  INSERT INTO public.notifications (user_id, title, message, type, link)
  VALUES (notify_user_id, notif_title, notif_message, notif_type, notif_link);

  RETURN NEW;
END;
$function$;
