/**
 * User Service Tests
 * 
 * Unit tests for user service functions.
 * Tests user profile operations and role management.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as userService from './user.service';

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(),
  },
}));

import { supabase } from '@/integrations/supabase/client';

describe('UserService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getUserProfile', () => {
    it('should fetch user profile by auth ID', async () => {
      const mockProfile = {
        id: 'profile-123',
        auth_user_id: 'user-123',
        email: 'test@example.com',
        first_name: 'John',
        last_name: 'Doe',
        name: 'John Doe',
        preferred_locale: 'en',
        role: 'user',
        created_at: '2025-01-01T00:00:00Z',
      };

      const mockChain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockProfile, error: null }),
      };

      vi.mocked(supabase.from).mockReturnValue(mockChain as any);

      const result = await userService.getUserProfile('user-123');

      expect(supabase.from).toHaveBeenCalledWith('users');
      expect(mockChain.select).toHaveBeenCalledWith('*');
      expect(mockChain.eq).toHaveBeenCalledWith('auth_user_id', 'user-123');
      expect(result).toMatchObject({
        id: 'profile-123',
        email: 'test@example.com',
        first_name: 'John',
        last_name: 'Doe',
      });
    });

    it('should return null on error', async () => {
      const mockChain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ 
          data: null, 
          error: { message: 'User not found' } 
        }),
      };

      vi.mocked(supabase.from).mockReturnValue(mockChain as any);

      const result = await userService.getUserProfile('invalid-id');

      expect(result).toBeNull();
    });

    it('should handle invalid locale values', async () => {
      const mockProfile = {
        id: 'profile-123',
        auth_user_id: 'user-123',
        preferred_locale: 'es', // Invalid locale
        role: 'user',
      };

      const mockChain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockProfile, error: null }),
      };

      vi.mocked(supabase.from).mockReturnValue(mockChain as any);

      const result = await userService.getUserProfile('user-123');

      // Should default to 'fr'
      expect(result?.preferred_locale).toBe('fr');
    });
  });

  describe('updateUserProfile', () => {
    it('should update user profile fields', async () => {
      const mockUpdatedProfile = {
        id: 'profile-123',
        auth_user_id: 'user-123',
        first_name: 'Jane',
        last_name: 'Smith',
        preferred_locale: 'en',
        role: 'user',
      };

      const mockChain = {
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockUpdatedProfile, error: null }),
      };

      vi.mocked(supabase.from).mockReturnValue(mockChain as any);

      const result = await userService.updateUserProfile('user-123', {
        first_name: 'Jane',
        last_name: 'Smith',
      });

      expect(supabase.from).toHaveBeenCalledWith('users');
      expect(mockChain.update).toHaveBeenCalledWith({
        first_name: 'Jane',
        last_name: 'Smith',
      });
      expect(result).toMatchObject({
        first_name: 'Jane',
        last_name: 'Smith',
      });
    });
  });

  describe('getUserRoles', () => {
    it('should fetch user roles', async () => {
      const mockRoles = [
        { user_id: 'user-123', role: 'admin' },
        { user_id: 'user-123', role: 'moderator' },
      ];

      const mockChain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ data: mockRoles, error: null }),
      };

      vi.mocked(supabase.from).mockReturnValue(mockChain as any);

      const result = await userService.getUserRoles('user-123');

      expect(supabase.from).toHaveBeenCalledWith('user_roles');
      expect(result).toEqual(mockRoles);
    });

    it('should return empty array on error', async () => {
      const mockChain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ 
          data: null, 
          error: { message: 'Roles not found' } 
        }),
      };

      vi.mocked(supabase.from).mockReturnValue(mockChain as any);

      const result = await userService.getUserRoles('user-123');

      expect(result).toEqual([]);
    });
  });

  describe('hasRole', () => {
    it('should return true if user has role', async () => {
      const mockRoles = [
        { user_id: 'user-123', role: 'admin' },
      ];

      const mockChain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ data: mockRoles, error: null }),
      };

      vi.mocked(supabase.from).mockReturnValue(mockChain as any);

      const result = await userService.hasRole('user-123', 'admin');

      expect(result).toBe(true);
    });

    it('should return false if user does not have role', async () => {
      const mockRoles = [
        { user_id: 'user-123', role: 'user' },
      ];

      const mockChain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ data: mockRoles, error: null }),
      };

      vi.mocked(supabase.from).mockReturnValue(mockChain as any);

      const result = await userService.hasRole('user-123', 'admin');

      expect(result).toBe(false);
    });
  });

  describe('getUserInitials', () => {
    it('should return initials from first and last name', () => {
      const user = {
        first_name: 'John',
        last_name: 'Doe',
      };

      const initials = userService.getUserInitials(user);

      expect(initials).toBe('JD');
    });

    it('should handle empty names', () => {
      const user = {
        first_name: '',
        last_name: '',
      };

      const initials = userService.getUserInitials(user);

      expect(initials).toBe('');
    });

    it('should handle missing last name', () => {
      const user = {
        first_name: 'John',
        last_name: '',
      };

      const initials = userService.getUserInitials(user);

      expect(initials).toBe('J');
    });
  });

  describe('formatUserDisplayName', () => {
    it('should format name with last initial', () => {
      const user = {
        first_name: 'Jean-Stéphane',
        last_name: 'Bertrand',
      };

      const displayName = userService.formatUserDisplayName(user);

      expect(displayName).toBe('Jean-Stéphane B.');
    });

    it('should handle missing last name', () => {
      const user = {
        first_name: 'John',
        last_name: '',
      };

      const displayName = userService.formatUserDisplayName(user);

      expect(displayName).toBe('John');
    });
  });
});
