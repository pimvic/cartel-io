/**
 * Authentication Context
 * 
 * Provides authentication state and operations throughout the application.
 * Manages user session, login state, and sign out functionality.
 * 
 * @module contexts/AuthContext
 */

import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

/**
 * Auth context value interface
 */
interface AuthContextType {
  /** Current authenticated user */
  user: User | null;
  /** Current session */
  session: Session | null;
  /** Loading state during auth initialization */
  loading: boolean;
  /** Sign out function */
  signOut: () => Promise<void>;
}

/**
 * Auth context with default values
 */
const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signOut: async () => {},
});

/**
 * Hook to access authentication context
 * 
 * @returns Auth context value
 * @throws Error if used outside AuthProvider
 * 
 * @example
 * ```typescript
 * function MyComponent() {
 *   const { user, loading, signOut } = useAuth();
 *   // Use auth state...
 * }
 * ```
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

/**
 * Authentication Provider Component
 * 
 * Wraps the application to provide authentication context to all child components.
 * Handles auth state changes, session management, and auto-refresh.
 * 
 * @param props - Component props
 * @param props.children - Child components to wrap
 * 
 * @example
 * ```typescript
 * <AuthProvider>
 *   <App />
 * </AuthProvider>
 * ```
 */
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    /**
     * Subscribe to auth state changes
     * Updates user and session when authentication state changes
     */
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    /**
     * Check for existing session on mount
     * Restores user session if valid token exists
     */
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Cleanup: unsubscribe from auth changes
    return () => subscription.unsubscribe();
  }, []);

  /**
   * Sign out the current user
   * Clears session data and redirects to login page
   */
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      // Get preferred locale from localStorage or default to 'fr'
      const locale = localStorage.getItem('preferredLocale') || 'fr';
      navigate(`/${locale}/login`);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
