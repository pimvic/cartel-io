/**
 * Authentication Service
 * 
 * Handles all authentication-related operations with Supabase.
 * Provides methods for sign up, sign in, sign out, and session management.
 * 
 * @module services/auth
 */

import { supabase } from '@/integrations/supabase/client';
import { AuthError, User } from '@supabase/supabase-js';

/**
 * Sign up credentials for email/password authentication
 */
export interface SignUpCredentials {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  preferredLocale?: 'en' | 'fr';
}

/**
 * Sign in credentials
 */
export interface SignInCredentials {
  email: string;
  password: string;
}

/**
 * Authentication result
 */
export interface AuthResult {
  user: User | null;
  error: AuthError | null;
}

/**
 * Signs up a new user with email and password
 * 
 * @param credentials - User registration data
 * @returns Promise with user data or error
 * 
 * @example
 * ```typescript
 * const result = await signUp({
 *   email: 'user@example.com',
 *   password: 'SecurePass123',
 *   firstName: 'John',
 *   lastName: 'Doe'
 * });
 * ```
 */
export async function signUp(credentials: SignUpCredentials): Promise<AuthResult> {
  const { data, error } = await supabase.auth.signUp({
    email: credentials.email,
    password: credentials.password,
    options: {
      data: {
        first_name: credentials.firstName || '',
        last_name: credentials.lastName || '',
        preferred_locale: credentials.preferredLocale || 'fr',
      },
    },
  });

  return {
    user: data.user,
    error,
  };
}

/**
 * Signs in an existing user with email and password
 * 
 * @param credentials - User login credentials
 * @returns Promise with user data or error
 */
export async function signIn(credentials: SignInCredentials): Promise<AuthResult> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: credentials.email,
    password: credentials.password,
  });

  return {
    user: data.user,
    error,
  };
}

/**
 * Signs in user with Google OAuth
 * 
 * @returns Promise with error if failed (redirects on success)
 */
export async function signInWithGoogle(): Promise<{ error: AuthError | null }> {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  return { error };
}

/**
 * Signs out the current user
 * 
 * @returns Promise with error if failed
 */
export async function signOut(): Promise<{ error: AuthError | null }> {
  const { error } = await supabase.auth.signOut();
  return { error };
}

/**
 * Gets the current user session
 * 
 * @returns Promise with session data
 */
export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  return { session: data.session, error };
}

/**
 * Gets the current authenticated user
 * 
 * @returns Promise with user data
 */
export async function getUser() {
  const { data, error } = await supabase.auth.getUser();
  return { user: data.user, error };
}

/**
 * Sends a password reset email
 * 
 * @param email - User's email address
 * @returns Promise with error if failed
 */
export async function resetPassword(email: string): Promise<{ error: AuthError | null }> {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset-password`,
  });

  return { error };
}

/**
 * Updates user password (requires current session)
 * 
 * @param newPassword - New password
 * @returns Promise with user data or error
 */
export async function updatePassword(newPassword: string): Promise<AuthResult> {
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  return {
    user: data.user,
    error,
  };
}
