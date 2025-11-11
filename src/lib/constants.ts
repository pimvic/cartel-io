/**
 * Application Constants
 * 
 * Central location for all application-wide constants, configuration values,
 * and magic numbers. Prevents duplication and makes values easy to update.
 * 
 * @module lib/constants
 */

/**
 * Supported application locales
 */
export const SUPPORTED_LOCALES = ['en', 'fr'] as const;
export type Locale = typeof SUPPORTED_LOCALES[number];

/**
 * Default application locale
 */
export const DEFAULT_LOCALE: Locale = 'fr';

/**
 * User roles in the system
 */
export const USER_ROLES = {
  ADMIN: 'admin',
  MODERATOR: 'moderator',
  USER: 'user',
} as const;

/**
 * API configuration
 */
export const API = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://api.kartels.io',
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
} as const;

/**
 * Performance targets and thresholds
 */
export const PERFORMANCE = {
  /** Maximum time for page load (ms) */
  PAGE_LOAD_TARGET: 2000,
  /** Filter action time-to-interactive (ms) */
  FILTER_TTI: 100,
  /** Search debounce delay (ms) */
  SEARCH_DEBOUNCE: 300,
  /** Autosave interval for notes (ms) */
  AUTOSAVE_INTERVAL: 5000,
  /** Refresh interval for real-time data (ms) */
  REALTIME_REFRESH: 30000,
} as const;

/**
 * Pagination defaults
 */
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const;

/**
 * File upload constraints
 */
export const FILE_UPLOAD = {
  /** Maximum file size in bytes (20MB) */
  MAX_SIZE: 20 * 1024 * 1024,
  /** Allowed file types for documents */
  ALLOWED_DOCUMENT_TYPES: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
  ],
  /** Allowed image types */
  ALLOWED_IMAGE_TYPES: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
  ],
} as const;

/**
 * Local storage keys
 */
export const STORAGE_KEYS = {
  PREFERRED_LOCALE: 'preferredLocale',
  THEME: 'theme',
  SIDEBAR_COLLAPSED: 'sidebarCollapsed',
  FAVORITES: 'favorites',
  PINNED_HIGHLIGHTS: 'pinnedHighlights',
} as const;

/**
 * Dashboard sections/routes
 */
export const DASHBOARD_SECTIONS = {
  OVERVIEW: 'vue-ensemble',
  ACTU_KARTEL: 'actu-kartel',
  MESSAGING: 'messagerie-news-events',
  KNOWLEDGE_BASE: 'base-connaissances',
  PEDAGOGICAL_TOOLS: 'outils-pedagogiques',
  CALENDAR: 'calendrier',
  PLUS_ONE: 'votre-plus-un',
  RULES: 'rules',
  NOTES: 'notes',
  VISIO: 'visio',
  SETTINGS: 'parametres',
  FEEDBACK: 'feedback',
  QUIZ: 'quiz',
  FLASHCARDS: 'flashcards',
  MINDMAP: 'mindmap',
  GLOSSARY: 'glossaire',
} as const;

/**
 * Date format patterns
 */
export const DATE_FORMATS = {
  SHORT: 'dd/MM/yyyy',
  LONG: 'EEEE, MMMM d, yyyy',
  TIME: 'HH:mm',
  DATETIME: 'dd/MM/yyyy HH:mm',
} as const;

/**
 * WebRTC/Visio configuration
 */
export const VISIO = {
  /** Maximum participants per session */
  MAX_PARTICIPANTS: 10,
  /** Target first frame time (ms) */
  TARGET_TTFJ: 2000,
  /** Maximum mouth-to-ear latency (ms) */
  MAX_LATENCY: 300,
  /** Caption delay target (ms) */
  CAPTION_LATENCY: 3000,
} as const;

/**
 * Notification/Alert durations (ms)
 */
export const NOTIFICATION_DURATION = {
  SUCCESS: 3000,
  ERROR: 5000,
  WARNING: 4000,
  INFO: 3000,
} as const;
