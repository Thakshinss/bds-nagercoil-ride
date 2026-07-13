ALTER TABLE public.customer_bookings REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.customer_bookings;