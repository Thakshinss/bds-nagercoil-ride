REVOKE EXECUTE ON FUNCTION public.apply_wallet_adjustment(uuid, wallet_txn_type, numeric, text, uuid) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.credit_ride_earnings(uuid) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.ensure_driver_wallet(uuid) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.on_booking_completed() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.process_withdrawal(uuid, withdrawal_status, text) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.request_withdrawal(numeric) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.apply_wallet_adjustment(uuid, wallet_txn_type, numeric, text, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.process_withdrawal(uuid, withdrawal_status, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.request_withdrawal(numeric) TO authenticated;