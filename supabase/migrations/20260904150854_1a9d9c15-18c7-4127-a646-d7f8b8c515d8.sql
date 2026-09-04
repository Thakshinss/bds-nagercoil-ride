CREATE SCHEMA IF NOT EXISTS app_private;

CREATE OR REPLACE FUNCTION app_private.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, app_private
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

REVOKE ALL ON SCHEMA app_private FROM PUBLIC;
REVOKE ALL ON FUNCTION app_private.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;

GRANT USAGE ON SCHEMA app_private TO authenticated;
GRANT EXECUTE ON FUNCTION app_private.has_role(uuid, public.app_role) TO authenticated;

DROP POLICY IF EXISTS "Admins manage roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins manage banner content" ON public.banner_content;
DROP POLICY IF EXISTS "Admins manage banner images" ON public.banner_images;
DROP POLICY IF EXISTS "Admins delete bookings" ON public.bookings;
DROP POLICY IF EXISTS "Admins update bookings" ON public.bookings;
DROP POLICY IF EXISTS "Admins view bookings" ON public.bookings;
DROP POLICY IF EXISTS "Drivers can claim unassigned bookings" ON public.bookings;
DROP POLICY IF EXISTS "Drivers can view available bookings" ON public.bookings;
DROP POLICY IF EXISTS "Admins manage cars" ON public.cars;
DROP POLICY IF EXISTS "Admins view all cars" ON public.cars;
DROP POLICY IF EXISTS "Drivers can view all customer bookings" ON public.customer_bookings;
DROP POLICY IF EXISTS "Admins can manage all applications" ON public.driver_applications;
DROP POLICY IF EXISTS "Admins see all wallets" ON public.driver_wallets;
DROP POLICY IF EXISTS "Admins manage fares" ON public.fares;
DROP POLICY IF EXISTS "Drivers can view customer profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins manage tour packages" ON public.tour_packages;
DROP POLICY IF EXISTS "Admins manage wallet config" ON public.wallet_config;
DROP POLICY IF EXISTS "Admins see all transactions" ON public.wallet_transactions;
DROP POLICY IF EXISTS "Admins see all withdrawals" ON public.withdrawal_requests;

DROP FUNCTION IF EXISTS public.has_role(uuid, public.app_role);

