import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FareData } from '@/services/fareData';

interface FareFormProps {
  fare?: FareData;
  onSubmit: (fare: Omit<FareData, 'id'>) => void;
  onCancel: () => void;
}

const vehicleTypes = ['Sedan', 'SUV', 'Hatchback', 'Tempo Traveller', 'Van'];

export const FareForm = ({ fare, onSubmit, onCancel }: FareFormProps) => {
  const [formData, setFormData] = useState({
    from: fare?.from || '',
    to: fare?.to || '',
    vehicleType: fare?.vehicleType || '',
    price: fare?.price || '',
  });

  useEffect(() => {
    if (fare) {
      setFormData({
        from: fare.from,
        to: fare.to,
        vehicleType: fare.vehicleType,
        price: fare.price,
      });
    }
  }, [fare]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.from && formData.to && formData.vehicleType && formData.price) {
      onSubmit(formData);
      if (!fare) {
        setFormData({ from: '', to: '', vehicleType: '', price: '' });
      }
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{fare ? 'Edit Fare' : 'Add New Fare'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="from">From</Label>
              <Input
                id="from"
                value={formData.from}
                onChange={(e) => handleInputChange('from', e.target.value)}
                placeholder="Origin city"
                required
              />
            </div>
            <div>
              <Label htmlFor="to">To</Label>
              <Input
                id="to"
                value={formData.to}
                onChange={(e) => handleInputChange('to', e.target.value)}
                placeholder="Destination"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="vehicleType">Vehicle Type</Label>
              <Select value={formData.vehicleType} onValueChange={(value) => handleInputChange('vehicleType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select vehicle type" />
                </SelectTrigger>
                <SelectContent>
                  {vehicleTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                placeholder="₹1,200"
                required
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button type="submit" className="flex-1">
              {fare ? 'Update Fare' : 'Add Fare'}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};