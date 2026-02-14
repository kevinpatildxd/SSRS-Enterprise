/**
 * Product Type Definitions
 *
 * These types ensure type safety across the application
 * and make it easy to add new fields in the future.
 */

/**
 * Main Product interface
 * Represents a product in the system
 */
export interface Product {
  /** Unique product identifier (e.g., 'prod_001') */
  id: string;

  /** Product name */
  name: string;

  /** Product price (in your currency) */
  price: number;

  /** Minimum order quantity (flexible text input) */
  min_order_qty: string;

  /** Path to product image (relative to /public) */
  image_path: string | null;

  /** ISO timestamp when product was created */
  created_at: string;

  /** ISO timestamp when product was last updated */
  updated_at: string;
}

/**
 * Product creation input (without auto-generated fields)
 * Used when creating new products via API
 */
export interface ProductInput {
  name: string;
  price: number;
  min_order_qty: string;
  image_path?: string | null;
}

/**
 * Product update input (all fields optional)
 * Used when updating existing products
 */
export interface ProductUpdate {
  name?: string;
  price?: number;
  min_order_qty?: string;
  image_path?: string | null;
}

// Future expansion: Add product variants, inventory, etc.
// export interface ProductVariant {
//   id: string;
//   product_id: string;
//   sku: string;
//   size?: string;
//   color?: string;
//   stock_quantity: number;
// }

// export interface ProductCategory {
//   id: string;
//   name: string;
//   description?: string;
// }