DROP POLICY IF EXISTS "Admins manage banner images" ON public.banner_images;
CREATE POLICY "Admins manage banner images"
  ON public.banner_images
  FOR ALL
  TO authenticated
  USING (app_private.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (app_private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins manage banner content" ON public.banner_content;
CREATE POLICY "Admins manage banner content"
  ON public.banner_content
  FOR ALL
  TO authenticated
  USING (app_private.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (app_private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins manage cars" ON public.cars;
CREATE POLICY "Admins manage cars"
  ON public.cars
  FOR ALL
  TO authenticated
  USING (app_private.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (app_private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins manage fares" ON public.fares;
CREATE POLICY "Admins manage fares"
  ON public.fares
  FOR ALL
  TO authenticated
  USING (app_private.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (app_private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins manage tour packages" ON public.tour_packages;
CREATE POLICY "Admins manage tour packages"
  ON public.tour_packages
  FOR ALL
  TO authenticated
  USING (app_private.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (app_private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins manage roles" ON public.user_roles;
CREATE POLICY "Admins manage roles"
  ON public.user_roles
  FOR ALL
  TO authenticated
  USING (app_private.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (app_private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins manage wallet config" ON public.wallet_config;
CREATE POLICY "Admins manage wallet config"
  ON public.wallet_config
  FOR ALL
  TO authenticated
  USING (app_private.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (app_private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins delete bookings" ON public.bookings;
CREATE POLICY "Admins delete bookings"
  ON public.bookings
  FOR DELETE
  TO authenticated
  USING (app_private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins update bookings" ON public.bookings;
CREATE POLICY "Admins update bookings"
  ON public.bookings
  FOR UPDATE
  TO authenticated
  USING (app_private.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (app_private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins view bookings" ON public.bookings;
CREATE POLICY "Admins view bookings"
  ON public.bookings
  FOR SELECT
  TO authenticated
  USING (app_private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins see all wallets" ON public.driver_wallets;
CREATE POLICY "Admins see all wallets"
  ON public.driver_wallets
  FOR SELECT
  TO authenticated
  USING (app_private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins see all transactions" ON public.wallet_transactions;
CREATE POLICY "Admins see all transactions"
  ON public.wallet_transactions
  FOR SELECT
  TO authenticated
  USING (app_private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins see all withdrawals" ON public.withdrawal_requests;
CREATE POLICY "Admins see all withdrawals"
  ON public.withdrawal_requests
  FOR SELECT
  TO authenticated
  USING (app_private.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Drivers can claim unassigned bookings"
  ON public.bookings
  FOR UPDATE
  TO authenticated
  USING (app_private.has_role(auth.uid(), 'driver'::public.app_role) AND driver_id IS NULL)
  WITH CHECK (driver_id = auth.uid());

CREATE POLICY "Drivers can view available bookings"
  ON public.bookings
  FOR SELECT
  TO authenticated
  USING (app_private.has_role(auth.uid(), 'driver'::public.app_role) AND driver_id IS NULL);

CREATE POLICY "Drivers can view all customer bookings"
  ON public.customer_bookings
  FOR SELECT
  TO authenticated
  USING (app_private.has_role(auth.uid(), 'driver'::public.app_role));

CREATE POLICY "Drivers can view customer profiles"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (app_private.has_role(auth.uid(), 'driver'::public.app_role));

DROP POLICY IF EXISTS "Admins can manage all applications" ON public.driver_applications;
CREATE POLICY "Admins can manage all applications"
  ON public.driver_applications
  FOR ALL
  TO authenticated
  USING (app_private.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (app_private.has_role(auth.uid(), 'admin'::public.app_role));

CREATE OR REPLACE FUNCTION public.apply_wallet_adjustment(_driver_id uuid, _type public.wallet_txn_type, _amount numeric, _description text, _ride_id uuid DEFAULT NULL::uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  w public.driver_wallets;
  signed NUMERIC(12,2);
  bal_before NUMERIC(12,2);
  bal_after NUMERIC(12,2);
BEGIN
  IF NOT app_private.has_role(auth.uid(), 'admin'::public.app_role) THEN RAISE EXCEPTION 'Only admins can apply adjustments'; END IF;
  IF _type NOT IN ('bonus','penalty','refund','adjustment') THEN RAISE EXCEPTION 'Invalid adjustment type'; END IF;
  w := public.ensure_driver_wallet(_driver_id);
  bal_before := w.available_balance;
  IF _type IN ('penalty') THEN signed := -ABS(_amount); ELSE signed := ABS(_amount); END IF;
  bal_after := bal_before + signed;
  IF bal_after < 0 THEN RAISE EXCEPTION 'Adjustment would result in negative balance'; END IF;
  INSERT INTO public.wallet_transactions(driver_id, ride_id, type, amount, balance_before, balance_after, description)
  VALUES (_driver_id, _ride_id, _type, signed, bal_before, bal_after, _description);
  UPDATE public.driver_wallets SET available_balance = bal_after, total_earnings = total_earnings + GREATEST(signed, 0), lifetime_earnings = lifetime_earnings + GREATEST(signed, 0) WHERE driver_id = _driver_id;
END;
$function$;

CREATE OR REPLACE FUNCTION public.request_withdrawal(_amount numeric)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  cfg public.wallet_config;
  w public.driver_wallets;
  new_id UUID;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  IF NOT app_private.has_role(auth.uid(), 'driver'::public.app_role) THEN RAISE EXCEPTION 'Only drivers can request withdrawals'; END IF;
  SELECT * INTO cfg FROM public.wallet_config WHERE id = true;
  IF _amount < cfg.min_withdrawal THEN RAISE EXCEPTION 'Amount below minimum (%)', cfg.min_withdrawal; END IF;
  IF _amount > cfg.max_withdrawal THEN RAISE EXCEPTION 'Amount above maximum (%)', cfg.max_withdrawal; END IF;
  w := public.ensure_driver_wallet(auth.uid());
  IF _amount > w.available_balance THEN RAISE EXCEPTION 'Amount exceeds available balance'; END IF;
  UPDATE public.driver_wallets SET available_balance = available_balance - _amount, pending_balance = pending_balance + _amount WHERE driver_id = auth.uid();
  INSERT INTO public.withdrawal_requests(driver_id, amount, status) VALUES (auth.uid(), _amount, 'pending') RETURNING id INTO new_id;
  RETURN new_id;
END;
$function$;

CREATE OR REPLACE FUNCTION public.process_withdrawal(_request_id uuid, _new_status public.withdrawal_status, _notes text DEFAULT NULL::text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  r public.withdrawal_requests;
  w public.driver_wallets;
  bal_before NUMERIC(12,2);
BEGIN
  IF NOT app_private.has_role(auth.uid(), 'admin'::public.app_role) THEN RAISE EXCEPTION 'Only admins can process withdrawals'; END IF;
  SELECT * INTO r FROM public.withdrawal_requests WHERE id = _request_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Request not found'; END IF;
  IF r.status IN ('approved','completed','rejected') THEN RAISE EXCEPTION 'Request already finalised'; END IF;
  IF _new_status = 'rejected' THEN
    UPDATE public.driver_wallets SET pending_balance = pending_balance - r.amount, available_balance = available_balance + r.amount WHERE driver_id = r.driver_id;
    UPDATE public.withdrawal_requests SET status = 'rejected', admin_notes = _notes, processed_by = auth.uid(), processed_at = now() WHERE id = r.id;
  ELSIF _new_status IN ('approved','completed') THEN
    SELECT * INTO w FROM public.driver_wallets WHERE driver_id = r.driver_id FOR UPDATE;
    bal_before := w.available_balance;
    INSERT INTO public.wallet_transactions(driver_id, ride_id, type, amount, balance_before, balance_after, description) VALUES (r.driver_id, NULL, 'withdrawal', -r.amount, bal_before, bal_before, 'Withdrawal ' || _new_status::text || ' (request ' || r.id || ')');
    UPDATE public.driver_wallets SET pending_balance = pending_balance - r.amount, total_withdrawn = total_withdrawn + r.amount WHERE driver_id = r.driver_id;
    UPDATE public.withdrawal_requests SET status = _new_status, admin_notes = _notes, processed_by = auth.uid(), processed_at = now() WHERE id = r.id;
  ELSIF _new_status = 'processing' THEN
    UPDATE public.withdrawal_requests SET status = 'processing', admin_notes = _notes WHERE id = r.id;
  ELSE RAISE EXCEPTION 'Invalid target status'; END IF;
END;
$function$;