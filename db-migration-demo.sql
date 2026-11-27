-- Stage 1 demo seed. All stores/products below are fictional and explicitly marked NAMUNA/DEMO.
CREATE TABLE IF NOT EXISTS stores (
 id BIGSERIAL PRIMARY KEY,
 name TEXT NOT NULL UNIQUE,
 address TEXT NOT NULL,
 phone TEXT NOT NULL,
 rating NUMERIC(2,1) NOT NULL DEFAULT 0,
 is_demo BOOLEAN NOT NULL DEFAULT FALSE,
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE products ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS qty_unit TEXT NOT NULL DEFAULT 'ta';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS qty_unit TEXT NOT NULL DEFAULT 'ta';
ALTER TABLE products ADD COLUMN IF NOT EXISTS store_id BIGINT REFERENCES stores(id);
ALTER TABLE products ADD COLUMN IF NOT EXISTS expires_on DATE;
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_demo BOOLEAN NOT NULL DEFAULT FALSE;

INSERT INTO stores(name,address,phone,rating,is_demo) VALUES
('[DEMO] Nonvoyxona Ko‘rchi','Chilonzor tumani, Toshkent — NAMUNA','+998 00 000 00 01',4.8,TRUE),
('[DEMO] Shirinliklar uyi','Mirobod tumani, Toshkent — NAMUNA','+998 00 000 00 02',4.7,TRUE),
('[DEMO] Kafe Mazali','Yunusobod tumani, Toshkent — NAMUNA','+998 00 000 00 03',4.6,TRUE),
('[DEMO] Yangi bozor mini-market','Yakkasaroy tumani, Toshkent — NAMUNA','+998 00 000 00 04',4.5,TRUE)
ON CONFLICT (name) DO NOTHING;

-- Replace only the six original seed rows by their exact known names/businesses.
UPDATE products p SET
 category=v.category, emoji=v.emoji, photo=v.photo, image_url=v.image_url,
 business=s.name, store_id=s.id, name=v.new_name, description=v.description,
 price=v.price, old_price=v.old_price, discount=v.discount, distance=v.distance,
 pickup_time=v.pickup_time, qty=v.qty, qty_unit=v.qty_unit,
 expires_on=CURRENT_DATE+v.expiry_days, is_demo=TRUE
FROM (VALUES
 ('Kruassan to‘plami','bakery','🥐','p1','/demo/bakery-croissants.webp','Kruassanlar to‘plami','3 dona yangi kruassan — demo taklif',18000,36000,'−50%','0.4 km','Olib ketish: 18:00–21:00',6,'ta','[DEMO] Nonvoyxona Ko‘rchi',1),
 ('Fresh lunch box','cafe','🥗','p2','/demo/cafe-salad.webp','Yengil tushlik salati','Salat va sous — demo taklif',29000,49000,'−41%','0.8 km','Olib ketish: 12:00–18:00',3,'porsiya','[DEMO] Kafe Mazali',1),
 ('Shirinliklar qutisi','dessert','🍰','p3','/demo/dessert-cake.webp','Shirinliklar qutisi','Kunlik desertlardan namunaviy to‘plam',35000,62000,'−44%','1.2 km','Olib ketish: 17:00–21:00',2,'quti','[DEMO] Shirinliklar uyi',2),
 ('Oilaviy non savati','bakery','🥖','p4','/demo/bakery-pastries.webp','Oilaviy non savati','Non va patir — demo taklif',15000,27000,'−44%','1.5 km','Olib ketish: 19:00–21:00',5,'quti','[DEMO] Nonvoyxona Ko‘rchi',0),
 ('Sabzavotlar to‘plami','grocery','🥑','p5','/demo/grocery-veggies.webp','Mavsumiy sabzavotlar','Tanlangan sabzavotlar — demo taklif',22000,40000,'−45%','2.1 km','Olib ketish: 10:00–20:00',3,'kg','[DEMO] Yangi bozor mini-market',2),
 ('Kechki taom to‘plami','cafe','🍱','p6','/demo/cafe-plov.webp','Kechki taom to‘plami','Issiq taom — demo taklif',32000,55000,'−42%','2.4 km','Olib ketish: 18:00–20:30',2,'quti','[DEMO] Kafe Mazali',0)
) AS v(old_name,category,emoji,photo,image_url,new_name,description,price,old_price,discount,distance,pickup_time,qty,qty_unit,store_name,expiry_days)
JOIN stores s ON s.name=v.store_name
WHERE p.name=v.old_name AND p.is_demo=FALSE
  AND p.business IN ('Bon! · Chilonzor','Green Bowl · Oybek','Cake Lab · Mirobod','Nonvoy · Yakkasaroy','Eco Market · Yunusobod','Choyxona 24 · Minor');

INSERT INTO products(category,emoji,photo,image_url,business,store_id,name,description,price,old_price,discount,distance,pickup_time,qty,qty_unit,expires_on,is_demo)
SELECT v.category,v.emoji,v.photo,v.image_url,s.name,s.id,v.name,v.description,v.price,v.old_price,v.discount,v.distance,v.pickup_time,v.qty,v.qty_unit,CURRENT_DATE+v.expiry_days,TRUE
FROM (VALUES
 ('bakery','🥯','p1','/demo/bakery-croissants.webp','Patir va bulochka savati','Non mahsulotlaridan demo paket',16000,28000,'−43%','0.9 km','Olib ketish: 18:00–21:00',4,'quti','[DEMO] Nonvoyxona Ko‘rchi',1),
 ('dessert','🍰','p3','/demo/dessert-slices.webp','Tort bo‘laklari','2 dona tort bo‘lagi — demo',25000,42000,'−40%','1.1 km','Olib ketish: 17:00–21:00',3,'porsiya','[DEMO] Shirinliklar uyi',1),
 ('dessert','🧁','p3','/demo/dessert-chocolate.webp','Muffinlar qutisi','4 dona muffin — demo',24000,40000,'−40%','1.3 km','Olib ketish: 17:00–20:00',2,'quti','[DEMO] Shirinliklar uyi',2),
 ('grocery','🍎','p5','/demo/grocery-fruit.webp','Mavsumiy mevalar','Meva savati — demo taklif',27000,45000,'−40%','1.7 km','Olib ketish: 10:00–20:00',5,'kg','[DEMO] Yangi bozor mini-market',3),
 ('grocery','🍏','p5','/demo/grocery-fruit-2.webp','Olma va nok savati','Mahalliy mevalar — demo',20000,34000,'−41%','1.9 km','Olib ketish: 10:00–19:00',4,'kg','[DEMO] Yangi bozor mini-market',2),
 ('cafe','🥗','p2','/demo/cafe-salad.webp','Sabzavotli salat','Yangi tayyorlangan salat — demo',26000,43000,'−40%','0.6 km','Olib ketish: 12:00–18:00',3,'porsiya','[DEMO] Kafe Mazali',0)
) AS v(category,emoji,photo,image_url,name,description,price,old_price,discount,distance,pickup_time,qty,qty_unit,store_name,expiry_days)
JOIN stores s ON s.name=v.store_name
WHERE NOT EXISTS (SELECT 1 FROM products p WHERE p.name=v.name AND p.is_demo=TRUE);
