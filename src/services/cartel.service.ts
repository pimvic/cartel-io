/**
 * Cartel Service
 * 
 * Handles cartel (group/team) operations including membership,
 * cartel settings, and member management.
 * 
 * @module services/cartel
 */

import { supabase } from '@/integrations/supabase/client';

/**
 * Cartel (study group) data
 */
export interface Cartel {
  id: string;
  name: string;
  description?: string;
  deadline?: string;
  created_at: string;
  settings?: Record<string, any>;
}

/**
 * Cartel membership information
 */
export interface Membership {
  id: string;
  user_id: string;
  cartel_id: string;
  role: 'admin' | 'moderator' | 'user';
  joined_at: string;
}

/**
 * Member with user profile
 */
export interface MemberWithProfile extends Membership {
  users: {
    id: string;
    name: string;
    email: string;
    avatar_url?: string;
    last_login_at?: string;
  };
}

/**
 * Fetches cartel information by ID
 * 
 * @param cartelId - Cartel UUID
 * @returns Promise with cartel data or null
 */
export async function getCartel(cartelId: string): Promise<Cartel | null> {
  const { data, error } = await supabase
    .from('cartels')
    .select('*')
    .eq('id', cartelId)
    .single();

  if (error) {
    console.error('Error fetching cartel:', error);
    return null;
  }

  return data;
}

/**
 * Fetches user's cartels (memberships)
 * 
 * @param userId - User's auth ID
 * @returns Promise with array of cartels
 */
export async function getUserCartels(userId: string): Promise<Cartel[]> {
  const { data, error } = await supabase
    .from('memberships')
    .select('cartel_id, cartels(*)')
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching user cartels:', error);
    return [];
  }

  return data?.map(m => m.cartels).filter(Boolean) || [];
}

/**
 * Fetches cartel members with their profiles
 * 
 * @param cartelId - Cartel UUID
 * @returns Promise with array of members
 */
export async function getCartelMembers(cartelId: string): Promise<MemberWithProfile[]> {
  const { data, error } = await supabase
    .from('memberships')
    .select(`
      *,
      users (
        id,
        name,
        email,
        avatar_url,
        last_login_at
      )
    `)
    .eq('cartel_id', cartelId);

  if (error) {
    console.error('Error fetching cartel members:', error);
    return [];
  }

  return data as MemberWithProfile[];
}

/**
 * Checks if user is a member of cartel
 * 
 * @param userId - User's auth ID
 * @param cartelId - Cartel UUID
 * @returns Promise with boolean result
 */
export async function isCartelMember(userId: string, cartelId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('memberships')
    .select('id')
    .eq('user_id', userId)
    .eq('cartel_id', cartelId)
    .single();

  return !!data && !error;
}

/**
 * Gets user's role in cartel
 * 
 * @param userId - User's auth ID
 * @param cartelId - Cartel UUID
 * @returns Promise with role or null
 */
export async function getUserCartelRole(
  userId: string,
  cartelId: string
): Promise<'admin' | 'moderator' | 'user' | null> {
  const { data, error } = await supabase
    .from('memberships')
    .select('role')
    .eq('user_id', userId)
    .eq('cartel_id', cartelId)
    .single();

  if (error || !data) {
    return null;
  }

  return data.role as 'admin' | 'moderator' | 'user';
}

/**
 * Updates cartel settings
 * 
 * @param cartelId - Cartel UUID
 * @param updates - Settings to update
 * @returns Promise with updated cartel or null
 */
export async function updateCartel(
  cartelId: string,
  updates: Partial<Omit<Cartel, 'id' | 'created_at'>>
): Promise<Cartel | null> {
  const { data, error } = await supabase
    .from('cartels')
    .update(updates)
    .eq('id', cartelId)
    .select()
    .single();

  if (error) {
    console.error('Error updating cartel:', error);
    return null;
  }

  return data;
}
