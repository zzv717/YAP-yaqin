-- Stage 2 customer checkout/tracking fields. Run once in Neon after stage 1.
ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_name TEXT NOT NULL DEFAULT 'Demo mijoz';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS pickup_address TEXT NOT NULL DEFAULT 'Manzil hamkordan aniqlanadi';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS tracking_token TEXT;
UPDATE orders SET tracking_token='legacy-'||id::text WHERE tracking_token IS NULL;
ALTER TABLE orders ALTER COLUMN tracking_token SET NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS orders_tracking_token_idx ON orders(tracking_token);
CREATE TABLE IF NOT EXISTS order_items (
 id BIGSERIAL PRIMARY KEY,
 order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
 product_id BIGINT NOT NULL REFERENCES products(id),
 product_name TEXT NOT NULL,
 business TEXT NOT NULL,
 quantity INTEGER NOT NULL CHECK(quantity>0),
 qty_unit TEXT NOT NULL DEFAULT 'ta',
 unit_price INTEGER NOT NULL CHECK(unit_price>0),
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
INSERT INTO order_items(order_id,product_id,product_name,business,quantity,qty_unit,unit_price)
SELECT o.id,o.product_id,o.product_name,o.business,o.quantity,o.qty_unit,o.price/o.quantity FROM orders o
WHERE NOT EXISTS(SELECT 1 FROM order_items i WHERE i.order_id=o.id);
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check;
ALTER TABLE orders ADD CONSTRAINT orders_status_check CHECK (status IN ('Yangi','Tasdiqlandi','Olib ketildi','Bekor qilindi'));
