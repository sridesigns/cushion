/**
 * Application-wide constants
 * Centralized location for magic numbers and configuration values
 */

// Local Storage Keys
export const STORAGE_KEYS = {
  SAVINGS_ENTRIES: 'savingsEntries',
  CURRENCY: 'currency',
  NOTION_ACCESS_TOKEN: 'notion_access_token',
  NOTION_DATABASE_ID: 'notion_database_id',
} as const

// Timing Constants (in milliseconds)
export const TIMING = {
  LOADING_DURATION: 1500,
  LOADING_FADE_DELAY: 100,
  ANIMATION_STAGGER_DELAY: 100,
  DEBOUNCE_DELAY: 300,
} as const

// UI Constants
export const UI = {
  MAX_CONTENT_WIDTH: '5xl',
  BOTTOM_NAV_HEIGHT: 64,
  TOP_PADDING: 64,
} as const

// Validation Rules
export const VALIDATION = {
  MAX_DESCRIPTION_LENGTH: 200,
  MAX_CATEGORY_LENGTH: 50,
  MIN_AMOUNT: 0.01,
  MAX_AMOUNT: 999999999.99,
} as const

// Preset Amounts for Quick Entry
export const PRESET_AMOUNTS = [10, 50, 100, 200, 500, 1000] as const

// Preset Categories
export const PRESET_CATEGORIES = [
  'Emergency Fund',
  'Vacation',
  'New Car',
  'Home Down Payment',
  'Retirement',
  'Education',
] as const
