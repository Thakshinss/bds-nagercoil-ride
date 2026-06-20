import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export const useIsDriver = () => {
  const { user, loading: authLoading } = useAuth();
  const [isDriver, setIsDriver] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const check = async () => {
      if (authLoading) return;
      if (!user) {
        if (!cancelled) {
          setIsDriver(false);
          setLoading(false);
        }
        return;
      }
      setLoading(true);
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'driver')
        .maybeSingle();
      if (cancelled) return;
      setIsDriver(!error && !!data);
      setLoading(false);
    };
    check();
    return () => {
      cancelled = true;
    };
  }, [user, authLoading]);

  return { isDriver, loading: loading || authLoading };
};
