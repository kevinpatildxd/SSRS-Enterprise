/**
 * Application Constants
 *
 * Centralized configuration values used across the app.
 * Change these values to customize application behavior.
 */

/**
 * Image upload settings
 */
export const IMAGE_CONFIG = {
  /** Maximum file size in bytes (5MB) */
  MAX_FILE_SIZE: 5 * 1024 * 1024,

  /** Allowed MIME types */
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp'],

  /** Image quality for compression (0-100) */
  QUALITY: 80,

  /** Maximum image width in pixels */
  MAX_WIDTH: 1200,

  /** Maximum image height in pixels */
  MAX_HEIGHT: 1200,

  /** Thumbnail width */
  THUMBNAIL_WIDTH: 300,
} as const;

/**
 * Product settings
 */
export const PRODUCT_CONFIG = {
  /** Maximum product name length */
  MAX_NAME_LENGTH: 100,

  /** Minimum price */
  MIN_PRICE: 0,

  /** Maximum price */
  MAX_PRICE: 1000000,

  /** Minimum order quantity */
  MIN_ORDER_QTY: 1,

  /** Maximum order quantity */
  MAX_ORDER_QTY: 10000,
} as const;

/**
 * UI settings
 */
export const UI_CONFIG = {
  /** Products per page (for future pagination) */
  PRODUCTS_PER_PAGE: 12,

  /** Grid columns on different screens */
  GRID_COLUMNS: {
    mobile: 1,
    tablet: 2,
    desktop: 3,
    wide: 4,
  },
} as const;

/**
 * Database settings
 */
export const DB_CONFIG = {
  /** Path to database file */
  DB_PATH: process.env.DATABASE_PATH || './database/products.db',

  /** Product ID prefix */
  PRODUCT_ID_PREFIX: 'prod_',
} as const;
