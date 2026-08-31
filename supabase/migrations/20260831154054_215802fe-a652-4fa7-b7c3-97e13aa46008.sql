CREATE TABLE public.banner_images (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url text NOT NULL,
  alt_text text NOT NULL DEFAULT 'BDS Cabs banner',
  link_url text,
  is_active boolean NOT NULL DEFAULT true,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT ON public.banner_images TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.banner_images TO authenticated;
GRANT ALL ON public.banner_images TO service_role;

ALTER TABLE public.banner_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active banner images"
  ON public.banner_images
  FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Admins manage banner images"
  ON public.banner_images
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_banner_images_updated_at
  BEFORE UPDATE ON public.banner_images
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();