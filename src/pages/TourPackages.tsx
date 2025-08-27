import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, Star, CheckCircle } from 'lucide-react';
import { tourPackageService, TourPackage } from '@/services/tourPackageData';

const TourPackages = () => {
  const [packages, setPackages] = useState<TourPackage[]>([]);

  useEffect(() => {
    const packageData = tourPackageService.getAllPackages();
    setPackages(packageData);
  }, []);

  return (
    <div className="min-h-screen bg-background py-12">
      <Helmet>
        <title>Tour Packages - Explore Tamilnadu | BDS Cabs & Travels</title>
        <meta name="description" content="Discover amazing tour packages with BDS Cabs. Explore Kanyakumari, Nagercoil, Western Ghats and more. Best prices, comfortable travel, and experienced guides." />
        <meta name="keywords" content="tour packages nagercoil, kanyakumari tour, tamilnadu tour packages, cab tour packages, nagercoil tourism, bds tours" />
        <meta property="og:title" content="Tour Packages - Explore Tamilnadu | BDS Cabs & Travels" />
        <meta property="og:description" content="Discover amazing tour packages with BDS Cabs. Best prices, comfortable travel, and experienced guides." />
        <link rel="canonical" href="https://bdscabs.com/tour-packages" />
      </Helmet>
      
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Tour <span className="text-primary">Packages</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover the beauty of Tamilnadu with our carefully curated tour packages. 
            From spiritual journeys to adventure tours, we have something for everyone.
          </p>
        </div>

        {/* Tour Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {packages.map((pkg) => (
            <Card key={pkg.id} className="overflow-hidden shadow-custom-lg hover:shadow-xl transition-shadow">
              {/* Package Image */}
              {pkg.image && (
                <div className="h-48 overflow-hidden">
                  <img
                    src={pkg.image}
                    alt={pkg.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}

              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <CardTitle className="text-xl font-bold">{pkg.title}</CardTitle>
                  <Badge variant="secondary" className="text-primary font-bold">
                    {pkg.price}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{pkg.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span className="truncate">{pkg.destinations.split(',')[0]}...</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-muted-foreground">{pkg.description}</p>

                {/* Destinations */}
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    Destinations
                  </h4>
                  <p className="text-sm text-muted-foreground">{pkg.destinations}</p>
                </div>

                {/* Highlights */}
                {pkg.highlights.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Star className="h-4 w-4 text-primary" />
                      Highlights
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {pkg.highlights.slice(0, 3).map((highlight, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {highlight}
                        </Badge>
                      ))}
                      {pkg.highlights.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{pkg.highlights.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {/* Inclusions */}
                {pkg.inclusions.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      Inclusions
                    </h4>
                    <div className="space-y-1">
                      {pkg.inclusions.slice(0, 2).map((inclusion, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          <span>{inclusion}</span>
                        </div>
                      ))}
                      {pkg.inclusions.length > 2 && (
                        <div className="text-xs text-muted-foreground">
                          +{pkg.inclusions.length - 2} more inclusions
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <Button className="w-full">
                  Contact us
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {packages.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-2xl font-bold text-muted-foreground mb-4">No Tour Packages Available</h3>
            <p className="text-muted-foreground">Check back soon for exciting tour packages!</p>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <h3 className="text-2xl font-bold mb-4">
                Can't Find What You're Looking For?
              </h3>
              <p className="text-muted-foreground mb-6">
                We can customize tour packages according to your preferences and budget. 
                Contact us for personalized tour planning.
              </p>
              <Button size="lg">
                Contact Us for Custom Tours
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TourPackages;