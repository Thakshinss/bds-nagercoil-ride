import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const schema = z.object({
  license_number: z.string().trim().min(3, 'Enter a valid license number').max(50),
  vehicle_info: z.string().trim().max(300).optional(),
  experience_years: z.coerce.number().int().min(0).max(60),
});

type Application = {
  id: string;
  status: string;
  license_number: string;
  created_at: string;
};

const BecomeDriver = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [busy, setBusy] = useState(false);
  const [existing, setExisting] = useState<Application | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate('/auth', { replace: true });
      return;
    }
    (async () => {
      const { data } = await supabase
        .from('driver_applications')
        .select('id, status, license_number, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      setExisting(data ?? null);
      setChecking(false);
    })();
  }, [user, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
    const fd = new FormData(e.currentTarget);
    const parsed = schema.safeParse(Object.fromEntries(fd));
    if (!parsed.success) {
      toast({ title: 'Check the form', description: parsed.error.issues[0].message, variant: 'destructive' });
      return;
    }
    setBusy(true);
    const { data, error } = await supabase
      .from('driver_applications')
      .insert({
        user_id: user.id,
        license_number: parsed.data.license_number,
        vehicle_info: parsed.data.vehicle_info || null,
        experience_years: parsed.data.experience_years,
      })
      .select('id, status, license_number, created_at')
      .single();
    setBusy(false);
    if (error) {
      toast({ title: 'Could not submit', description: error.message, variant: 'destructive' });
      return;
    }
    setExisting(data);
    toast({ title: 'Application submitted', description: 'We will review and contact you soon.' });
  };

  if (loading || checking) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Become a Driver | BDS Cabs</title>
        <meta name="description" content="Apply to drive with BDS Cabs in Nagercoil. Submit your license and vehicle details for review." />
        <link rel="canonical" href="/become-a-driver" />
      </Helmet>
      <div className="container mx-auto px-4 py-12 max-w-xl">
        <Card className="shadow-custom-md">
          <CardHeader>
            <CardTitle className="text-2xl">Drive with BDS Cabs</CardTitle>
            <CardDescription>
              Submit your details. Our team will review and reach out.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {existing ? (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">Your latest application</p>
                <div className="rounded-lg border p-4 space-y-1">
                  <div className="flex justify-between">
                    <span className="font-medium">Status</span>
                    <span className="capitalize text-primary">{existing.status}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>License</span><span>{existing.license_number}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Submitted</span>
                    <span>{new Date(existing.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Need to update something? <Link to="/contact" className="text-primary underline">Contact us</Link>.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="license_number">Driving license number</Label>
                  <Input id="license_number" name="license_number" required maxLength={50} />
                </div>
                <div>
                  <Label htmlFor="experience_years">Years of driving experience</Label>
                  <Input id="experience_years" name="experience_years" type="number" min={0} max={60} required />
                </div>
                <div>
                  <Label htmlFor="vehicle_info">Vehicle details (optional)</Label>
                  <Textarea id="vehicle_info" name="vehicle_info" maxLength={300} placeholder="Make, model, year, registration..." />
                </div>
                <Button type="submit" className="w-full" disabled={busy}>
                  {busy ? 'Submitting…' : 'Submit application'}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default BecomeDriver;
