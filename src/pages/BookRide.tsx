import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { VEHICLE_RATES, VehicleType, estimateFare } from '@/lib/fareCalculator';

const schema = z.object({
  pickup_location: z.string().trim().min(3).max(200),
  drop_location: z.string().trim().min(3).max(200),
  distance_km: z.number().positive().max(2000),
  vehicle_type: z.enum(['auto', 'sedan', 'suv', 'premium']),
  trip_type: z.enum(['one_way', 'round_trip']),
  booking_date: z.string().min(1),
  booking_time: z.string().min(1),
  notes: z.string().max(500).optional(),
});

const BookRide = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [busy, setBusy] = useState(false);

  const [pickup, setPickup] = useState('');
  const [drop, setDrop] = useState('');
  const [distance, setDistance] = useState<string>('');
  const [vehicle, setVehicle] = useState<VehicleType>('sedan');
  const [tripType, setTripType] = useState<'one_way' | 'round_trip'>('one_way');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (!loading && !user) navigate('/auth', { replace: true });
  }, [user, loading, navigate]);

  const distanceNum = parseFloat(distance) || 0;
  const fare = useMemo(() => {
    const oneWay = estimateFare(vehicle, distanceNum);
    return tripType === 'round_trip' ? oneWay * 2 : oneWay;
  }, [vehicle, distanceNum, tripType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const parsed = schema.safeParse({
      pickup_location: pickup,
      drop_location: drop,
      distance_km: distanceNum,
      vehicle_type: vehicle,
      trip_type: tripType,
      booking_date: date,
      booking_time: time,
      notes: notes || undefined,
    });
    if (!parsed.success) {
      toast({ title: 'Check the form', description: parsed.error.issues[0].message, variant: 'destructive' });
      return;
    }
    setBusy(true);
    const { error } = await supabase.from('customer_bookings').insert({
      user_id: user.id,
      ...parsed.data,
      estimated_fare: fare,
      status: 'searching',
    });
    setBusy(false);
    if (error) {
      toast({ title: 'Booking failed', description: error.message, variant: 'destructive' });
      return;
    }
    toast({ title: 'Booking placed', description: 'We will contact you shortly.' });
    navigate('/my-rides');
  };

  return (
    <>
      <Helmet>
        <title>Book a Ride | BDS Cabs</title>
        <meta name="description" content="Book a cab in Nagercoil with BDS Cabs. Choose your vehicle and get an instant fare estimate." />
        <meta name="robots" content="noindex,nofollow" />
        <link rel="canonical" href="/book" />
      </Helmet>
      <div className="container mx-auto px-4 py-10 max-w-3xl">
        <h1 className="text-3xl font-bold mb-2 text-blue-950">Book a Ride</h1>
        <p className="text-muted-foreground mb-6">Fill in your trip details and get an instant fare estimate.</p>

        <form onSubmit={handleSubmit} className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Trip Details</CardTitle>
              <CardDescription>Enter pickup, drop, and approximate distance.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div>
                <Label htmlFor="pickup">Pickup Location</Label>
                <Input id="pickup" value={pickup} onChange={(e) => setPickup(e.target.value)} placeholder="e.g. Nagercoil Bus Stand" required />
              </div>
              <div>
                <Label htmlFor="drop">Drop Location</Label>
                <Input id="drop" value={drop} onChange={(e) => setDrop(e.target.value)} placeholder="e.g. Trivandrum Airport" required />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="distance">Approx. distance (km)</Label>
                  <Input id="distance" type="number" min="1" step="0.1" value={distance} onChange={(e) => setDistance(e.target.value)} required />
                </div>
                <div>
                  <Label>Trip Type</Label>
                  <Select value={tripType} onValueChange={(v) => setTripType(v as 'one_way' | 'round_trip')}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="one_way">One Way</SelectItem>
                      <SelectItem value="round_trip">Round Trip</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">Pickup date</Label>
                  <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                </div>
                <div>
                  <Label htmlFor="time">Pickup time</Label>
                  <Input id="time" type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
                </div>
              </div>
              <div>
                <Label htmlFor="notes">Notes (optional)</Label>
                <Textarea id="notes" maxLength={500} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any special instructions" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Choose Vehicle</CardTitle>
              <CardDescription>Fare updates instantly as you change vehicle or distance.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(Object.keys(VEHICLE_RATES) as VehicleType[]).map((key) => {
                const cfg = VEHICLE_RATES[key];
                const v = estimateFare(key, distanceNum) * (tripType === 'round_trip' ? 2 : 1);
                const active = vehicle === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setVehicle(key)}
                    className={`text-left p-4 rounded-lg border-2 transition-smooth ${
                      active ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="font-semibold">{cfg.label}</div>
                    <div className="text-sm text-muted-foreground">₹{cfg.base} base + ₹{cfg.perKm}/km</div>
                    <div className="text-lg font-bold text-primary mt-1">₹{v || '—'}</div>
                  </button>
                );
              })}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6">
              <div>
                <div className="text-sm text-muted-foreground">Estimated fare</div>
                <div className="text-3xl font-bold text-primary">₹{fare || '—'}</div>
                <div className="text-xs text-muted-foreground">Final fare may vary based on actual route &amp; tolls.</div>
              </div>
              <Button type="submit" size="lg" disabled={busy || !fare} className="bg-gradient-secondary">
                {busy ? 'Booking…' : 'Confirm Booking'}
              </Button>
            </CardContent>
          </Card>
        </form>
      </div>
    </>
  );
};

export default BookRide;
