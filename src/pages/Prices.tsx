import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const Prices = () => {
  const priceData = [
    { from: 'Nagercoil', to: 'Trivandrum Airport', vehicleType: 'Sedan', price: '₹1,200' },
    { from: 'Nagercoil', to: 'Trivandrum Airport', vehicleType: 'SUV', price: '₹1,500' },
    { from: 'Nagercoil', to: 'Trivandrum Airport', vehicleType: 'Hatchback', price: '₹1,000' },
    { from: 'Nagercoil', to: 'Kanyakumari', vehicleType: 'Sedan', price: '₹800' },
    { from: 'Nagercoil', to: 'Kanyakumari', vehicleType: 'SUV', price: '₹1,000' },
    { from: 'Nagercoil', to: 'Kanyakumari', vehicleType: 'Hatchback', price: '₹600' },
    { from: 'Nagercoil', to: 'Tirunelveli', vehicleType: 'Sedan', price: '₹1,500' },
    { from: 'Nagercoil', to: 'Tirunelveli', vehicleType: 'SUV', price: '₹1,800' },
    { from: 'Nagercoil', to: 'Tirunelveli', vehicleType: 'Hatchback', price: '₹1,200' },
    { from: 'Nagercoil', to: 'Madurai', vehicleType: 'Sedan', price: '₹3,500' },
    { from: 'Nagercoil', to: 'Madurai', vehicleType: 'SUV', price: '₹4,000' },
    { from: 'Nagercoil', to: 'Madurai', vehicleType: 'Hatchback', price: '₹3,000' },
    { from: 'Nagercoil', to: 'Chennai', vehicleType: 'Sedan', price: '₹8,000' },
    { from: 'Nagercoil', to: 'Chennai', vehicleType: 'SUV', price: '₹9,500' },
    { from: 'Nagercoil', to: 'Chennai', vehicleType: 'Hatchback', price: '₹7,000' },
  ];

  return (
    <div className="min-h-screen bg-background py-12">
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
                  {priceData.map((item, index) => (
                    <TableRow key={index} className="hover:bg-muted/50">
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