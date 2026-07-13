import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Plus, LogOut, MapPin, Calendar, Clock } from 'lucide-react';

interface Booking {
  id: string;
  pickup_location: string;
  drop_location: string;
  vehicle_type: string;
  trip_type: string;
  estimated_fare: number | null;
  distance_km: number | null;
  booking_date: string;
  booking_time: string;
  status: string;
  created_at: string;
}

const statusVariant = (s: string) => {
  if (s === 'completed') return 'default';
  if (s === 'cancelled') return 'destructive';
  return 'secondary';
};

const MyRides = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !user) navigate('/auth', { replace: true });
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from('customer_bookings')
        .select('*')
        .order('created_at', { ascending: false });
      if (cancelled) return;
      if (error) toast({ title: 'Could not load rides', description: error.message, variant: 'destructive' });
      setBookings((data as Booking[]) ?? []);
      setFetching(false);
    })();

    const channel = supabase
      .channel(`customer_bookings_${user.id}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'customer_bookings', filter: `user_id=eq.${user.id}` },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setBookings((prev) => [payload.new as Booking, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            const updated = payload.new as Booking;
            setBookings((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
            toast({ title: 'Ride updated', description: `Status: ${updated.status.replace('_', ' ')}` });
          } else if (payload.eventType === 'DELETE') {
            const old = payload.old as Booking;
            setBookings((prev) => prev.filter((b) => b.id !== old.id));
          }
        }
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [user, toast]);


  const cancelBooking = async (id: string) => {
    const { error } = await supabase.from('customer_bookings').update({ status: 'cancelled' }).eq('id', id);
    if (error) {
      toast({ title: 'Cancel failed', description: error.message, variant: 'destructive' });
      return;
    }
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status: 'cancelled' } : b)));
    toast({ title: 'Booking cancelled' });
  };

  const active = bookings.filter((b) => !['completed', 'cancelled'].includes(b.status));
  const past = bookings.filter((b) => ['completed', 'cancelled'].includes(b.status));

  return (
    <>
      <Helmet>
        <title>My Rides | BDS Cabs</title>
        <meta name="description" content="Manage your active and past cab bookings with BDS Cabs." />
        <meta name="robots" content="noindex,nofollow" />
        <link rel="canonical" href="/my-rides" />
      </Helmet>
      <div className="container mx-auto px-4 py-10 max-w-5xl">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-blue-950">My Rides</h1>
            <p className="text-muted-foreground">Welcome back, {user?.email}</p>
          </div>
          <div className="flex gap-2">
            <Link to="/book"><Button className="bg-gradient-secondary"><Plus className="w-4 h-4 mr-1" /> Book Ride</Button></Link>
            <Button variant="outline" onClick={() => signOut().then(() => navigate('/'))}>
              <LogOut className="w-4 h-4 mr-1" /> Sign Out
            </Button>
          </div>
        </div>

        {fetching ? (
          <p className="text-muted-foreground">Loading…</p>
        ) : bookings.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center">
              <p className="text-muted-foreground mb-4">You haven't booked a ride yet.</p>
              <Link to="/book"><Button>Book your first ride</Button></Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-8">
            {active.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold mb-3">Active</h2>
                <div className="grid gap-4">
                  {active.map((b) => (
                    <BookingCard key={b.id} b={b} onCancel={() => cancelBooking(b.id)} />
                  ))}
                </div>
              </section>
            )}
            {past.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold mb-3">History</h2>
                <div className="grid gap-4">
                  {past.map((b) => <BookingCard key={b.id} b={b} />)}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </>
  );
};

const BookingCard = ({ b, onCancel }: { b: Booking; onCancel?: () => void }) => (
  <Card>
    <CardHeader className="pb-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <CardTitle className="text-lg capitalize">{b.vehicle_type} · {b.trip_type.replace('_', ' ')}</CardTitle>
          <CardDescription>Booked on {new Date(b.created_at).toLocaleDateString()}</CardDescription>
        </div>
        <Badge variant={statusVariant(b.status)} className="capitalize">{b.status.replace('_', ' ')}</Badge>
      </div>
    </CardHeader>
    <CardContent className="grid gap-2 text-sm">
      <div className="flex items-start gap-2"><MapPin className="w-4 h-4 mt-0.5 text-primary" /> <span><b>From:</b> {b.pickup_location}</span></div>
      <div className="flex items-start gap-2"><MapPin className="w-4 h-4 mt-0.5 text-secondary" /> <span><b>To:</b> {b.drop_location}</span></div>
      <div className="flex flex-wrap gap-4 mt-1 text-muted-foreground">
        <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {b.booking_date}</span>
        <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {b.booking_time}</span>
        {b.distance_km && <span>{b.distance_km} km</span>}
      </div>
      <div className="flex items-center justify-between mt-3 pt-3 border-t">
        <div className="text-lg font-bold text-primary">₹{b.estimated_fare ?? '—'}</div>
        {onCancel && b.status !== 'cancelled' && (
          <Button variant="outline" size="sm" onClick={onCancel}>Cancel</Button>
        )}
      </div>
    </CardContent>
  </Card>
);

export default MyRides;
