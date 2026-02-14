/**
 * Database Initialization Script for Turso
 *
 * This script:
 * 1. Connects to your Turso database
 * 2. Runs the schema.sql to create tables
 * 3. Checks for existing data
 *
 * Run with: npm run db:init
 *
 * Prerequisites:
 * - Set TURSO_DATABASE_URL in .env.local
 * - Set TURSO_AUTH_TOKEN in .env.local
 */

import { createClient } from '@libsql/client';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const SCHEMA_PATH = path.join(__dirname, 'schema.sql');

async function initDatabase() {
  console.log('🚀 Initializing Turso database...');

  try {
    // Check environment variables
    if (!process.env.TURSO_DATABASE_URL || !process.env.TURSO_AUTH_TOKEN) {
      throw new Error(
        'Missing Turso credentials. Please set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN in .env.local'
      );
    }

    // Create database connection
    const db = createClient({
      url: process.env.TURSO_DATABASE_URL,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });

    console.log('✅ Connected to Turso database');

    // Read schema file
    const schema = fs.readFileSync(SCHEMA_PATH, 'utf-8');

    // Execute schema creation statements individually
    // Turso handles each statement separately

    // Create products table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        price REAL NOT NULL CHECK(price >= 0),
        min_order_qty TEXT NOT NULL,
        image_path TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create index
    await db.execute(`
      CREATE INDEX IF NOT EXISTS idx_products_created_at
      ON products(created_at DESC)
    `);

    // Create trigger for updated_at
    await db.execute(`
      CREATE TRIGGER IF NOT EXISTS update_products_timestamp
      AFTER UPDATE ON products
      BEGIN
        UPDATE products SET updated_at = CURRENT_TIMESTAMP
        WHERE id = NEW.id;
      END
    `);

    console.log('✅ Database tables created successfully');

    // Check for existing data
    const result = await db.execute('SELECT COUNT(*) as count FROM products');
    const count = result.rows[0].count as number;

    if (count === 0) {
      console.log('📦 Database is empty (no initial data seeded)');
      console.log('💡 Add products through the admin panel at /admin');

      // Uncomment to seed sample products
      // await db.execute({
      //   sql: `INSERT INTO products (id, name, price, min_order_qty, image_path)
      //         VALUES (?, ?, ?, ?, ?)`,
      //   args: ['prod_001', 'Sample Product 1', 99.99, '10', '/images/placeholder.png']
      // });
      // console.log('✅ Sample data seeded');
    } else {
      console.log(`ℹ️  Database already contains ${count} product(s)`);
    }

    console.log('✅ Database initialization complete!');
    console.log(`📍 Database: ${process.env.TURSO_DATABASE_URL}`);

  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
}

// Run initialization
initDatabase();
