/**
 * useCartel Hook
 * 
 * React hook for managing cartel (group) data and operations.
 * Provides cartel information, membership status, and role checking.
 * 
 * @module lib/hooks/useCartel
 */

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  getUserCartels,
  getCartel,
  getUserCartelRole,
  type Cartel,
} from '@/services/cartel.service';

/**
 * Hook result interface
 */
interface UseCartelResult {
  /** Current user's cartels */
  cartels: Cartel[];
  /** Active/selected cartel */
  activeCartel: Cartel | null;
  /** User's role in active cartel */
  userRole: 'admin' | 'moderator' | 'user' | null;
  /** Loading state */
  loading: boolean;
  /** Error state */
  error: Error | null;
  /** Refresh cartel data */
  refetch: () => Promise<void>;
}

/**
 * Custom hook for accessing and managing cartel data
 * 
 * @param cartelId - Optional specific cartel ID to load
 * @returns Cartel data and operations
 * 
 * @example
 * ```typescript
 * function MyComponent() {
 *   const { activeCartel, userRole, loading } = useCartel();
 *   
 *   if (loading) return <div>Loading...</div>;
 *   if (!activeCartel) return <div>No cartel found</div>;
 *   
 *   return <div>Welcome to {activeCartel.name}</div>;
 * }
 * ```
 */
export function useCartel(cartelId?: string): UseCartelResult {
  const { user } = useAuth();
  const [cartels, setCartels] = useState<Cartel[]>([]);
  const [activeCartel, setActiveCartel] = useState<Cartel | null>(null);
  const [userRole, setUserRole] = useState<'admin' | 'moderator' | 'user' | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Fetch user's cartels
      const userCartels = await getUserCartels(user.id);
      setCartels(userCartels);

      // Set active cartel (specified or first available)
      let active: Cartel | null = null;
      if (cartelId) {
        active = await getCartel(cartelId);
      } else if (userCartels.length > 0) {
        active = userCartels[0];
      }
      setActiveCartel(active);

      // Get user role in active cartel
      if (active) {
        const role = await getUserCartelRole(user.id, active.id);
        setUserRole(role);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch cartel data'));
      console.error('Error in useCartel:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user, cartelId]);

  return {
    cartels,
    activeCartel,
    userRole,
    loading,
    error,
    refetch: fetchData,
  };
}
