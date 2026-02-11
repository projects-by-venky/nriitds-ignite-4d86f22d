import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { getBackendClient } from '@/integrations/backend/client';

export type AppRole = 'admin' | 'faculty' | 'student';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userRole: AppRole | null;
  isLoading: boolean;
  isAdmin: boolean;
  isFaculty: boolean;
  isAdminOrFaculty: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, fullName?: string, department?: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshRole: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<AppRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserRole = async (userId: string) => {
    try {
      const supabase = getBackendClient();
      const { data, error } = await supabase
        .rpc('get_user_role', { _user_id: userId });
      
      if (error) {
        console.error('Error fetching role:', error);
        return null;
      }
      return data as AppRole | null;
    } catch (error) {
      console.error('Error fetching role:', error);
      return null;
    }
  };

  const refreshRole = async () => {
    if (user) {
      const role = await fetchUserRole(user.id);
      setUserRole(role);
    }
  };

  useEffect(() => {
    const supabase = getBackendClient();
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Defer role fetch with setTimeout to prevent deadlock
        if (session?.user) {
          setTimeout(() => {
            fetchUserRole(session.user.id).then(setUserRole);
          }, 0);
        } else {
          setUserRole(null);
        }
        
        setIsLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchUserRole(session.user.id).then(setUserRole);
      }
      
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const supabase = getBackendClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error: error as Error | null };
  };

  const signUp = async (email: string, password: string, fullName?: string, department?: string) => {
    const supabase = getBackendClient();
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName,
          department: department,
        },
      },
    });
    return { error: error as Error | null };
  };

  const signOut = async () => {
    const supabase = getBackendClient();
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setUserRole(null);
  };

  const isAdmin = userRole === 'admin';
  const isFaculty = userRole === 'faculty';
  const isAdminOrFaculty = isAdmin || isFaculty;

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        userRole,
        isLoading,
        isAdmin,
        isFaculty,
        isAdminOrFaculty,
        signIn,
        signUp,
        signOut,
        refreshRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
