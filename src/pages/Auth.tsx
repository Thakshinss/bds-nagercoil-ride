import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const routeForRoles = (roles: string[]) => {
  if (roles.includes('admin')) return '/admin_b_d_s';
  if (roles.includes('driver')) return '/driver';
  return '/my-rides';
};
import { Helmet } from 'react-helmet-async';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

const loginSchema = z.object({
  email: z.string().trim().email('Invalid email').max(255),
  password: z.string().min(6, 'Min 6 characters').max(100),
});

const signupSchema = loginSchema.extend({
  full_name: z.string().trim().min(2, 'Enter your name').max(100),
  phone: z.string().trim().min(7, 'Enter a valid phone').max(20),
});

const Auth = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && user) navigate('/my-rides', { replace: true });
  }, [user, loading, navigate]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = loginSchema.safeParse(Object.fromEntries(fd));
    if (!parsed.success) {
      toast({ title: 'Check the form', description: parsed.error.issues[0].message, variant: 'destructive' });
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword(parsed.data);
    setBusy(false);
    if (error) {
      toast({ title: 'Sign in failed', description: error.message, variant: 'destructive' });
      return;
    }
    navigate('/my-rides');
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = signupSchema.safeParse(Object.fromEntries(fd));
    if (!parsed.success) {
      toast({ title: 'Check the form', description: parsed.error.issues[0].message, variant: 'destructive' });
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: {
        emailRedirectTo: `${window.location.origin}/my-rides`,
        data: { full_name: parsed.data.full_name, phone: parsed.data.phone },
      },
    });
    setBusy(false);
    if (error) {
      toast({ title: 'Sign up failed', description: error.message, variant: 'destructive' });
      return;
    }
    toast({ title: 'Account created', description: 'You are signed in.' });
    navigate('/my-rides');
  };

  return (
    <>
      <Helmet>
        <title>Customer Login | BDS Cabs</title>
        <meta name="description" content="Sign in to book and manage your cab rides with BDS Cabs in Nagercoil." />
        <meta name="robots" content="noindex,nofollow" />
        <link rel="canonical" href="/auth" />
      </Helmet>
      <div className="container mx-auto px-4 py-12 max-w-md">
        <Card className="shadow-custom-md">
          <CardHeader>
            <CardTitle className="text-2xl">Welcome to BDS Cabs</CardTitle>
            <CardDescription>Sign in or create an account to book rides.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login">
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="login">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="li-email">Email</Label>
                    <Input id="li-email" name="email" type="email" required />
                  </div>
                  <div>
                    <Label htmlFor="li-password">Password</Label>
                    <Input id="li-password" name="password" type="password" required />
                  </div>
                  <Button type="submit" className="w-full" disabled={busy}>
                    {busy ? 'Signing in…' : 'Sign In'}
                  </Button>
                </form>
              </TabsContent>
              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="su-name">Full name</Label>
                    <Input id="su-name" name="full_name" required />
                  </div>
                  <div>
                    <Label htmlFor="su-phone">Mobile number</Label>
                    <Input id="su-phone" name="phone" type="tel" required />
                  </div>
                  <div>
                    <Label htmlFor="su-email">Email</Label>
                    <Input id="su-email" name="email" type="email" required />
                  </div>
                  <div>
                    <Label htmlFor="su-password">Password</Label>
                    <Input id="su-password" name="password" type="password" minLength={6} required />
                  </div>
                  <Button type="submit" className="w-full" disabled={busy}>
                    {busy ? 'Creating…' : 'Create Account'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
            <p className="text-xs text-muted-foreground text-center mt-6">
              Prefer not to sign up? <Link to="/" className="text-primary underline">Use the quick booking form</Link>.
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Auth;
