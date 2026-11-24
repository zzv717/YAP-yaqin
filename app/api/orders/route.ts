import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';
export const runtime = 'nodejs';
export async function POST(request: Request) {
  if (!process.env.DATABASE_URL) return NextResponse.json({ error: 'DATABASE_URL sozlanmagan' }, { status: 503 });
  let body: { productId?: number; phone?: string };
  try { body = await request.json(); } catch { return NextResponse.json({ error: 'So‘rov formati noto‘g‘ri' }, { status: 400 }); }
  const productId = Number(body.productId);
  const phone = String(body.phone || '').trim();
  if (!Number.isSafeInteger(productId) || productId < 1 || phone.replace(/\D/g, '').length < 9 || phone.length > 32) {
    return NextResponse.json({ error: 'Mahsulot yoki telefon raqami noto‘g‘ri' }, { status: 400 });
  }
  try {
    const sql = neon(process.env.DATABASE_URL);
    const rows = await sql`WITH reserved AS (
      UPDATE products SET qty = qty - 1 WHERE id = ${productId} AND active = true AND qty > 0
      RETURNING id, name, business, price
    ), created AS (
      INSERT INTO orders(product_id, product_name, business, customer_phone, price)
      SELECT id, name, business, ${phone}, price FROM reserved
      RETURNING id, product_id, product_name, business, customer_phone, price, status, created_at
    ) SELECT * FROM created`;
    if (!rows.length) return NextResponse.json({ error: 'Taklif tugagan yoki topilmadi' }, { status: 409 });
    return NextResponse.json(rows[0], { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Buyurtma saqlanmadi. Baza sozlamasini tekshiring.' }, { status: 503 });
  }
}
