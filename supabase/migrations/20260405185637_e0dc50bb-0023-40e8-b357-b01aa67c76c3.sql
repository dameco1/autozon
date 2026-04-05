
-- acquisition_quotes: public → authenticated
DROP POLICY IF EXISTS "Users can view own quotes" ON public.acquisition_quotes;
DROP POLICY IF EXISTS "Users can insert own quotes" ON public.acquisition_quotes;
DROP POLICY IF EXISTS "Users can update own quotes" ON public.acquisition_quotes;
DROP POLICY IF EXISTS "Users can delete own quotes" ON public.acquisition_quotes;

CREATE POLICY "Users can view own quotes" ON public.acquisition_quotes FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own quotes" ON public.acquisition_quotes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own quotes" ON public.acquisition_quotes FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own quotes" ON public.acquisition_quotes FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- buyer_selections: public → authenticated
DROP POLICY IF EXISTS "Users can view own selections" ON public.buyer_selections;
DROP POLICY IF EXISTS "Users can insert own selections" ON public.buyer_selections;
DROP POLICY IF EXISTS "Users can update own selections" ON public.buyer_selections;
DROP POLICY IF EXISTS "Users can delete own selections" ON public.buyer_selections;

CREATE POLICY "Users can view own selections" ON public.buyer_selections FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own selections" ON public.buyer_selections FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own selections" ON public.buyer_selections FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own selections" ON public.buyer_selections FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- user_preferences: public → authenticated
DROP POLICY IF EXISTS "Users can view own preferences" ON public.user_preferences;
DROP POLICY IF EXISTS "Users can insert own preferences" ON public.user_preferences;
DROP POLICY IF EXISTS "Users can update own preferences" ON public.user_preferences;
DROP POLICY IF EXISTS "Users can delete own preferences" ON public.user_preferences;

CREATE POLICY "Users can view own preferences" ON public.user_preferences FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own preferences" ON public.user_preferences FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own preferences" ON public.user_preferences FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own preferences" ON public.user_preferences FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- chat_messages: public → authenticated
DROP POLICY IF EXISTS "Users can view own messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Users can insert own messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Users can delete own messages" ON public.chat_messages;

CREATE POLICY "Users can view own messages" ON public.chat_messages FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own messages" ON public.chat_messages FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own messages" ON public.chat_messages FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- matches: public → authenticated (user policies only; admin policies already authenticated)
DROP POLICY IF EXISTS "Users can view own matches" ON public.matches;
DROP POLICY IF EXISTS "Users can insert own matches" ON public.matches;
DROP POLICY IF EXISTS "Users can update own matches" ON public.matches;
DROP POLICY IF EXISTS "Users can delete own matches" ON public.matches;
DROP POLICY IF EXISTS "Admins can view all matches" ON public.matches;
DROP POLICY IF EXISTS "Admins can insert matches" ON public.matches;
DROP POLICY IF EXISTS "Admins can update matches" ON public.matches;
DROP POLICY IF EXISTS "Admins can delete matches" ON public.matches;

CREATE POLICY "Users can view own matches" ON public.matches FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own matches" ON public.matches FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own matches" ON public.matches FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own matches" ON public.matches FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all matches" ON public.matches FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can insert matches" ON public.matches FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update matches" ON public.matches FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can delete matches" ON public.matches FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- car_shortlists: public → authenticated
DROP POLICY IF EXISTS "Users can view own shortlists" ON public.car_shortlists;
DROP POLICY IF EXISTS "Users can insert own shortlists" ON public.car_shortlists;
DROP POLICY IF EXISTS "Users can delete own shortlists" ON public.car_shortlists;
DROP POLICY IF EXISTS "Owners can view shortlists on their cars" ON public.car_shortlists;

CREATE POLICY "Users can view own shortlists" ON public.car_shortlists FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own shortlists" ON public.car_shortlists FOR INSERT TO authenticated WITH CHECK ((auth.uid() = user_id) AND (NOT (EXISTS ( SELECT 1 FROM cars WHERE cars.id = car_shortlists.car_id AND cars.owner_id = auth.uid()))));
CREATE POLICY "Users can delete own shortlists" ON public.car_shortlists FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Owners can view shortlists on their cars" ON public.car_shortlists FOR SELECT TO authenticated USING (car_id IN ( SELECT cars.id FROM cars WHERE cars.owner_id = auth.uid()));

-- car_views: public → authenticated (keep insert open for anon page views? No — require auth)
DROP POLICY IF EXISTS "Anyone can record a view for available cars" ON public.car_views;
DROP POLICY IF EXISTS "Owners can view stats on their cars" ON public.car_views;

