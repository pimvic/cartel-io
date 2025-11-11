/**
 * API Client
 * 
 * Centralized API client for making HTTP requests to backend services.
 * Provides typed responses, error handling, and request interceptors.
 * 
 * @module lib/api/client
 */

import { toast } from "sonner";

/**
 * Base configuration for API requests
 */
const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://api.kartels.io',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
};

/**
 * Standard API response wrapper
 */
export interface ApiResponse<T = any> {
  data: T;
  error?: string;
  success: boolean;
}

/**
 * API Error class for structured error handling
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Makes an HTTP request with error handling and timeout
 * 
 * @template T - Expected response data type
 * @param endpoint - API endpoint path (relative to baseURL)
 * @param options - Fetch options (method, headers, body, etc.)
 * @returns Promise resolving to typed response data
 * @throws {ApiError} On network or HTTP errors
 * 
 * @example
 * ```typescript
 * const user = await request<User>('/users/123', { method: 'GET' });
 * ```
 */
export async function request<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_CONFIG.baseURL}${endpoint}`;
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...API_CONFIG.headers,
        ...options.headers,
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new ApiError(
        error.message || `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        error
      );
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error instanceof ApiError) {
      throw error;
    }
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new ApiError('Request timeout', 408);
      }
      throw new ApiError(error.message);
    }
    
    throw new ApiError('Unknown error occurred');
  }
}

/**
 * GET request helper
 */
export const get = <T = any>(endpoint: string, options?: RequestInit) =>
  request<T>(endpoint, { ...options, method: 'GET' });

/**
 * POST request helper
 */
export const post = <T = any>(endpoint: string, body?: any, options?: RequestInit) =>
  request<T>(endpoint, {
    ...options,
    method: 'POST',
    body: body ? JSON.stringify(body) : undefined,
  });

/**
 * PUT request helper
 */
export const put = <T = any>(endpoint: string, body?: any, options?: RequestInit) =>
  request<T>(endpoint, {
    ...options,
    method: 'PUT',
    body: body ? JSON.stringify(body) : undefined,
  });

/**
 * DELETE request helper
 */
export const del = <T = any>(endpoint: string, options?: RequestInit) =>
  request<T>(endpoint, { ...options, method: 'DELETE' });

/**
 * Handles API errors with user-friendly toast notifications
 * 
 * @param error - Error object from API call
 * @param customMessage - Optional custom message to display
 */
export function handleApiError(error: unknown, customMessage?: string): void {
  if (error instanceof ApiError) {
    toast.error(customMessage || error.message);
    console.error('API Error:', error);
  } else if (error instanceof Error) {
    toast.error(customMessage || error.message);
    console.error('Error:', error);
  } else {
    toast.error(customMessage || 'An unexpected error occurred');
    console.error('Unknown error:', error);
  }
}
