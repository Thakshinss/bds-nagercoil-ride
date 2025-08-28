import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Helmet } from 'react-helmet-async';
import { fareDataService, FareData } from '@/services/fareData';

const Prices = () => {
  const [priceData, setPriceData] = useState<FareData[]>([]);

  useEffect(() => {
    const loadFares = async () => {
      const fares = await fareDataService.getAllFares();
      setPriceData(fares);
    };
    loadFares();
  }, []);

  return (
    <div className="min-h-screen bg-background py-12">
      <Helmet>
        <title>Taxi Fare & Pricing - Affordable Rates | BDS Cabs Nagercoil</title>
        <meta name="description" content="Check transparent taxi fares and pricing for BDS Cabs in Nagercoil. No hidden charges, best rates, 24/7 service. Book your affordable cab ride today!" />
        <meta name="keywords" content="taxi fare nagercoil, cab pricing, bds cabs rates, affordable taxi, cheap cab fare, taxi cost nagercoil, transparent pricing" />
        <meta property="og:title" content="Taxi Fare & Pricing - Affordable Rates | BDS Cabs" />
        <meta property="og:description" content="Transparent taxi pricing in Nagercoil. No hidden charges, competitive rates for all destinations." />
        <link rel="canonical" href="https://bdscabs.com/prices" />
      </Helmet>
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Cab Pricing in <span className="text-primary">Nagercoil</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Transparent pricing for all your travel needs. Best rates guaranteed with BDS Cabs.
          </p>
        </div>

        {/* Pricing Table */}
        <Card className="shadow-custom-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Fare Chart</CardTitle>
            <CardDescription className="text-center">
              All prices are approximate and may vary based on traffic, time, and special requirements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-semibold">From</TableHead>
                    <TableHead className="font-semibold">To</TableHead>
                    <TableHead className="font-semibold">Vehicle Type</TableHead>
                    <TableHead className="font-semibold text-right">Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {priceData.map((item) => (
                    <TableRow key={item.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{item.from}</TableCell>
                      <TableCell>{item.to}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                          {item.vehicleType}
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-semibold text-primary">
                        {item.price}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-lg">24/7 Service</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Available round the clock for all your travel needs</p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-lg">No Hidden Charges</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Transparent pricing with no surprise fees</p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-lg">Best Rates</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Competitive pricing for quality service</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Prices;