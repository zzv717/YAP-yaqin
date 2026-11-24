-- Run this once in the Neon SQL Editor (choose the production branch).
CREATE TABLE IF NOT EXISTS products (
  id BIGSERIAL PRIMARY KEY,
  category TEXT NOT NULL,
  emoji TEXT NOT NULL DEFAULT '🍱',
  photo TEXT NOT NULL DEFAULT 'p1',
  business TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  price INTEGER NOT NULL CHECK (price > 0),
  old_price INTEGER NOT NULL CHECK (old_price > 0),
  discount TEXT NOT NULL DEFAULT '',
  distance TEXT NOT NULL DEFAULT '1.0 km',
  pickup_time TEXT NOT NULL DEFAULT 'Bugun',
  qty INTEGER NOT NULL DEFAULT 0 CHECK (qty >= 0),
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS orders (
  id BIGSERIAL PRIMARY KEY,
  product_id BIGINT NOT NULL REFERENCES products(id),
  product_name TEXT NOT NULL,
  business TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  price INTEGER NOT NULL CHECK (price > 0),
  status TEXT NOT NULL DEFAULT 'Yangi' CHECK (status IN ('Yangi','Tasdiqlandi','Bekor qilindi')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS orders_created_at_idx ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS products_active_idx ON products(active, category);
INSERT INTO products(category,emoji,photo,business,name,description,price,old_price,discount,distance,pickup_time,qty)
SELECT v.category,v.emoji,v.photo,v.business,v.name,v.description,v.price,v.old_price,v.discount,v.distance,v.pickup_time,v.qty
FROM (VALUES
('bakery','🥐','p1','Bon! · Chilonzor','Kruassan to‘plami','3 ta yangi kruassan · kechki taklif',18000,36000,'−50%','0.4 km','Olib ketish: 19:00–21:00',4),
('cafe','🥗','p2','Green Bowl · Oybek','Fresh lunch box','Salat, donli garnir va sous',29000,49000,'−41%','0.8 km','Olib ketish: 18:30–20:00',3),
('dessert','🍰','p3','Cake Lab · Mirobod','Shirinliklar qutisi','Kunlik desertlardan 4 xil tanlov',35000,62000,'−44%','1.2 km','Olib ketish: 19:30–21:30',2),
('bakery','🥖','p4','Nonvoy · Yakkasaroy','Oilaviy non savati','Non, patir va bulochka aralashmasi',15000,27000,'−44%','1.5 km','Olib ketish: 20:00–21:00',5),
('grocery','🥑','p5','Eco Market · Yunusobod','Sabzavotlar to‘plami','Mavsumiy, saralangan yangi mahsulotlar',22000,40000,'−45%','2.1 km','Olib ketish: 18:00–20:30',3),
('cafe','🍱','p6','Choyxona 24 · Minor','Kechki taom to‘plami','Issiq taom va salat — bugungi menyudan',32000,55000,'−42%','2.4 km','Olib ketish: 19:00–20:30',2)
) AS v(category,emoji,photo,business,name,description,price,old_price,discount,distance,pickup_time,qty)
WHERE NOT EXISTS (SELECT 1 FROM products);
