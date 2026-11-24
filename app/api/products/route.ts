import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';
export const runtime = 'nodejs';
export async function GET() {
  if (!process.env.DATABASE_URL) return NextResponse.json({ error: 'DATABASE_URL sozlanmagan' }, { status: 503 });
  try {
    const sql = neon(process.env.DATABASE_URL);
    const rows = await sql`SELECT id, category AS cat, emoji, photo, business, name, description AS desc, price, old_price AS old, discount, distance, pickup_time AS time, qty FROM products WHERE active = true AND qty > 0 ORDER BY id`;
    return NextResponse.json(rows);
  } catch {
    return NextResponse.json({ error: 'Baza tayyor emas. Neon SQL Editor’da db-schema.sql ni bajaring.' }, { status: 503 });
  }
}
