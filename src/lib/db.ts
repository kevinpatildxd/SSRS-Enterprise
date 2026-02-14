/**
 * Database Module
 *
 * Handles all database operations including:
 * - Connection management with retry logic
 * - CRUD operations for products
 * - Schema initialization
 * - Error recovery
 *
 * Uses Turso (@libsql/client) for serverless SQLite operations.
 */

import { createClient, Client } from '@libsql/client';
import { Product, ProductInput } from '@/types/product';
import { DB_CONFIG } from './constants';

// Singleton database instance
let db: Client | null = null;
let connectionAttempts = 0;
const MAX_CONNECTION_ATTEMPTS = 3;

/**
 * Check if required environment variables are set
 */
function checkEnvironmentVariables(): { valid: boolean; missing: string[] } {
  const missing: string[] = [];
  
  if (!process.env.TURSO_DATABASE_URL) {
    missing.push('TURSO_DATABASE_URL');
  }
  if (!process.env.TURSO_AUTH_TOKEN) {
    missing.push('TURSO_AUTH_TOKEN');
  }
  
  return {
    valid: missing.length === 0,
    missing,
  };
}

/**
 * Get database connection (singleton pattern with retry)
 * Creates connection on first call, reuses thereafter
 */
export function getDb(): Client {
  if (db) {
    return db;
  }

  const envCheck = checkEnvironmentVariables();
  
  if (!envCheck.valid) {
    throw new Error(
      `Missing required environment variables: ${envCheck.missing.join(', ')}. ` +
      'Please set these in .env.local file.'
    );
  }

  try {
    connectionAttempts++;
    
    db = createClient({
      url: process.env.TURSO_DATABASE_URL!,
      authToken: process.env.TURSO_AUTH_TOKEN!,
    });

    console.log('Database connection established successfully');
    connectionAttempts = 0; // Reset on success
    
    return db;
  } catch (error) {
    console.error(`Database connection attempt ${connectionAttempts} failed:`, error);
    
    if (connectionAttempts < MAX_CONNECTION_ATTEMPTS) {
      console.log(`Retrying database connection (attempt ${connectionAttempts + 1}/${MAX_CONNECTION_ATTEMPTS})...`);
      // Wait a bit before retry
      const delay = Math.min(1000 * connectionAttempts, 3000);
      setTimeout(() => {}, delay);
      return getDb();
    }
    
    connectionAttempts = 0;
    throw new Error(
      'Failed to connect to database after multiple attempts. ' +
      'Please check your database credentials and network connection.'
    );
  }
}

/**
 * Reset database connection (useful for error recovery)
 */
export function resetDbConnection(): void {
  db = null;
  connectionAttempts = 0;
  console.log('Database connection reset');
}

/**
 * Test database connection
 * @returns true if connection is successful, false otherwise
 */
export async function testConnection(): Promise<boolean> {
  try {
    const database = getDb();
    await database.execute('SELECT 1');
    return true;
  } catch (error) {
    console.error('Database connection test failed:', error);
    return false;
  }
}

/**
 * Initialize database schema
 * Creates products table if it doesn't exist
 */
