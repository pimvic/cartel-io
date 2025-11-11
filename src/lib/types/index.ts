/**
 * Shared TypeScript Types
 * 
 * Central location for TypeScript interfaces and types used across
 * multiple modules in the application.
 * 
 * @module lib/types
 */

/**
 * Generic API response wrapper
 */
export interface ApiResponse<T = any> {
  data: T;
  error?: string;
  message?: string;
  success: boolean;
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

/**
 * User presence status
 */
export type PresenceStatus = 'online' | 'idle' | 'away' | 'offline';

/**
 * Resource type in knowledge base
 */
export type ResourceType = 'document' | 'video' | 'note' | 'link';

/**
 * Task/Milestone status
 */
export type TaskStatus = 'todo' | 'in_progress' | 'done' | 'archived';

/**
 * Event RSVP status
 */
export type RsvpStatus = 'yes' | 'no' | 'maybe';

/**
 * Feedback type
 */
export type FeedbackType = 'bug' | 'feature' | 'help' | 'other';

/**
 * Badge/Tag variant
 */
export type BadgeVariant = 'default' | 'secondary' | 'success' | 'warning' | 'destructive';

/**
 * Sort direction
 */
export type SortDirection = 'asc' | 'desc';

/**
 * Filter criteria (generic)
 */
export interface FilterCriteria {
  field: string;
  operator: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'contains';
  value: any;
}

/**
 * Sort criteria
 */
export interface SortCriteria {
  field: string;
  direction: SortDirection;
}

/**
 * Search params for lists
 */
export interface SearchParams {
  query?: string;
  filters?: FilterCriteria[];
  sort?: SortCriteria;
  page?: number;
  pageSize?: number;
}

/**
 * Notification object
 */
export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

/**
 * Audit log entry
 */
export interface AuditLog {
  id: string;
  actor_id: string;
  action: string;
  resource_type: string;
  resource_id: string;
  changes?: Record<string, any>;
  timestamp: Date;
  ip_address?: string;
}

/**
 * Form field error
 */
export interface FieldError {
  field: string;
  message: string;
}

/**
 * Loading state
 */
export interface LoadingState {
  isLoading: boolean;
  message?: string;
}

/**
 * Error state
 */
export interface ErrorState {
  hasError: boolean;
  message?: string;
  code?: string;
}
