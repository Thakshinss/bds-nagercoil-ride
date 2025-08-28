-- Create fares table
CREATE TABLE public.fares (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  from_location TEXT NOT NULL,
  to_location TEXT NOT NULL,
  vehicle_type TEXT NOT NULL,
  price TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create tour packages table
CREATE TABLE public.tour_packages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price TEXT NOT NULL,
  image TEXT,
  highlights TEXT[] DEFAULT '{}',
  inclusions TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security (allowing public access for this taxi service)
ALTER TABLE public.fares ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tour_packages ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access and admin write access
CREATE POLICY "Public can view fares" 
ON public.fares 
FOR SELECT 
USING (true);

CREATE POLICY "Public can view tour packages" 
ON public.tour_packages 
FOR SELECT 
USING (true);

-- For now, allow all operations (you can restrict later with authentication)
CREATE POLICY "Allow all operations on fares" 
ON public.fares 
FOR ALL
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow all operations on tour packages" 
ON public.tour_packages 
FOR ALL
USING (true)
WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_fares_updated_at
  BEFORE UPDATE ON public.fares
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tour_packages_updated_at
  BEFORE UPDATE ON public.tour_packages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default fare data
INSERT INTO public.fares (from_location, to_location, vehicle_type, price) VALUES
('Nagercoil', 'Trivandrum Airport', 'Sedan', '₹1,200'),
('Nagercoil', 'Trivandrum Airport', 'SUV', '₹1,500'),
('Nagercoil', 'Trivandrum Airport', 'Hatchback', '₹1,000'),
('Nagercoil', 'Kanyakumari', 'Sedan', '₹800'),
('Nagercoil', 'Kanyakumari', 'SUV', '₹1,000'),
('Nagercoil', 'Kanyakumari', 'Hatchback', '₹600'),
('Nagercoil', 'Tirunelveli', 'Sedan', '₹1,500'),
('Nagercoil', 'Tirunelveli', 'SUV', '₹1,800'),
('Nagercoil', 'Tirunelveli', 'Hatchback', '₹1,200'),
('Nagercoil', 'Madurai', 'Sedan', '₹3,500'),
('Nagercoil', 'Madurai', 'SUV', '₹4,000'),
('Nagercoil', 'Madurai', 'Hatchback', '₹3,000'),
('Nagercoil', 'Chennai', 'Sedan', '₹8,000'),
('Nagercoil', 'Chennai', 'SUV', '₹9,500'),
('Nagercoil', 'Chennai', 'Hatchback', '₹7,000');

-- Insert default tour package data
INSERT INTO public.tour_packages (title, description, price, image, highlights, inclusions) VALUES
('Kanyakumari Day Tour', 'Experience the southernmost tip of India with breathtaking views and cultural heritage.', '₹2,500', '/placeholder.svg', 
 ARRAY['Sunrise/Sunset views', 'Vivekananda Rock Memorial', 'Thiruvalluvar Statue', 'Kanyakumari Temple'], 
 ARRAY['Transportation', 'Guide service', 'Entry tickets', 'Refreshments']),
 
('Temple Circuit Tour', 'Visit the most sacred temples around Nagercoil and experience divine spirituality.', '₹3,000', '/placeholder.svg',
 ARRAY['Nagaraja Temple', 'Suchindram Temple', 'Thanumalayan Temple', 'Traditional architecture'],
 ARRAY['AC Vehicle', 'Professional guide', 'Temple entry fees', 'Lunch']),
 
('Hill Station Package', 'Explore the scenic beauty of nearby hill stations and enjoy cool climate.', '₹4,500', '/placeholder.svg',
 ARRAY['Courtallam Falls', 'Tea gardens', 'Mountain views', 'Cool climate'],
 ARRAY['2-way transportation', 'Accommodation', 'All meals', 'Sightseeing']);