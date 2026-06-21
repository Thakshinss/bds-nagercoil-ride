import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Calendar, Clock, Phone, User, Loader2, IndianRupee, Route } from "lucide-react";

interface CustomerBooking {
  id: string;
  user_id: string;
  pickup_location: string;
  drop_location: string;
  booking_date: string;
  booking_time: string;
  vehicle_type: string;
  trip_type: string;
  distance_km: number | null;
  estimated_fare: number | null;
  notes: string | null;
  status: string;
  created_at: string;
  customer_name?: string | null;
  customer_phone?: string | null;
  customer_email?: string | null;
}

const STATUS_OPTIONS = ["pending", "confirmed", "in_progress", "completed", "cancelled"];

const statusVariant = (s: string): "default" | "secondary" | "destructive" => {
  if (s === "completed") return "default";
  if (s === "cancelled") return "destructive";
  return "secondary";
};

const DriverDashboard = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [bookings, setBookings] = useState<CustomerBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchBookings = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("customer_bookings")
      .select("*")
      .order("booking_date", { ascending: false });

    if (error) {
      toast({ title: "Could not load bookings", description: error.message, variant: "destructive" });
      setLoading(false);
      return;
    }

    const rows = (data ?? []) as CustomerBooking[];
    const userIds = Array.from(new Set(rows.map((r) => r.user_id)));
    let profileMap: Record<string, { full_name: string | null; phone: string | null; email: string | null }> = {};

    if (userIds.length) {
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name, phone, email")
        .in("id", userIds);
      profileMap = Object.fromEntries(
        (profiles ?? []).map((p) => [p.id, { full_name: p.full_name, phone: p.phone, email: p.email }])
      );
    }

    setBookings(
      rows.map((r) => ({
        ...r,
        customer_name: profileMap[r.user_id]?.full_name ?? null,
        customer_phone: profileMap[r.user_id]?.phone ?? null,
        customer_email: profileMap[r.user_id]?.email ?? null,
      }))
    );
    setLoading(false);
  };

  useEffect(() => {
    if (!user) return;
    fetchBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const updateStatus = async (id: string, status: string) => {
    setUpdatingId(id);
    const { error } = await supabase.from("customer_bookings").update({ status }).eq("id", id);
    if (error) {
      toast({ title: "Update failed", description: error.message, variant: "destructive" });
    } else {
      setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
      toast({ title: "Status updated" });
    }
    setUpdatingId(null);
  };

  const active = bookings.filter((b) => !["completed", "cancelled"].includes(b.status));
  const past = bookings.filter((b) => ["completed", "cancelled"].includes(b.status));

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
            <p className="text-muted-foreground">All customer ride requests</p>
          </div>
          <Button variant="outline" onClick={() => signOut()}>
            Sign Out
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : bookings.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center text-muted-foreground">
              No customer bookings yet.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-8">
            {active.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold mb-3">Active Requests ({active.length})</h2>
                <div className="grid gap-4">
                  {active.map((b) => (
                    <BookingCard
                      key={b.id}
                      b={b}
                      updating={updatingId === b.id}
                      onStatusChange={(s) => updateStatus(b.id, s)}
                    />
                  ))}
                </div>
              </section>
            )}
            {past.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold mb-3">History ({past.length})</h2>
                <div className="grid gap-4">
                  {past.map((b) => (
                    <BookingCard key={b.id} b={b} />
                  ))}
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
  updating,
  onStatusChange,
}: {
  b: CustomerBooking;
  updating?: boolean;
  onStatusChange?: (status: string) => void;
}) => (
  <Card>
    <CardHeader className="pb-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <CardTitle className="text-lg capitalize">
            {b.vehicle_type} · {b.trip_type.replace("_", " ")}
          </CardTitle>
          <CardDescription>Booked {new Date(b.created_at).toLocaleString()}</CardDescription>
        </div>
        <Badge variant={statusVariant(b.status)} className="capitalize">
          {b.status.replace("_", " ")}
        </Badge>
      </div>
    </CardHeader>
    <CardContent className="grid gap-2 text-sm">
      <div className="flex items-center gap-2">
        <User className="w-4 h-4 text-primary" /> {b.customer_name ?? "Customer"}
      </div>
      {b.customer_phone && (
        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4 text-primary" />
          <a href={`tel:${b.customer_phone}`} className="text-primary underline">
            {b.customer_phone}
          </a>
        </div>
      )}
      <div className="flex items-start gap-2">
        <MapPin className="w-4 h-4 mt-0.5 text-primary" />
        <span><b>From:</b> {b.pickup_location}</span>
      </div>
      <div className="flex items-start gap-2">
        <MapPin className="w-4 h-4 mt-0.5 text-secondary" />
        <span><b>To:</b> {b.drop_location}</span>
      </div>
      <div className="flex flex-wrap gap-4 text-muted-foreground">
        <span className="flex items-center gap-1">
          <Calendar className="w-4 h-4" /> {b.booking_date}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="w-4 h-4" /> {b.booking_time}
        </span>
        {b.distance_km != null && (
          <span className="flex items-center gap-1">
            <Route className="w-4 h-4" /> {b.distance_km} km
          </span>
        )}
        {b.estimated_fare != null && (
          <span className="flex items-center gap-1">
            <IndianRupee className="w-4 h-4" /> {b.estimated_fare}
          </span>
        )}
      </div>
      {b.notes && (
        <div className="mt-1 rounded-md bg-muted p-2 text-muted-foreground">
          <b>Note:</b> {b.notes}
        </div>
      )}
      {onStatusChange && (
        <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t">
          <span className="text-sm font-medium">Update status:</span>
          {STATUS_OPTIONS.map((s) => (
            <Button
              key={s}
              size="sm"
              variant={b.status === s ? "default" : "outline"}
              disabled={updating || b.status === s}
              onClick={() => onStatusChange(s)}
              className="capitalize"
            >
              {s.replace("_", " ")}
            </Button>
          ))}
        </div>
      )}
    </CardContent>
  </Card>
);

export default DriverDashboard;