CREATE POLICY "Authenticated users can record a view" ON public.car_views FOR INSERT TO authenticated WITH CHECK (car_id IN ( SELECT cars.id FROM cars WHERE cars.status = 'available'::text));
CREATE POLICY "Owners can view stats on their cars" ON public.car_views FOR SELECT TO authenticated USING (car_id IN ( SELECT cars.id FROM cars WHERE cars.owner_id = auth.uid()));

-- notifications: public → authenticated (user policies)
DROP POLICY IF EXISTS "Users can view own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can delete own notifications" ON public.notifications;

CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own notifications" ON public.notifications FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- offers: public → authenticated
DROP POLICY IF EXISTS "Buyers can view own offers" ON public.offers;
DROP POLICY IF EXISTS "Sellers can view offers on their cars" ON public.offers;
DROP POLICY IF EXISTS "Buyers can create offers" ON public.offers;
DROP POLICY IF EXISTS "Sellers can create offers" ON public.offers;
DROP POLICY IF EXISTS "Buyers can update own offers" ON public.offers;
DROP POLICY IF EXISTS "Sellers can update offers on their cars" ON public.offers;
DROP POLICY IF EXISTS "Admins can update all offers" ON public.offers;

CREATE POLICY "Buyers can view own offers" ON public.offers FOR SELECT TO authenticated USING (auth.uid() = buyer_id);
CREATE POLICY "Sellers can view offers on their cars" ON public.offers FOR SELECT TO authenticated USING (auth.uid() = seller_id);
CREATE POLICY "Buyers can create offers" ON public.offers FOR INSERT TO authenticated WITH CHECK ((auth.uid() = buyer_id) AND (buyer_id <> seller_id) AND (NOT (EXISTS ( SELECT 1 FROM cars WHERE cars.id = offers.car_id AND cars.owner_id = auth.uid()))));
CREATE POLICY "Sellers can create offers" ON public.offers FOR INSERT TO authenticated WITH CHECK ((auth.uid() = seller_id) AND (car_id IN ( SELECT cars.id FROM cars WHERE cars.owner_id = auth.uid())));
CREATE POLICY "Buyers can update own offers" ON public.offers FOR UPDATE TO authenticated USING (auth.uid() = buyer_id);
CREATE POLICY "Sellers can update offers on their cars" ON public.offers FOR UPDATE TO authenticated USING (auth.uid() = seller_id);
CREATE POLICY "Admins can update all offers" ON public.offers FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- transactions: public → authenticated
DROP POLICY IF EXISTS "Buyers can view own transactions" ON public.transactions;
DROP POLICY IF EXISTS "Sellers can view own transactions" ON public.transactions;
DROP POLICY IF EXISTS "Buyers can insert own transactions" ON public.transactions;
DROP POLICY IF EXISTS "Admins can view all transactions" ON public.transactions;
DROP POLICY IF EXISTS "Admins can update all transactions" ON public.transactions;

CREATE POLICY "Buyers can view own transactions" ON public.transactions FOR SELECT TO authenticated USING (auth.uid() = buyer_id);
CREATE POLICY "Sellers can view own transactions" ON public.transactions FOR SELECT TO authenticated USING (auth.uid() = seller_id);
CREATE POLICY "Buyers can insert own transactions" ON public.transactions FOR INSERT TO authenticated WITH CHECK ((auth.uid() = buyer_id) AND (buyer_id <> seller_id) AND (EXISTS ( SELECT 1 FROM offers WHERE offers.id = transactions.offer_id AND offers.buyer_id = auth.uid() AND offers.status = 'accepted'::text AND offers.agreed_price = transactions.agreed_price)));
CREATE POLICY "Admins can view all transactions" ON public.transactions FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update all transactions" ON public.transactions FOR UPDATE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));

-- cars: public → authenticated (except available cars view stays open for browse)
DROP POLICY IF EXISTS "Owners can view own cars" ON public.cars;
DROP POLICY IF EXISTS "Users can insert own cars" ON public.cars;
DROP POLICY IF EXISTS "Users can update own cars" ON public.cars;
DROP POLICY IF EXISTS "Users can delete own cars" ON public.cars;
DROP POLICY IF EXISTS "Anyone can view available cars" ON public.cars;

CREATE POLICY "Owners can view own cars" ON public.cars FOR SELECT TO authenticated USING (auth.uid() = owner_id);
CREATE POLICY "Users can insert own cars" ON public.cars FOR INSERT TO authenticated WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Users can update own cars" ON public.cars FOR UPDATE TO authenticated USING (auth.uid() = owner_id);
CREATE POLICY "Users can delete own cars" ON public.cars FOR DELETE TO authenticated USING (auth.uid() = owner_id);
CREATE POLICY "Authenticated can view available cars" ON public.cars FOR SELECT TO authenticated USING ((status = 'available'::text) AND (placement_paid = true));

-- car_models: remove redundant public policy
DROP POLICY IF EXISTS "Anyone can view car models" ON public.car_models;
