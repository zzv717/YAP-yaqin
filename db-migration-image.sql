-- Run once in Neon SQL Editor to add image URLs to existing products.
ALTER TABLE products ADD COLUMN IF NOT EXISTS image_url TEXT;
