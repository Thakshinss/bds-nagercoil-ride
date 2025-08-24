import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Star, Clock, Shield, Phone } from 'lucide-react';
import heroBackground from '@/assets/hero-taxi-background.jpg';
import BookingForm from '@/components/BookingForm';

const Homepage = () => {
  const fleet = [
    {
      name: 'Sedan',
      price: '₹12/km',
      image: '/placeholder.svg',
      features: ['AC', '4 Seater', 'Comfortable']
    },
    {
      name: 'SUV',
      price: '₹18/km',
      image: '/placeholder.svg',
      features: ['AC', '7 Seater', 'Spacious']
    },
    {
      name: 'Hatchback',
      price: '₹10/km',
      image: '/placeholder.svg',
      features: ['AC', '4 Seater', 'Economic']
    }
  ];

  const features = [
    {
      icon: Clock,
      title: '24/7 Service',
      description: 'Round-the-clock taxi service'
    },
    {
      icon: Shield,
      title: 'Safe & Secure',
      description: 'Professional verified drivers'
    },
    {
      icon: Star,
      title: 'Best Rates',
      description: 'Affordable pricing in Nagercoil'
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section 
        className="relative min-h-[80vh] flex items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage: `url(${heroBackground})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-overlay"></div>
        <div className="relative z-10 px-4 max-w-7xl mx-auto">
          <div className="text-center text-white mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              BDS Cabs - Best Cab Service in 
              <span className="text-secondary"> Nagercoil</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200">
              Safe, Reliable & Affordable Taxi Service Available 24/7
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button 
                variant="outline" 
                size="lg" 
                className="text-white border-white hover:bg-white hover:text-primary text-lg px-8 py-6"
              >
                <Phone className="mr-2 w-5 h-5" />
                Call +91 98765 43210
              </Button>
            </div>
          </div>
          
          {/* Booking Form */}
          <BookingForm />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fleet Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our Fleet
            </h2>
            <p className="text-xl text-muted-foreground">
              Choose from our wide range of well-maintained vehicles
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {fleet.map((car, index) => (
              <Card key={index} className="hover-lift shadow-custom-md hover:shadow-custom-xl">
                <CardContent className="p-6">
                  <div className="aspect-video bg-muted rounded-lg mb-4 flex items-center justify-center">
                    <span className="text-muted-foreground">Car Image</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{car.name}</h3>
                  <p className="text-2xl font-bold text-primary mb-4">{car.price}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {car.features.map((feature, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                  <Button className="w-full bg-gradient-primary hover:bg-primary-dark">
                    Book This Car
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-hero text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Book Your Ride Today with BDS Cabs
          </h2>
          <p className="text-xl mb-8 text-gray-200">
            Experience the best cab service in Nagercoil with professional drivers and clean vehicles
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-secondary hover:bg-secondary-dark text-lg px-8 py-6 hover-glow"
            >
              Book Online
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-white border-white hover:bg-white hover:text-primary text-lg px-8 py-6"
            >
              WhatsApp Booking
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Homepage;