/**
 * Database Module
 *
 * Handles all database operations including:
 * - Connection management
 * - CRUD operations for products
 * - Query builders
 *
 * Uses Turso (@libsql/client) for serverless SQLite operations.
 */

import { createClient, Client } from '@libsql/client';
import { Product, ProductInput } from '@/types/product';
import { DB_CONFIG } from './constants';

// Singleton database instance
let db: Client | null = null;

/**
 * Get database connection (singleton pattern)
 * Creates connection on first call, reuses thereafter
 */
export function getDb(): Client {
  if (!db) {
    if (!process.env.TURSO_DATABASE_URL || !process.env.TURSO_AUTH_TOKEN) {
      throw new Error(
        'Missing Turso environment variables. Please set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN in .env.local'
      );
    }

    db = createClient({
      url: process.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
  }

  return db;
}

/**
 * Generate unique product ID
 * Format: prod_001, prod_002, etc.
 */
export async function generateProductId(): Promise<string> {
  const db = getDb();

  // Get the highest existing ID number
  const result = await db.execute(`
    SELECT id FROM products
    ORDER BY id DESC
    LIMIT 1
  `);

  if (!result.rows || result.rows.length === 0) {
    return `${DB_CONFIG.PRODUCT_ID_PREFIX}001`;
  }

  const lastId = result.rows[0].id as string;

  // Extract number from last ID and increment
  const lastNumber = parseInt(lastId.replace(DB_CONFIG.PRODUCT_ID_PREFIX, ''));
  const nextNumber = lastNumber + 1;

  // Pad with zeros (e.g., 001, 002, 010, 100)
  return `${DB_CONFIG.PRODUCT_ID_PREFIX}${nextNumber.toString().padStart(3, '0')}`;
}

/**
 * Get all products
 * @returns Array of all products, sorted by newest first
 */
export async function getAllProducts(): Promise<Product[]> {
  const db = getDb();

  const result = await db.execute(`
    SELECT * FROM products
    ORDER BY created_at DESC
  `);

  return result.rows as unknown as Product[];
}

/**
 * Get single product by ID
 * @param id - Product ID
 * @returns Product or null if not found
 */
export async function getProductById(id: string): Promise<Product | null> {
  const db = getDb();

  const result = await db.execute({
    sql: 'SELECT * FROM products WHERE id = ?',
    args: [id],
  });

  if (!result.rows || result.rows.length === 0) {
    return null;
  }

  return result.rows[0] as unknown as Product;
}

/**
 * Create new product
 * @param input - Product data
 * @returns Created product with generated ID
 */
export async function createProduct(input: ProductInput): Promise<Product> {
  const db = getDb();

  const id = await generateProductId();

  await db.execute({
    sql: `
      INSERT INTO products (id, name, price, min_order_qty, image_path)
      VALUES (?, ?, ?, ?, ?)
    `,
    args: [
      id,
      input.name,
      input.price,
      input.min_order_qty,
      input.image_path || null,
    ],
  });

  // Return the created product
  const product = await getProductById(id);
  if (!product) {
    throw new Error('Failed to create product');
  }
  return product;
}

/**
 * Update existing product
 * @param id - Product ID
 * @param input - Updated product data
 * @returns Updated product or null if not found
 */
export async function updateProduct(
  id: string,
  input: Partial<ProductInput>
): Promise<Product | null> {
  const db = getDb();

  // Check if product exists
  const existing = await getProductById(id);
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

  await db.execute({
    sql: `
      UPDATE products
      SET ${fields.join(', ')}
      WHERE id = ?
    `,
    args: values,
  });

  return getProductById(id);
}

/**
 * Delete product
 * @param id - Product ID
 * @returns true if deleted, false if not found
 */
export async function deleteProduct(id: string): Promise<boolean> {
  const db = getDb();

  const result = await db.execute({
    sql: 'DELETE FROM products WHERE id = ?',
    args: [id],
  });

  return result.rowsAffected > 0;
}

/**
 * Search products by name
 * @param query - Search query
 * @returns Array of matching products
 */
export async function searchProducts(query: string): Promise<Product[]> {
  const db = getDb();

  const result = await db.execute({
    sql: `
      SELECT * FROM products
      WHERE name LIKE ?
      ORDER BY created_at DESC
    `,
    args: [`%${query}%`],
  });

  return result.rows as unknown as Product[];
}

// Future expansion: Add pagination, filtering, sorting, etc.
// export function getProductsPaginated(page: number, limit: number): {
//   products: Product[];
//   total: number;
//   page: number;
//   totalPages: number;
// } { ... }