export async function initializeSchema(): Promise<void> {
  try {
    const database = getDb();
    
    await database.execute(`
      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        price REAL NOT NULL,
        min_order_qty TEXT NOT NULL,
        image_path TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    console.log('Database schema initialized successfully');
  } catch (error) {
    console.error('Failed to initialize database schema:', error);
    throw new Error('Failed to initialize database schema');
  }
}

/**
 * Generate unique product ID
 * Format: prod_001, prod_002, etc.
 */
export async function generateProductId(): Promise<string> {
  try {
    const database = getDb();

    // Get the highest existing ID number
    const result = await database.execute(`
      SELECT id FROM products
      ORDER BY id DESC
      LIMIT 1
    `);

    if (!result.rows || result.rows.length === 0) {
      return `${DB_CONFIG.PRODUCT_ID_PREFIX}001`;
    }

    const lastId = result.rows[0].id as string;

    // Extract number from last ID and increment
    const match = lastId.match(/\d+/);
    if (!match) {
      return `${DB_CONFIG.PRODUCT_ID_PREFIX}001`;
    }
    
    const lastNumber = parseInt(match[0]);
    const nextNumber = lastNumber + 1;

    // Pad with zeros (e.g., 001, 002, 010, 100)
    return `${DB_CONFIG.PRODUCT_ID_PREFIX}${nextNumber.toString().padStart(3, '0')}`;
  } catch (error) {
    console.error('Error generating product ID:', error);
    // Fallback to timestamp-based ID
    return `${DB_CONFIG.PRODUCT_ID_PREFIX}${Date.now()}`;
  }
}

/**
 * Get all products
 * @returns Array of all products, sorted by newest first
 */
export async function getAllProducts(): Promise<Product[]> {
  try {
    const database = getDb();

    const result = await database.execute(`
      SELECT * FROM products
      ORDER BY created_at DESC
    `);

    return result.rows.map(row => ({
      id: String(row.id),
      name: String(row.name),
      price: Number(row.price),
      min_order_qty: String(row.min_order_qty),
      image_path: row.image_path ? String(row.image_path) : null,
      created_at: String(row.created_at || ''),
      updated_at: String(row.updated_at || row.created_at || ''),
    })) as Product[];
  } catch (error) {
    console.error('Error fetching all products:', error);
    throw new Error('Failed to fetch products from database');
  }
}

/**
 * Get single product by ID
 * @param id - Product ID
 * @returns Product or null if not found
 */
export async function getProductById(id: string): Promise<Product | null> {
  if (!id || typeof id !== 'string') {
    return null;
  }

  try {
    const database = getDb();

    const result = await database.execute({
      sql: 'SELECT * FROM products WHERE id = ?',
      args: [id],
    });

    if (!result.rows || result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return {
      id: String(row.id),
      name: String(row.name),
      price: Number(row.price),
      min_order_qty: String(row.min_order_qty),
      image_path: row.image_path ? String(row.image_path) : null,
      created_at: String(row.created_at || ''),
      updated_at: String(row.updated_at || row.created_at || ''),
    } as Product;
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    throw new Error(`Failed to fetch product ${id}`);
  }
}

/**
 * Create new product
 * @param input - Product data
 * @returns Created product with generated ID
 */
export async function createProduct(input: ProductInput): Promise<Product> {
  if (!input || typeof input !== 'object') {
    throw new Error('Invalid product input');
  }

  if (!input.name || input.price === undefined || input.price === null) {
    throw new Error('Product name and price are required');
  }

  try {
    const database = getDb();
    const id = await generateProductId();

    await database.execute({
      sql: `
        INSERT INTO products (id, name, price, min_order_qty, image_path)
        VALUES (?, ?, ?, ?, ?)
      `,
      args: [
        id,
        input.name.trim(),
        input.price,
        input.min_order_qty?.trim() || '',
        input.image_path || null,
      ],
    });

    // Return the created product
    const product = await getProductById(id);
    if (!product) {
      throw new Error('Product was created but could not be retrieved');
    }
    
    console.log('Product created successfully:', product.id);
    return product;
  } catch (error) {
    console.error('Error creating product:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to create product in database');
  }
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
  if (!id || typeof id !== 'string') {
    return null;
  }

  try {
    const database = getDb();

    // Check if product exists
    const existing = await getProductById(id);
    if (!existing) return null;

    // Build dynamic update query
    const fields: string[] = [];
    const values: (string | number | null)[] = [];

    if (input.name !== undefined) {
      fields.push('name = ?');
      values.push(input.name.trim());
    }

    if (input.price !== undefined) {
      fields.push('price = ?');
      values.push(input.price);
    }

    if (input.min_order_qty !== undefined) {
      fields.push('min_order_qty = ?');
      values.push(input.min_order_qty.trim());
    }

    if (input.image_path !== undefined) {
      fields.push('image_path = ?');
      values.push(input.image_path);
    }

    if (fields.length === 0) {
      return existing; // No changes
    }

    values.push(id); // Add ID for WHERE clause

    await database.execute({
      sql: `
        UPDATE products
        SET ${fields.join(', ')}
        WHERE id = ?
      `,
      args: values,
    });

    console.log('Product updated successfully:', id);
    return getProductById(id);
  } catch (error) {
    console.error(`Error updating product ${id}:`, error);
    throw new Error(`Failed to update product ${id}`);
  }
}

/**
 * Delete product
 * @param id - Product ID
 * @returns true if deleted, false if not found
 */
export async function deleteProduct(id: string): Promise<boolean> {
  if (!id || typeof id !== 'string') {
    return false;
  }

  try {
    const database = getDb();

    const result = await database.execute({
      sql: 'DELETE FROM products WHERE id = ?',
      args: [id],
    });

    const deleted = result.rowsAffected > 0;
    if (deleted) {
      console.log('Product deleted successfully:', id);
    }
    
    return deleted;
  } catch (error) {
    console.error(`Error deleting product ${id}:`, error);
    throw new Error(`Failed to delete product ${id}`);
  }
}

/**
 * Get product image path before deletion
 * Useful for cleaning up images
 * @param id - Product ID
 * @returns image_path or null
 */
export async function getProductImagePath(id: string): Promise<string | null> {
  if (!id || typeof id !== 'string') {
    return null;
  }

  try {
    const product = await getProductById(id);
    return product?.image_path || null;
  } catch (error) {
    console.error(`Error fetching image path for product ${id}:`, error);
    return null;
  }
}

/**
 * Search products by name
 * @param query - Search query
 * @returns Array of matching products
 */
export async function searchProducts(query: string): Promise<Product[]> {
  if (!query || typeof query !== 'string') {
    return [];
  }

  try {
    const database = getDb();

    const result = await database.execute({
      sql: `
        SELECT * FROM products
        WHERE name LIKE ?
        ORDER BY created_at DESC
      `,
      args: [`%${query.trim()}%`],
    });

    return result.rows.map(row => ({
      id: String(row.id),
      name: String(row.name),
      price: Number(row.price),
      min_order_qty: String(row.min_order_qty),
      image_path: row.image_path ? String(row.image_path) : null,
      created_at: String(row.created_at || ''),
      updated_at: String(row.updated_at || row.created_at || ''),
    })) as Product[];
  } catch (error) {
    console.error('Error searching products:', error);
    throw new Error('Failed to search products');
  }
}

/**
 * Get total product count
 * @returns Number of products
 */
export async function getProductCount(): Promise<number> {
  try {
    const database = getDb();

    const result = await database.execute('SELECT COUNT(*) as count FROM products');
    
    if (!result.rows || result.rows.length === 0) {
      return 0;
    }
    
    return Number(result.rows[0].count) || 0;
  } catch (error) {
    console.error('Error counting products:', error);
    return 0;
  }
}
