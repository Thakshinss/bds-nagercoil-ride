
-- =========================================
-- ENUMS
-- =========================================
CREATE TYPE public.wallet_txn_type AS ENUM (
  'ride_credit','commission_deduction','bonus','penalty','refund','withdrawal','adjustment'
);

CREATE TYPE public.withdrawal_status AS ENUM (
  'pending','processing','approved','rejected','completed'
);

-- =========================================
-- wallet_config (singleton)
-- =========================================
CREATE TABLE public.wallet_config (
  id BOOLEAN PRIMARY KEY DEFAULT true CHECK (id = true),
  commission_percent NUMERIC(5,2) NOT NULL DEFAULT 20 CHECK (commission_percent >= 0 AND commission_percent <= 100),
  min_withdrawal NUMERIC(12,2) NOT NULL DEFAULT 100,
  max_withdrawal NUMERIC(12,2) NOT NULL DEFAULT 50000,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.wallet_config TO authenticated;
GRANT ALL ON public.wallet_config TO service_role;
ALTER TABLE public.wallet_config ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone authed can read wallet config" ON public.wallet_config
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins manage wallet config" ON public.wallet_config
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
INSERT INTO public.wallet_config (id) VALUES (true);

-- =========================================
-- driver_wallets
-- =========================================
CREATE TABLE public.driver_wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  available_balance NUMERIC(12,2) NOT NULL DEFAULT 0,
  pending_balance NUMERIC(12,2) NOT NULL DEFAULT 0,
  total_earnings NUMERIC(12,2) NOT NULL DEFAULT 0,
  total_withdrawn NUMERIC(12,2) NOT NULL DEFAULT 0,
  lifetime_earnings NUMERIC(12,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.driver_wallets TO authenticated;
GRANT ALL ON public.driver_wallets TO service_role;
ALTER TABLE public.driver_wallets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Drivers see own wallet" ON public.driver_wallets
  FOR SELECT TO authenticated USING (driver_id = auth.uid());
CREATE POLICY "Admins see all wallets" ON public.driver_wallets
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER trg_driver_wallets_updated
BEFORE UPDATE ON public.driver_wallets
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================================
-- wallet_transactions (append-only ledger)
-- =========================================
CREATE TABLE public.wallet_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  ride_id UUID REFERENCES public.customer_bookings(id) ON DELETE SET NULL,
  type public.wallet_txn_type NOT NULL,
  amount NUMERIC(12,2) NOT NULL,
  balance_before NUMERIC(12,2) NOT NULL,
  balance_after NUMERIC(12,2) NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_wallet_txn_driver ON public.wallet_transactions(driver_id, created_at DESC);
GRANT SELECT ON public.wallet_transactions TO authenticated;
GRANT ALL ON public.wallet_transactions TO service_role;
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Drivers see own transactions" ON public.wallet_transactions
  FOR SELECT TO authenticated USING (driver_id = auth.uid());
CREATE POLICY "Admins see all transactions" ON public.wallet_transactions
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
-- No INSERT/UPDATE/DELETE policies: ledger writes go through SECURITY DEFINER funcs.

-- =========================================
-- withdrawal_requests
-- =========================================
CREATE TABLE public.withdrawal_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount NUMERIC(12,2) NOT NULL CHECK (amount > 0),
  status public.withdrawal_status NOT NULL DEFAULT 'pending',
  admin_notes TEXT,
  processed_by UUID REFERENCES auth.users(id),
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_withdrawal_driver ON public.withdrawal_requests(driver_id, created_at DESC);
GRANT SELECT ON public.withdrawal_requests TO authenticated;
GRANT ALL ON public.withdrawal_requests TO service_role;
ALTER TABLE public.withdrawal_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Drivers see own withdrawals" ON public.withdrawal_requests
  FOR SELECT TO authenticated USING (driver_id = auth.uid());
CREATE POLICY "Admins see all withdrawals" ON public.withdrawal_requests
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER trg_withdrawal_updated
BEFORE UPDATE ON public.withdrawal_requests
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================================
-- customer_bookings: earnings columns
-- =========================================
ALTER TABLE public.customer_bookings
  ADD COLUMN IF NOT EXISTS commission_amount NUMERIC(12,2),
  ADD COLUMN IF NOT EXISTS driver_earnings NUMERIC(12,2),
  ADD COLUMN IF NOT EXISTS driver_id UUID REFERENCES auth.users(id);

-- =========================================
-- ensure_driver_wallet
-- =========================================
CREATE OR REPLACE FUNCTION public.ensure_driver_wallet(_driver_id UUID)
RETURNS public.driver_wallets
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  w public.driver_wallets;
BEGIN
  SELECT * INTO w FROM public.driver_wallets WHERE driver_id = _driver_id;
  IF NOT FOUND THEN
    INSERT INTO public.driver_wallets(driver_id) VALUES (_driver_id)
    RETURNING * INTO w;
  END IF;
  RETURN w;
END;
$$;
GRANT EXECUTE ON FUNCTION public.ensure_driver_wallet(UUID) TO authenticated;

-- =========================================
-- credit_ride_earnings
-- =========================================
CREATE OR REPLACE FUNCTION public.credit_ride_earnings(_booking_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  b public.customer_bookings;
  cfg public.wallet_config;
  w public.driver_wallets;
  fare NUMERIC(12,2);
  commission NUMERIC(12,2);
  earnings NUMERIC(12,2);
  bal_before NUMERIC(12,2);
  bal_mid NUMERIC(12,2);
BEGIN
  SELECT * INTO b FROM public.customer_bookings WHERE id = _booking_id FOR UPDATE;
  IF NOT FOUND THEN RETURN; END IF;
  IF b.driver_id IS NULL THEN RETURN; END IF;
  IF b.driver_earnings IS NOT NULL THEN RETURN; END IF; -- idempotent

  SELECT * INTO cfg FROM public.wallet_config WHERE id = true;
  fare := COALESCE(b.estimated_fare, 0);
  IF fare <= 0 THEN RETURN; END IF;

  commission := ROUND(fare * cfg.commission_percent / 100.0, 2);
  earnings := fare - commission;

  w := public.ensure_driver_wallet(b.driver_id);
  bal_before := w.available_balance;
  bal_mid := bal_before + fare;

  -- Ledger: credit full fare
  INSERT INTO public.wallet_transactions(driver_id, ride_id, type, amount, balance_before, balance_after, description)
  VALUES (b.driver_id, b.id, 'ride_credit', fare, bal_before, bal_mid,
          'Ride fare credit for booking ' || b.id);

  -- Ledger: commission deduction
  INSERT INTO public.wallet_transactions(driver_id, ride_id, type, amount, balance_before, balance_after, description)
  VALUES (b.driver_id, b.id, 'commission_deduction', -commission, bal_mid, bal_mid - commission,
          'Platform commission (' || cfg.commission_percent || '%)');

  UPDATE public.driver_wallets
     SET available_balance = bal_mid - commission,
         total_earnings = total_earnings + earnings,
         lifetime_earnings = lifetime_earnings + earnings
   WHERE driver_id = b.driver_id;

  UPDATE public.customer_bookings
     SET commission_amount = commission,
         driver_earnings = earnings
   WHERE id = b.id;
END;
$$;

-- =========================================
-- Trigger on ride completion
-- =========================================
CREATE OR REPLACE FUNCTION public.on_booking_completed()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.status = 'completed' AND (OLD.status IS DISTINCT FROM 'completed') THEN
    PERFORM public.credit_ride_earnings(NEW.id);
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_booking_completed ON public.customer_bookings;
CREATE TRIGGER trg_booking_completed
AFTER UPDATE ON public.customer_bookings
FOR EACH ROW EXECUTE FUNCTION public.on_booking_completed();

-- =========================================
-- apply_wallet_adjustment (admin)
-- =========================================
CREATE OR REPLACE FUNCTION public.apply_wallet_adjustment(
  _driver_id UUID,
  _type public.wallet_txn_type,
  _amount NUMERIC,
  _description TEXT,
  _ride_id UUID DEFAULT NULL
) RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  w public.driver_wallets;
  signed NUMERIC(12,2);
  bal_before NUMERIC(12,2);
  bal_after NUMERIC(12,2);
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Only admins can apply adjustments';
  END IF;
  IF _type NOT IN ('bonus','penalty','refund','adjustment') THEN
    RAISE EXCEPTION 'Invalid adjustment type';
  END IF;

  w := public.ensure_driver_wallet(_driver_id);
  bal_before := w.available_balance;

  IF _type IN ('penalty') THEN
    signed := -ABS(_amount);
  ELSE
    signed := ABS(_amount);
  END IF;

  bal_after := bal_before + signed;
  IF bal_after < 0 THEN
    RAISE EXCEPTION 'Adjustment would result in negative balance';
  END IF;

  INSERT INTO public.wallet_transactions(driver_id, ride_id, type, amount, balance_before, balance_after, description)
  VALUES (_driver_id, _ride_id, _type, signed, bal_before, bal_after, _description);

  UPDATE public.driver_wallets
     SET available_balance = bal_after,
         total_earnings = total_earnings + GREATEST(signed, 0),
         lifetime_earnings = lifetime_earnings + GREATEST(signed, 0)
   WHERE driver_id = _driver_id;
END;
$$;
GRANT EXECUTE ON FUNCTION public.apply_wallet_adjustment(UUID, public.wallet_txn_type, NUMERIC, TEXT, UUID) TO authenticated;

-- =========================================
-- request_withdrawal (driver)
-- =========================================
CREATE OR REPLACE FUNCTION public.request_withdrawal(_amount NUMERIC)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  cfg public.wallet_config;
  w public.driver_wallets;
  new_id UUID;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  IF NOT public.has_role(auth.uid(), 'driver') THEN
    RAISE EXCEPTION 'Only drivers can request withdrawals';
  END IF;

  SELECT * INTO cfg FROM public.wallet_config WHERE id = true;
  IF _amount < cfg.min_withdrawal THEN
    RAISE EXCEPTION 'Amount below minimum (%)', cfg.min_withdrawal;
  END IF;
  IF _amount > cfg.max_withdrawal THEN
    RAISE EXCEPTION 'Amount above maximum (%)', cfg.max_withdrawal;
  END IF;

  w := public.ensure_driver_wallet(auth.uid());
  IF _amount > w.available_balance THEN
    RAISE EXCEPTION 'Amount exceeds available balance';
  END IF;

  -- Reserve funds: move from available -> pending
  UPDATE public.driver_wallets
     SET available_balance = available_balance - _amount,
         pending_balance = pending_balance + _amount
   WHERE driver_id = auth.uid();

  INSERT INTO public.withdrawal_requests(driver_id, amount, status)
  VALUES (auth.uid(), _amount, 'pending')
  RETURNING id INTO new_id;

  RETURN new_id;
END;
$$;
GRANT EXECUTE ON FUNCTION public.request_withdrawal(NUMERIC) TO authenticated;

-- =========================================
-- process_withdrawal (admin)
-- =========================================
CREATE OR REPLACE FUNCTION public.process_withdrawal(
  _request_id UUID,
  _new_status public.withdrawal_status,
  _notes TEXT DEFAULT NULL
) RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  r public.withdrawal_requests;
  w public.driver_wallets;
  bal_before NUMERIC(12,2);
  bal_after NUMERIC(12,2);
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Only admins can process withdrawals';
  END IF;

  SELECT * INTO r FROM public.withdrawal_requests WHERE id = _request_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Request not found'; END IF;
  IF r.status IN ('approved','completed','rejected') THEN
    RAISE EXCEPTION 'Request already finalised';
  END IF;

  IF _new_status = 'rejected' THEN
    -- Return reserved funds
    UPDATE public.driver_wallets
       SET pending_balance = pending_balance - r.amount,
           available_balance = available_balance + r.amount
     WHERE driver_id = r.driver_id;

    UPDATE public.withdrawal_requests
       SET status = 'rejected', admin_notes = _notes,
           processed_by = auth.uid(), processed_at = now()
     WHERE id = r.id;

  ELSIF _new_status IN ('approved','completed') THEN
    SELECT * INTO w FROM public.driver_wallets WHERE driver_id = r.driver_id FOR UPDATE;
    bal_before := w.available_balance;
    bal_after := bal_before; -- available unchanged (already reserved)

    -- Ledger entry: withdrawal (negative signed amount for reporting)
    INSERT INTO public.wallet_transactions(driver_id, ride_id, type, amount, balance_before, balance_after, description)
    VALUES (r.driver_id, NULL, 'withdrawal', -r.amount, bal_before, bal_after,
            'Withdrawal ' || _new_status::text || ' (request ' || r.id || ')');

    UPDATE public.driver_wallets
       SET pending_balance = pending_balance - r.amount,
           total_withdrawn = total_withdrawn + r.amount
     WHERE driver_id = r.driver_id;

    UPDATE public.withdrawal_requests
       SET status = _new_status, admin_notes = _notes,
           processed_by = auth.uid(), processed_at = now()
     WHERE id = r.id;

  ELSIF _new_status = 'processing' THEN
    UPDATE public.withdrawal_requests
       SET status = 'processing', admin_notes = _notes
     WHERE id = r.id;
  ELSE
    RAISE EXCEPTION 'Invalid target status';
  END IF;
END;
$$;
GRANT EXECUTE ON FUNCTION public.process_withdrawal(UUID, public.withdrawal_status, TEXT) TO authenticated;
