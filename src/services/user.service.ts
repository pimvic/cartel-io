/**
 * User Service
 * 
 * Handles user profile operations and user-related data queries.
 * 
 * @module services/user
 */

import { supabase } from '@/integrations/supabase/client';

/**
 * User profile data
 */
export interface UserProfile {
  id: string;
  auth_user_id: string;
  email: string;
  first_name: string;
  last_name: string;
  name: string;
  avatar_url?: string;
  preferred_locale: 'en' | 'fr';
  role: 'admin' | 'moderator' | 'user';
  last_login_at?: string;
  created_at: string;
}

/**
 * User role information
 */
export interface UserRole {
  user_id: string;
  role: 'admin' | 'moderator' | 'user';
}

/**
 * Fetches the current user's profile
 * 
 * @param userId - User's auth ID
 * @returns Promise with user profile or null
 */
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('auth_user_id', userId)
    .single();

  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }

  // Type assertion for locale - ensure it's valid
  if (data) {
    return {
      ...data,
      preferred_locale: (data.preferred_locale === 'en' || data.preferred_locale === 'fr') 
        ? data.preferred_locale as 'en' | 'fr'
        : 'fr',
      role: data.role as 'admin' | 'moderator' | 'user',
    } as UserProfile;
  }

  return null;
}

/**
 * Updates user profile information
 * 
 * @param userId - User's auth ID
 * @param updates - Profile fields to update
 * @returns Promise with updated profile or null
 */
export async function updateUserProfile(
  userId: string,
  updates: Partial<Omit<UserProfile, 'id' | 'auth_user_id' | 'created_at'>>
): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('auth_user_id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating user profile:', error);
    return null;
  }

  // Type assertion for locale and role
  if (data) {
    return {
      ...data,
      preferred_locale: (data.preferred_locale === 'en' || data.preferred_locale === 'fr') 
        ? data.preferred_locale as 'en' | 'fr'
        : 'fr',
      role: data.role as 'admin' | 'moderator' | 'user',
    } as UserProfile;
  }

  return null;
}

/**
 * Fetches user roles (for RBAC)
 * 
 * @param userId - User's auth ID
 * @returns Promise with array of roles
 */
export async function getUserRoles(userId: string): Promise<UserRole[]> {
  const { data, error } = await supabase
    .from('user_roles')
    .select('user_id, role')
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching user roles:', error);
    return [];
  }

  return data || [];
}

/**
 * Checks if user has a specific role
 * 
 * @param userId - User's auth ID
 * @param role - Role to check
 * @returns Promise with boolean result
 */
export async function hasRole(
  userId: string,
  role: 'admin' | 'moderator' | 'user'
): Promise<boolean> {
  const roles = await getUserRoles(userId);
  return roles.some(r => r.role === role);
}

/**
 * Gets user's initials for avatar fallback
 * 
 * @param user - User profile
 * @returns Initials string (e.g., "JD")
 */
export function getUserInitials(user: Pick<UserProfile, 'first_name' | 'last_name'>): string {
  const first = user.first_name?.charAt(0) || '';
  const last = user.last_name?.charAt(0) || '';
  return (first + last).toUpperCase();
}

/**
 * Formats user's display name
 * 
 * @param user - User profile
 * @returns Formatted name (e.g., "Jean-Stéphane B.")
 */
export function formatUserDisplayName(user: Pick<UserProfile, 'first_name' | 'last_name'>): string {
  const firstName = user.first_name || '';
  const lastInitial = user.last_name?.charAt(0) || '';
  return lastInitial ? `${firstName} ${lastInitial}.` : firstName;
}
