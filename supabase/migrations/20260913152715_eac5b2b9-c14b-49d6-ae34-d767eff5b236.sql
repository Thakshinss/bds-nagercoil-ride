GRANT INSERT ON TABLE public.bookings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.bookings TO authenticated;
GRANT ALL ON TABLE public.bookings TO service_role;