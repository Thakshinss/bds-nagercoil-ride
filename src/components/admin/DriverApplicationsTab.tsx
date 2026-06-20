import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

type Application = {
  id: string;
  user_id: string;
  license_number: string;
  vehicle_info: string | null;
  experience_years: number | null;
  status: string;
  created_at: string;
};

const DriverApplicationsTab = () => {
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const { toast } = useToast();

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('driver_applications')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      toast({ title: 'Failed to load', description: error.message, variant: 'destructive' });
    }
    setApps((data as Application[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const setStatus = async (app: Application, status: 'approved' | 'rejected') => {
    setBusyId(app.id);
    const { error: upErr } = await supabase
      .from('driver_applications')
      .update({ status })
      .eq('id', app.id);
    if (upErr) {
      setBusyId(null);
      toast({ title: 'Update failed', description: upErr.message, variant: 'destructive' });
      return;
    }
    if (status === 'approved') {
      const { error: roleErr } = await supabase
        .from('user_roles')
        .insert({ user_id: app.user_id, role: 'driver' });
      if (roleErr && !roleErr.message.toLowerCase().includes('duplicate')) {
        setBusyId(null);
        toast({ title: 'Role assignment failed', description: roleErr.message, variant: 'destructive' });
        return;
      }
    }
    setBusyId(null);
    toast({ title: `Application ${status}` });
    load();
  };

  return (
    <Card className="shadow-custom-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Driver Applications ({apps.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User ID</TableHead>
                  <TableHead>License</TableHead>
                  <TableHead>Experience</TableHead>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {apps.map((app) => (
                  <TableRow key={app.id}>
                    <TableCell className="font-mono text-xs">{app.user_id.slice(0, 8)}…</TableCell>
                    <TableCell>{app.license_number}</TableCell>
                    <TableCell>{app.experience_years ?? '—'} yrs</TableCell>
                    <TableCell className="max-w-xs truncate">{app.vehicle_info ?? '—'}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        app.status === 'approved'
                          ? 'bg-green-100 text-green-700'
                          : app.status === 'rejected'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>{app.status}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={busyId === app.id || app.status === 'approved'}
                          onClick={() => setStatus(app, 'approved')}
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          disabled={busyId === app.id || app.status === 'rejected'}
                          onClick={() => setStatus(app, 'rejected')}
                        >
                          Reject
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {apps.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No applications yet
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DriverApplicationsTab;
