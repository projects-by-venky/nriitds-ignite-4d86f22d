import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
  requireHOD?: boolean;
  requireFaculty?: boolean;
  requireAdminOrFaculty?: boolean;
  requireAdminOrHOD?: boolean;
}

const ProtectedRoute = ({ 
  children, 
  requireAdmin = false,
  requireHOD = false,
  requireFaculty = false,
  requireAdminOrFaculty = false,
  requireAdminOrHOD = false,
}: ProtectedRouteProps) => {
  const { user, isLoading, isAdmin, isHOD, isFaculty, isAdminOrFaculty } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground text-sm">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  if (requireHOD && !isHOD && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  if (requireFaculty && !isFaculty && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  if (requireAdminOrFaculty && !isAdminOrFaculty) {
    return <Navigate to="/" replace />;
  }

  if (requireAdminOrHOD && !isAdmin && !isHOD) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
