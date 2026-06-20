DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_enum 
        WHERE enumtypid = 'public.app_role'::regtype 
        AND enumlabel = 'driver'
    ) THEN
        ALTER TYPE public.app_role ADD VALUE 'driver';
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.driver_applications (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    license_number text NOT NULL,
    vehicle_info text,
    experience_years integer,
    status text NOT NULL DEFAULT 'pending',
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.driver_applications TO authenticated;
GRANT ALL ON public.driver_applications TO service_role;

ALTER TABLE public.driver_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own applications" ON public.driver_applications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own application" ON public.driver_applications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can manage all applications" ON public.driver_applications FOR ALL USING (public.has_role(auth.uid(), 'admin'));

ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS driver_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;

CREATE POLICY "Drivers can view assigned bookings" ON public.bookings FOR SELECT USING (driver_id = auth.uid());
CREATE POLICY "Drivers can update assigned bookings" ON public.bookings FOR UPDATE USING (driver_id = auth.uid()) WITH CHECK (driver_id = auth.uid());

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'update_driver_applications_updated_at'
    ) THEN
        CREATE TRIGGER update_driver_applications_updated_at
        BEFORE UPDATE ON public.driver_applications
        FOR EACH ROW
        EXECUTE FUNCTION public.update_updated_at_column();
    END IF;
END $$;