/**
 * Validation Utilities
 *
 * Functions to validate user input and ensure data integrity.
 * Add custom validation rules here as needed.
 */

import { PRODUCT_CONFIG, IMAGE_CONFIG } from './constants';

/**
 * Validation error class
 */
export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

/**
 * Validate product name
 * @throws {ValidationError} If name is invalid
 */
export function validateProductName(name: string): void {
  if (!name || name.trim().length === 0) {
    throw new ValidationError('Product name is required');
  }

  if (name.length > PRODUCT_CONFIG.MAX_NAME_LENGTH) {
    throw new ValidationError(
      `Product name must be less than ${PRODUCT_CONFIG.MAX_NAME_LENGTH} characters`
    );
  }
}

/**
 * Validate product price
 * @throws {ValidationError} If price is invalid
 */
export function validateProductPrice(price: number): void {
  if (typeof price !== 'number' || isNaN(price)) {
    throw new ValidationError('Price must be a valid number');
  }

  if (price < PRODUCT_CONFIG.MIN_PRICE) {
    throw new ValidationError(`Price must be at least ${PRODUCT_CONFIG.MIN_PRICE}`);
  }

  if (price > PRODUCT_CONFIG.MAX_PRICE) {
    throw new ValidationError(`Price cannot exceed ${PRODUCT_CONFIG.MAX_PRICE}`);
  }
}

/**
 * Validate minimum order quantity
 * @throws {ValidationError} If quantity is invalid
 */
export function validateMinOrderQty(qty: string): void {
  if (!qty || qty.trim().length === 0) {
    throw new ValidationError('Minimum order quantity is required');
  }

  if (qty.length > 100) {
    throw new ValidationError('Minimum order quantity must be less than 100 characters');
  }
}

/**
 * Validate image file
 * @throws {ValidationError} If file is invalid
 */
export function validateImageFile(file: File): void {
  // Check file exists
  if (!file) {
    throw new ValidationError('No file provided');
  }

  // Check file size
  if (file.size > IMAGE_CONFIG.MAX_FILE_SIZE) {
    const maxSizeMB = IMAGE_CONFIG.MAX_FILE_SIZE / (1024 * 1024);
    throw new ValidationError(`File size must be less than ${maxSizeMB}MB`);
  }

  // Check file type
  if (!(IMAGE_CONFIG.ALLOWED_TYPES as readonly string[]).includes(file.type)) {
    throw new ValidationError(
      `File type must be one of: ${IMAGE_CONFIG.ALLOWED_TYPES.join(', ')}`
    );
  }
}

/**
 * Validate complete product input
 * @throws {ValidationError} If any field is invalid
 */
export function validateProductInput(input: {
  name: string;
  price: number;
  min_order_qty: string;
}): void {
  validateProductName(input.name);
  validateProductPrice(input.price);
  validateMinOrderQty(input.min_order_qty);
}
