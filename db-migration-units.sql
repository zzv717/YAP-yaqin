-- Run once in Neon SQL Editor to add product/order stock units.
ALTER TABLE products ADD COLUMN IF NOT EXISTS qty_unit TEXT NOT NULL DEFAULT 'ta';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS qty_unit TEXT NOT NULL DEFAULT 'ta';
