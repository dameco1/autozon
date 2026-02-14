
CREATE OR REPLACE FUNCTION public.notify_offer_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
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

  notif_link := '/negotiate/' || NEW.id;

  IF NEW.status = 'countered' THEN
    -- Notify the other party (whoever didn't just act)
    -- If counter_amount changed, seller countered → notify buyer
    -- But since buyers are seed data (not real users), notify seller if buyer countered
    notify_user_id := CASE
      WHEN OLD.counter_amount IS DISTINCT FROM NEW.counter_amount THEN NEW.buyer_id
      ELSE NEW.seller_id
    END;
    -- In practice with seed buyers, always notify seller
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
$$;

CREATE TRIGGER on_offer_status_change
  AFTER UPDATE ON public.offers
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_offer_update();
