import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Fuel, Wind, Star } from 'lucide-react';

const Cars = () => {
  const vehicles = [
    {
      category: 'Economy',
      cars: [
        {
          name: 'Maruti Swift',
          type: 'Hatchback',
          price: '₹10/km',
          features: ['AC', '4 Seater', 'Petrol', 'Manual'],
          rating: 4.5,
          description: 'Perfect for city rides and short trips'
        },
        {
          name: 'Hyundai i20',
          type: 'Hatchback',
          price: '₹12/km',
          features: ['AC', '4 Seater', 'Petrol', 'Manual'],
          rating: 4.6,
          description: 'Comfortable and fuel-efficient'
        }
      ]
    },
    {
      category: 'Sedan',
      cars: [
        {
          name: 'Honda City',
          type: 'Sedan',
          price: '₹14/km',
          features: ['AC', '4 Seater', 'Petrol', 'Automatic'],
          rating: 4.7,
          description: 'Premium comfort for business travel'
        },
        {
          name: 'Maruti Dzire',
          type: 'Sedan',
          price: '₹12/km',
          features: ['AC', '4 Seater', 'Petrol', 'Manual'],
          rating: 4.5,
          description: 'Reliable and spacious sedan'
        }
      ]
    },
    {
      category: 'SUV',
      cars: [
        {
          name: 'Toyota Innova',
          type: 'SUV',
          price: '₹18/km',
          features: ['AC', '7 Seater', 'Diesel', 'Manual'],
          rating: 4.8,
          description: 'Perfect for family trips and group travel'
        },
        {
          name: 'Mahindra Scorpio',
          type: 'SUV',
          price: '₹16/km',
          features: ['AC', '7 Seater', 'Diesel', 'Manual'],
          rating: 4.6,
          description: 'Rugged and reliable for all terrains'
        }
      ]
    }
  ];

  const specialServices = [
    {
      title: 'Airport Transfer',
      description: 'Reliable pickup and drop service to/from airports',
      price: 'Fixed rates available',
      features: ['Flight tracking', 'Meet & greet', 'Luggage assistance']
    },
    {
      title: 'Outstation Travel',
      description: 'Comfortable long-distance travel with experienced drivers',
      price: '₹12-18/km + driver allowance',
      features: ['Overnight packages', 'Multiple destinations', 'Tourist guides']
    },
    {
      title: 'Corporate Service',
      description: 'Professional transportation for business needs',
      price: 'Monthly packages available',
      features: ['Priority booking', 'Invoicing', 'Dedicated support']
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-hero text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Our Fleet
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 leading-relaxed">
              Choose from our wide range of well-maintained vehicles. 
              All cars are regularly serviced and driven by professional drivers.
            </p>
          </div>
        </div>
      </section>

      {/* Vehicle Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {vehicles.map((category, categoryIndex) => (
            <div key={categoryIndex} className="mb-16">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  {category.category} Cars
                </h2>
                <div className="w-24 h-1 bg-gradient-primary mx-auto rounded-full"></div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                {category.cars.map((car, carIndex) => (
                  <Card key={carIndex} className="hover-lift shadow-custom-md hover:shadow-custom-xl">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl mb-2">{car.name}</CardTitle>
                          <Badge variant="secondary">{car.type}</Badge>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-primary">{car.price}</div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                            {car.rating}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="aspect-video bg-muted rounded-lg mb-4 flex items-center justify-center">
                        <span className="text-muted-foreground">{car.name} Image</span>
                      </div>
                      
                      <p className="text-muted-foreground mb-4">{car.description}</p>
                      
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        {car.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-center text-sm">
                            {feature.includes('Seater') && <Users className="w-4 h-4 mr-2 text-primary" />}
                            {(feature === 'Petrol' || feature === 'Diesel') && <Fuel className="w-4 h-4 mr-2 text-primary" />}
                            {feature === 'AC' && <Wind className="w-4 h-4 mr-2 text-primary" />}
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex gap-3">
                        <Button className="flex-1 bg-gradient-primary hover:bg-primary-dark">
                          Book Now
                        </Button>
                        <Button variant="outline" className="flex-1">
                          Get Quote
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Special Services */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Special Services
            </h2>
            <p className="text-xl text-muted-foreground">
              Customized transportation solutions for your specific needs
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {specialServices.map((service, index) => (
              <Card key={index} className="hover-lift shadow-custom-md">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                  <p className="text-muted-foreground mb-4">{service.description}</p>
                  <div className="text-lg font-bold text-primary mb-4">{service.price}</div>
                  
                  <div className="space-y-2 mb-6">
                    {service.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center text-sm">
                        <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                        {feature}
                      </div>
                    ))}
                  </div>
                  
                  <Button className="w-full bg-gradient-secondary hover:bg-secondary-dark">
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Booking CTA */}
      <section className="py-16 bg-gradient-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Book Your Ride?</h2>
          <p className="text-xl mb-8 opacity-90">
            Choose your preferred vehicle and enjoy a comfortable journey with BDS Cabs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="secondary"
              className="bg-secondary hover:bg-secondary-dark text-lg px-8 py-6"
            >
              Book Online
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-primary text-lg px-8 py-6"
            >
              Call +91 98765 43210
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Cars;