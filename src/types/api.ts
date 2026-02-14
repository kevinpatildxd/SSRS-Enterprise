/**
 * API Response Type Definitions
 *
 * Standardized response formats for all API endpoints
 */

import { Product } from './product';

/**
 * Generic success response
 */
export interface ApiResponse<T = any> {
  success: true;
  data: T;
  message?: string;
}

/**
 * Generic error response
 */
export interface ApiError {
  success: false;
  error: string;
  details?: any;
}

/**
 * Image upload response
 */
export interface ImageUploadResponse {
  success: true;
  data: {
    /** Path to uploaded image */
    imagePath: string;
    /** Original filename */
    originalName: string;
    /** File size in bytes */
    size: number;
  };
}

/**
 * Product list response
 */
export interface ProductListResponse {
  success: true;
  data: {
    products: Product[];
    total: number;
  };
}

/**
 * Type guard to check if response is an error
 */
export function isApiError(response: any): response is ApiError {
  return response.success === false;
}
