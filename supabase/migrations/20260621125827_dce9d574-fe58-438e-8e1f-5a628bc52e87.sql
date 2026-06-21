
CREATE POLICY "Drivers can view all customer bookings"
ON public.customer_bookings
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'driver'));

CREATE POLICY "Drivers can view customer profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'driver'));
