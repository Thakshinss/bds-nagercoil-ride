import { Card, CardContent } from '@/components/ui/card';
import { Users, MapPin, Clock, Award } from 'lucide-react';

const About = () => {
  const stats = [
    { icon: Users, label: 'Happy Customers', value: '5000+' },
    { icon: MapPin, label: 'Cities Covered', value: '10+' },
    { icon: Clock, label: 'Years Experience', value: '8+' },
    { icon: Award, label: 'Professional Drivers', value: '50+' }
  ];

  const timeline = [
    {
      year: '2016',
      title: 'BDS Cabs Founded',
      description: 'Started with a vision to provide reliable taxi service in Nagercoil'
    },
    {
      year: '2018',
      title: 'Fleet Expansion',
      description: 'Expanded our fleet to 25+ vehicles serving more customers'
    },
    {
      year: '2020',
      title: '24/7 Service Launch',
      description: 'Introduced round-the-clock taxi service for customer convenience'
    },
    {
      year: '2023',
      title: 'Technology Integration',
      description: 'Launched online booking system and mobile app for easy access'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-hero text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              About BDS Cabs
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 leading-relaxed">
              Your trusted partner for safe, reliable, and affordable cab service in Nagercoil. 
              We've been serving the community with dedication and professionalism since 2016.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-2xl font-bold text-primary mb-2">{stat.value}</h3>
                <p className="text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">
                Best Cab Service in Nagercoil
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  BDS Cabs has been the premier choice for taxi service in Nagercoil for over 8 years. 
                  We pride ourselves on providing safe, reliable, and affordable transportation solutions 
                  for residents and visitors alike.
                </p>
                <p>
                  Our fleet of well-maintained vehicles and team of professional, verified drivers ensure 
                  that every journey is comfortable and secure. Whether you need a ride to the airport, 
                  local transportation, or outstation travel, BDS Cabs is your trusted partner.
                </p>
                <p>
                  With our 24/7 service availability and competitive pricing, we've become the go-to 
                  cab service in Nagercoil. Customer satisfaction is our top priority, and we continuously 
                  strive to exceed expectations.
                </p>
              </div>
            </div>
            <div className="space-y-6">
              <Card className="shadow-custom-md">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-3">Our Mission</h3>
                  <p className="text-muted-foreground">
                    To provide safe, reliable, and affordable taxi service in Nagercoil while 
                    maintaining the highest standards of customer satisfaction and professionalism.
                  </p>
                </CardContent>
              </Card>
              <Card className="shadow-custom-md">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-3">Our Vision</h3>
                  <p className="text-muted-foreground">
                    To be the leading cab service provider in Tamil Nadu, known for excellence 
                    in transportation services and customer care.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our Journey
            </h2>
            <p className="text-xl text-muted-foreground">
              Milestones in our journey to become Nagercoil's best cab service
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-primary"></div>
              
              {timeline.map((item, index) => (
                <div key={index} className={`relative flex items-center ${index % 2 === 0 ? 'justify-start' : 'justify-end'} mb-12`}>
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <Card className="shadow-custom-md hover-lift">
                      <CardContent className="p-6">
                        <div className="text-primary font-bold text-lg mb-2">{item.year}</div>
                        <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                        <p className="text-muted-foreground">{item.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {/* Timeline dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-primary rounded-full border-4 border-background"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;