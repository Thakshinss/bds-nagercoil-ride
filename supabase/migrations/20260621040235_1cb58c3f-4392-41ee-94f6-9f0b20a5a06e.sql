CREATE POLICY "Drivers can view available bookings"
  ON public.bookings FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'driver') AND driver_id IS NULL);

CREATE POLICY "Drivers can claim unassigned bookings"
  ON public.bookings FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'driver') AND driver_id IS NULL)
  WITH CHECK (driver_id = auth.uid());