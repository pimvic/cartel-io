/**
 * Authentication Service Tests
 * 
 * Unit tests for auth service functions.
 * Tests all authentication operations with mocked Supabase client.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as authService from './auth.service';

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      signUp: vi.fn(),
      signInWithPassword: vi.fn(),
      signInWithOAuth: vi.fn(),
      signOut: vi.fn(),
      getSession: vi.fn(),
      getUser: vi.fn(),
      resetPasswordForEmail: vi.fn(),
      updateUser: vi.fn(),
    },
  },
}));

import { supabase } from '@/integrations/supabase/client';

describe('AuthService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('signUp', () => {
    it('should sign up user with email and password', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        created_at: new Date().toISOString(),
      };

      vi.mocked(supabase.auth.signUp).mockResolvedValue({
        data: { user: mockUser as any, session: null },
        error: null,
      });

      const result = await authService.signUp({
        email: 'test@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      });

      expect(supabase.auth.signUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
        options: {
          data: {
            first_name: 'John',
            last_name: 'Doe',
            preferred_locale: 'fr',
          },
        },
      });

      expect(result.user).toEqual(mockUser);
      expect(result.error).toBeNull();
    });

    it('should handle signup errors', async () => {
      const mockError = { message: 'Email already exists' };

      vi.mocked(supabase.auth.signUp).mockResolvedValue({
        data: { user: null, session: null },
        error: mockError as any,
      });

      const result = await authService.signUp({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result.user).toBeNull();
      expect(result.error).toEqual(mockError);
    });

    it('should use default locale if not provided', async () => {
      vi.mocked(supabase.auth.signUp).mockResolvedValue({
        data: { user: null, session: null },
        error: null,
      });

      await authService.signUp({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(supabase.auth.signUp).toHaveBeenCalledWith(
        expect.objectContaining({
          options: expect.objectContaining({
            data: expect.objectContaining({
              preferred_locale: 'fr',
            }),
          }),
        })
      );
    });
  });

  describe('signIn', () => {
    it('should sign in user with valid credentials', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
      };

      vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
        data: { user: mockUser as any, session: null },
        error: null,
      });

      const result = await authService.signIn({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result.user).toEqual(mockUser);
      expect(result.error).toBeNull();
    });

    it('should handle invalid credentials', async () => {
      const mockError = { message: 'Invalid login credentials' };

      vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
        data: { user: null, session: null },
        error: mockError as any,
      });

      const result = await authService.signIn({
        email: 'test@example.com',
        password: 'wrongpassword',
      });

      expect(result.user).toBeNull();
      expect(result.error).toEqual(mockError);
    });
  });

  describe('signInWithGoogle', () => {
    it('should initiate Google OAuth flow', async () => {
      vi.mocked(supabase.auth.signInWithOAuth).mockResolvedValue({
        data: { provider: 'google', url: 'https://google.com/oauth' } as any,
        error: null,
      });

      const result = await authService.signInWithGoogle();

      expect(supabase.auth.signInWithOAuth).toHaveBeenCalledWith({
        provider: 'google',
        options: {
          redirectTo: expect.stringContaining('/auth/callback'),
        },
      });

      expect(result.error).toBeNull();
    });

    it('should handle OAuth errors', async () => {
      const mockError = { message: 'OAuth provider not configured' };

      vi.mocked(supabase.auth.signInWithOAuth).mockResolvedValue({
        data: { provider: 'google', url: null } as any,
        error: mockError as any,
      });

      const result = await authService.signInWithGoogle();

      expect(result.error).toEqual(mockError);
    });
  });

  describe('signOut', () => {
    it('should sign out user successfully', async () => {
      vi.mocked(supabase.auth.signOut).mockResolvedValue({
        error: null,
      });

      const result = await authService.signOut();

      expect(supabase.auth.signOut).toHaveBeenCalled();
      expect(result.error).toBeNull();
    });

    it('should handle signout errors', async () => {
      const mockError = { message: 'Failed to sign out' };

      vi.mocked(supabase.auth.signOut).mockResolvedValue({
        error: mockError as any,
      });

      const result = await authService.signOut();

      expect(result.error).toEqual(mockError);
    });
  });

  describe('getSession', () => {
    it('should get current session', async () => {
      const mockSession = {
        access_token: 'token-123',
        user: { id: 'user-123' },
      };

      vi.mocked(supabase.auth.getSession).mockResolvedValue({
        data: { session: mockSession as any },
        error: null,
      });

      const result = await authService.getSession();

      expect(supabase.auth.getSession).toHaveBeenCalled();
      expect(result.session).toEqual(mockSession);
      expect(result.error).toBeNull();
    });
  });

  describe('resetPassword', () => {
    it('should send password reset email', async () => {
      vi.mocked(supabase.auth.resetPasswordForEmail).mockResolvedValue({
        data: {} as any,
        error: null,
      });

      const result = await authService.resetPassword('test@example.com');

      expect(supabase.auth.resetPasswordForEmail).toHaveBeenCalledWith(
        'test@example.com',
        expect.objectContaining({
          redirectTo: expect.stringContaining('/auth/reset-password'),
        })
      );

      expect(result.error).toBeNull();
    });
  });

  describe('updatePassword', () => {
    it('should update user password', async () => {
      const mockUser = { id: 'user-123' };

      vi.mocked(supabase.auth.updateUser).mockResolvedValue({
        data: { user: mockUser as any },
        error: null,
      });

      const result = await authService.updatePassword('newpassword123');

      expect(supabase.auth.updateUser).toHaveBeenCalledWith({
        password: 'newpassword123',
      });

      expect(result.user).toEqual(mockUser);
      expect(result.error).toBeNull();
    });
  });
});
