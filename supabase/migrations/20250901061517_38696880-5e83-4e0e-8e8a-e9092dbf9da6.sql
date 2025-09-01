-- Create banner_content table
CREATE TABLE public.banner_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  text TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.banner_content ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Public can view active banner content" 
ON public.banner_content 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Allow all operations on banner content" 
ON public.banner_content 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_banner_content_updated_at
BEFORE UPDATE ON public.banner_content
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default banner content
INSERT INTO public.banner_content (text, display_order) VALUES
('Flat 20% Off on Airport Rides', 1),
('Best Cab Service in Nagercoil – Book Now', 2),
('24/7 Taxi Service Available – BDS Cabs', 3),
('Safe & Reliable Transportation', 4),
('Professional Drivers, Clean Vehicles', 5);