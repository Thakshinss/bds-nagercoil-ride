REVOKE EXECUTE ON FUNCTION public.apply_wallet_adjustment(uuid, wallet_txn_type, numeric, text, uuid) FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.credit_ride_earnings(uuid) FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.ensure_driver_wallet(uuid) FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.on_booking_completed() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.process_withdrawal(uuid, withdrawal_status, text) FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.request_withdrawal(numeric) FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated;