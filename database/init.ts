/**
 * Database Initialization Script
 *
 * This script:
 * 1. Creates the SQLite database file if it doesn't exist
 * 2. Runs the schema.sql to create tables
 * 3. Optionally seeds initial data
 *
 * Run with: npm run db:init
 */

import Database from 'better-sqlite3';
import * as fs from 'fs';
import * as path from 'path';

// Database file path
const DB_PATH = path.join(__dirname, 'products.db');
const SCHEMA_PATH = path.join(__dirname, 'schema.sql');

async function initDatabase() {
  console.log('🚀 Initializing database...');

  try {
    // Create database connection
    const db = new Database(DB_PATH, { verbose: console.log });

    // Read schema file
    const schema = fs.readFileSync(SCHEMA_PATH, 'utf-8');

    // Execute schema (create tables)
    db.exec(schema);

    console.log('✅ Database tables created successfully');

    // Optional: Seed initial data
    const count = db.prepare('SELECT COUNT(*) as count FROM products').get() as { count: number };

    if (count.count === 0) {
      console.log('📦 Database is empty (no initial data seeded)');
      console.log('💡 Add products through the admin panel at /admin');

      // Uncomment to seed sample products
      // const insert = db.prepare(`
      //   INSERT INTO products (id, name, price, min_order_qty, image_path)
      //   VALUES (?, ?, ?, ?, ?)
      // `);
      // insert.run('prod_001', 'Sample Product 1', 99.99, 10, '/images/placeholder.png');
      // insert.run('prod_002', 'Sample Product 2', 149.99, 5, '/images/placeholder.png');
      // console.log('✅ Sample data seeded');
    } else {
      console.log(`ℹ️  Database already contains ${count.count} product(s)`);
    }

    // Close connection
    db.close();

    console.log('✅ Database initialization complete!');
    console.log(`📍 Database location: ${DB_PATH}`);

  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
}

// Run initialization
initDatabase();
