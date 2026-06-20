import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useIsDriver } from '@/hooks/useIsDriver';
import { Loader2 } from 'lucide-react';

const DriverRoute = ({ children }: { children: ReactNode }) => {
  const { user, loading: authLoading } = useAuth();
  const { isDriver, loading: roleLoading } = useIsDriver();
  const location = useLocation();

  if (authLoading || roleLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace state={{ from: location.pathname }} />;
  }

  if (!isDriver) {
    return (
      <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center gap-3 px-4 text-center">
        <h1 className="text-2xl font-semibold">Driver access required</h1>
        <p className="text-muted-foreground">
          Your account doesn't have driver access yet. Apply at{' '}
          <a href="/become-a-driver" className="text-primary underline">/become-a-driver</a>.
        </p>
      </div>
    );
  }

  return <>{children}</>;
};

export default DriverRoute;
