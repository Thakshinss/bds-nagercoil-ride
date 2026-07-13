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
    return <Navigate to="/my-rides" replace />;
  }

  return <>{children}</>;
};

export default DriverRoute;
