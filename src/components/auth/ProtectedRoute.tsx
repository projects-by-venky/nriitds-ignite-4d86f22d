import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
  requireFaculty?: boolean;
  requireAdminOrFaculty?: boolean;
}

/**
 * Protected route wrapper that enforces authentication and role-based access.
 * 
 * @param requireAdmin - Only admins can access
 * @param requireFaculty - Only faculty can access
 * @param requireAdminOrFaculty - Either admin or faculty can access
 */
const ProtectedRoute = ({ 
  children, 
  requireAdmin = false,
  requireFaculty = false,
  requireAdminOrFaculty = false 
}: ProtectedRouteProps) => {
  const { user, isLoading, isAdmin, isFaculty, isAdminOrFaculty } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking auth state
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

  // Not logged in - redirect to auth page
  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Check role requirements
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  if (requireFaculty && !isFaculty) {
    return <Navigate to="/" replace />;
  }

  if (requireAdminOrFaculty && !isAdminOrFaculty) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
