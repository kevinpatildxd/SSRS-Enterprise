-- Products table
-- Stores all product information including name, price, and image path
CREATE TABLE IF NOT EXISTS products (
  -- Unique identifier for each product (e.g., 'prod_001')
  id TEXT PRIMARY KEY,

  -- Product name (required)
  name TEXT NOT NULL,

  -- Product price (required, stored as REAL for decimal support)
  price REAL NOT NULL CHECK(price >= 0),

  -- Minimum order quantity (required, must be positive integer)
  min_order_qty INTEGER NOT NULL CHECK(min_order_qty > 0),

  -- Path to product image (relative to /public)
  -- Example: '/images/products/prod_001.jpg'
  image_path TEXT,

  -- Timestamp when product was created
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  -- Timestamp when product was last updated
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Index on created_at for faster sorting by newest products
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);

-- Trigger to automatically update updated_at timestamp
CREATE TRIGGER IF NOT EXISTS update_products_timestamp
AFTER UPDATE ON products
BEGIN
  UPDATE products SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- Optional: Categories table for future expansion
-- Uncomment when ready to add product categories
-- CREATE TABLE IF NOT EXISTS categories (
--   id TEXT PRIMARY KEY,
--   name TEXT NOT NULL UNIQUE,
--   description TEXT,
--   created_at DATETIME DEFAULT CURRENT_TIMESTAMP
-- );

-- Optional: Product-Category relationship for future expansion
-- Uncomment when ready to add product categories
-- CREATE TABLE IF NOT EXISTS product_categories (
--   product_id TEXT REFERENCES products(id) ON DELETE CASCADE,
--   category_id TEXT REFERENCES categories(id) ON DELETE CASCADE,
--   PRIMARY KEY (product_id, category_id)
-- );
