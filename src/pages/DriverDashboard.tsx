import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { MapPin, Calendar, Clock, Phone, User, Loader2, CheckCircle2 } from 'lucide-react';

interface DriverBooking {
  id: string;
  customer_name: string;
  mobile_number: string;
  pickup_location: string;
  drop_location: string;
  booking_date: string;
  booking_time: string;
  vehicle_type: string;
  trip_type: string;
  additional_message: string | null;
  status: string;
  driver_id: string | null;
  created_at: string;
}

const statusVariant = (s: string): 'default' | 'secondary' | 'destructive' => {
  if (s === 'completed') return 'default';
  if (s === 'cancelled') return 'destructive';
  return 'secondary';
};

const STATUS_OPTIONS = ['assigned', 'in_progress', 'completed', 'cancelled'];

const DriverDashboard = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [bookings, setBookings] = useState<DriverBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  const fetchBookings = async () => {
    setLoading(true);
    // RLS surfaces: own assigned trips + any unassigned (driver_id IS NULL)
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('booking_date', { ascending: true });
    if (error) {
      toast({ title: 'Could not load bookings', description: error.message, variant: 'destructive' });
    } else {
      setBookings((data as DriverBooking[]) ?? []);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!user) return;
    fetchBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const updateStatus = async (id: string, status: string) => {
    setBusyId(id);
    const { error } = await supabase.from('bookings').update({ status }).eq('id', id);
    if (error) {
      toast({ title: 'Update failed', description: error.message, variant: 'destructive' });
    } else {
      setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
      toast({ title: 'Status updated' });
    }
    setBusyId(null);
  };

  const claim = async (id: string) => {
    setBusyId(id);
    const { error } = await supabase
      .from('bookings')
      .update({ driver_id: user!.id, status: 'assigned' })
      .eq('id', id);
    if (error) {
      toast({ title: 'Could not claim trip', description: error.message, variant: 'destructive' });
    } else {
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, driver_id: user!.id, status: 'assigned' } : b)),
      );
      toast({ title: 'Trip claimed' });
    }
    setBusyId(null);
  };

  const available = bookings.filter((b) => !b.driver_id);
  const mine = bookings.filter((b) => b.driver_id === user?.id);
  const active = mine.filter((b) => !['completed', 'cancelled'].includes(b.status));
  const past = mine.filter((b) => ['completed', 'cancelled'].includes(b.status));

  return (
    <>
      <Helmet>
        <title>Driver Dashboard | BDS Cabs</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>
      <div className="container mx-auto px-4 py-10 max-w-5xl">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-blue-950">Driver Dashboard</h1>
            <p className="text-muted-foreground">Customer bookings and your assigned trips</p>
          </div>
          <Button variant="outline" onClick={() => signOut()}>Sign Out</Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : bookings.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center text-muted-foreground">
              No bookings yet. New customer bookings will appear here.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-10">
            <section>
              <h2 className="text-xl font-semibold mb-3">Available Bookings ({available.length})</h2>
              {available.length === 0 ? (
                <p className="text-muted-foreground text-sm">No unassigned bookings right now.</p>
              ) : (
                <div className="grid gap-4">
                  {available.map((b) => (
                    <BookingCard
                      key={b.id}
                      b={b}
                      busy={busyId === b.id}
                      onClaim={() => claim(b.id)}
                    />
                  ))}
                </div>
              )}
            </section>

            {active.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold mb-3">My Active Trips ({active.length})</h2>
                <div className="grid gap-4">
                  {active.map((b) => (
                    <BookingCard
                      key={b.id}
                      b={b}
                      busy={busyId === b.id}
                      onStatusChange={(s) => updateStatus(b.id, s)}
                    />
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

const BookingCard = ({
  b,
  busy,
  onStatusChange,
  onClaim,
}: {
  b: DriverBooking;
  busy?: boolean;
  onStatusChange?: (status: string) => void;
  onClaim?: () => void;
}) => (
  <Card>
    <CardHeader className="pb-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <CardTitle className="text-lg capitalize">{b.vehicle_type} · {b.trip_type.replace('_', ' ')}</CardTitle>
          <CardDescription>Booked {new Date(b.created_at).toLocaleDateString()}</CardDescription>
        </div>
        <Badge variant={statusVariant(b.status)} className="capitalize">{b.status.replace('_', ' ')}</Badge>
      </div>
    </CardHeader>
    <CardContent className="grid gap-2 text-sm">
      <div className="flex items-center gap-2"><User className="w-4 h-4 text-primary" /> {b.customer_name}</div>
      <div className="flex items-center gap-2">
        <Phone className="w-4 h-4 text-primary" />
        <a href={`tel:${b.mobile_number}`} className="text-primary underline">{b.mobile_number}</a>
      </div>
      <div className="flex items-start gap-2"><MapPin className="w-4 h-4 mt-0.5 text-primary" /> <span><b>From:</b> {b.pickup_location}</span></div>
      <div className="flex items-start gap-2"><MapPin className="w-4 h-4 mt-0.5 text-secondary" /> <span><b>To:</b> {b.drop_location}</span></div>
      <div className="flex flex-wrap gap-4 text-muted-foreground">
        <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {b.booking_date}</span>
        <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {b.booking_time}</span>
      </div>
      {b.additional_message && (
        <div className="mt-1 rounded-md bg-muted p-2 text-muted-foreground"><b>Note:</b> {b.additional_message}</div>
      )}

      {onClaim && (
        <div className="mt-3 pt-3 border-t">
          <Button size="sm" onClick={onClaim} disabled={busy}>
            {busy ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
            Claim this trip
          </Button>
        </div>
      )}

      {onStatusChange && (
        <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t">
          <span className="text-sm font-medium">Update status:</span>
          {STATUS_OPTIONS.map((s) => (
            <Button
              key={s}
              size="sm"
              variant={b.status === s ? 'default' : 'outline'}
              disabled={busy || b.status === s}
              onClick={() => onStatusChange(s)}
              className="capitalize"
            >
              {s.replace('_', ' ')}
            </Button>
          ))}
        </div>
      )}
    </CardContent>
  </Card>
);

export default DriverDashboard;
