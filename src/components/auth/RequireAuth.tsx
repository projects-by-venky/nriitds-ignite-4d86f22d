import { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface RequireAuthProps {
  children: ReactNode;
  fallback?: ReactNode;
  requireAdmin?: boolean;
  requireFaculty?: boolean;
  requireAdminOrFaculty?: boolean;
}

/**
 * Conditional rendering based on authentication state.
 * Use this for showing/hiding UI elements based on auth.
 * For route protection, use ProtectedRoute instead.
 */
const RequireAuth = ({ 
  children, 
  fallback = null,
  requireAdmin = false,
  requireFaculty = false,
  requireAdminOrFaculty = false 
}: RequireAuthProps) => {
  const { user, isLoading, isAdmin, isFaculty, isAdminOrFaculty } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!user) {
    return <>{fallback}</>;
  }

  if (requireAdmin && !isAdmin) {
    return <>{fallback}</>;
  }

  if (requireFaculty && !isFaculty) {
    return <>{fallback}</>;
  }

  if (requireAdminOrFaculty && !isAdminOrFaculty) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

export default RequireAuth;
