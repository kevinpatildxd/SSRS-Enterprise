/**
 * Database Module
 *
 * Handles all database operations including:
 * - Connection management
 * - CRUD operations for products
 * - Query builders
 *
 * Uses better-sqlite3 for synchronous SQLite operations.
 */

import Database from 'better-sqlite3';
import { Product, ProductInput } from '@/types/product';
import { DB_CONFIG } from './constants';

// Singleton database instance
let db: Database.Database | null = null;

/**
 * Get database connection (singleton pattern)
 * Creates connection on first call, reuses thereafter
 */
export function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_CONFIG.DB_PATH, {
      verbose: process.env.NODE_ENV === 'development' ? console.log : undefined,
    });

    // Enable foreign keys
    db.pragma('foreign_keys = ON');
  }

  return db;
}

/**
 * Generate unique product ID
 * Format: prod_001, prod_002, etc.
 */
export function generateProductId(): string {
  const db = getDb();

  // Get the highest existing ID number
  const result = db
    .prepare(`
      SELECT id FROM products
      ORDER BY id DESC
      LIMIT 1
    `)
    .get() as { id: string } | undefined;

  if (!result) {
    return `${DB_CONFIG.PRODUCT_ID_PREFIX}001`;
  }

  // Extract number from last ID and increment
  const lastNumber = parseInt(result.id.replace(DB_CONFIG.PRODUCT_ID_PREFIX, ''));
  const nextNumber = lastNumber + 1;

  // Pad with zeros (e.g., 001, 002, 010, 100)
  return `${DB_CONFIG.PRODUCT_ID_PREFIX}${nextNumber.toString().padStart(3, '0')}`;
}

/**
 * Get all products
 * @returns Array of all products, sorted by newest first
 */
export function getAllProducts(): Product[] {
  const db = getDb();

  const products = db
    .prepare(`
      SELECT * FROM products
      ORDER BY created_at DESC
    `)
    .all() as Product[];

  return products;
}

/**
 * Get single product by ID
 * @param id - Product ID
 * @returns Product or null if not found
 */
export function getProductById(id: string): Product | null {
  const db = getDb();

  const product = db
    .prepare('SELECT * FROM products WHERE id = ?')
    .get(id) as Product | undefined;

  return product || null;
}

/**
 * Create new product
 * @param input - Product data
 * @returns Created product with generated ID
 */
export function createProduct(input: ProductInput): Product {
  const db = getDb();

  const id = generateProductId();

  const stmt = db.prepare(`
    INSERT INTO products (id, name, price, min_order_qty, image_path)
    VALUES (?, ?, ?, ?, ?)
  `);

  stmt.run(
    id,
    input.name,
    input.price,
    input.min_order_qty,
    input.image_path || null
  );

  // Return the created product
  return getProductById(id)!;
}

/**
 * Update existing product
 * @param id - Product ID
 * @param input - Updated product data
 * @returns Updated product or null if not found
 */
export function updateProduct(
  id: string,
  input: Partial<ProductInput>
): Product | null {
  const db = getDb();

  // Check if product exists
  const existing = getProductById(id);
  if (!existing) return null;

  // Build dynamic update query
  const fields: string[] = [];
  const values: any[] = [];

  if (input.name !== undefined) {
    fields.push('name = ?');
    values.push(input.name);
  }

  if (input.price !== undefined) {
    fields.push('price = ?');
    values.push(input.price);
  }

  if (input.min_order_qty !== undefined) {
    fields.push('min_order_qty = ?');
    values.push(input.min_order_qty);
  }

  if (input.image_path !== undefined) {
    fields.push('image_path = ?');
    values.push(input.image_path);
  }

  if (fields.length === 0) {
    return existing; // No changes
  }

  values.push(id); // Add ID for WHERE clause

  const stmt = db.prepare(`
    UPDATE products
    SET ${fields.join(', ')}
    WHERE id = ?
  `);

  stmt.run(...values);

  return getProductById(id);
}

/**
 * Delete product
 * @param id - Product ID
 * @returns true if deleted, false if not found
 */
export function deleteProduct(id: string): boolean {
  const db = getDb();

  const stmt = db.prepare('DELETE FROM products WHERE id = ?');
  const result = stmt.run(id);

  return result.changes > 0;
}

/**
 * Search products by name
 * @param query - Search query
 * @returns Array of matching products
 */
export function searchProducts(query: string): Product[] {
  const db = getDb();

  const products = db
    .prepare(`
      SELECT * FROM products
      WHERE name LIKE ?
      ORDER BY created_at DESC
    `)
    .all(`%${query}%`) as Product[];

  return products;
}

// Future expansion: Add pagination, filtering, sorting, etc.
// export function getProductsPaginated(page: number, limit: number): {
//   products: Product[];
//   total: number;
//   page: number;
//   totalPages: number;
// } { ... }
