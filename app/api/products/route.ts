import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';
import { isPanelAdmin } from '@/lib/panel-auth';
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
export async function POST(request: Request) {
  if (!(await isPanelAdmin())) return NextResponse.json({ error: 'Hamkor paneliga kiring' }, { status: 401 });
  if (!process.env.DATABASE_URL) return NextResponse.json({ error: 'DATABASE_URL sozlanmagan' }, { status: 503 });
  let x: Record<string, unknown>; try { x = await request.json(); } catch { return NextResponse.json({error:'So‘rov noto‘g‘ri'}, {status:400}); }
  const name=String(x.name||'').trim(), business=String(x.business||'').trim(), price=Number(x.price), old=Number(x.old)||price, qty=Number(x.qty), cat=String(x.cat||'cafe');
  if(!name||name.length>120||!business||business.length>120||!Number.isInteger(price)||price<1||price>100000000||!Number.isInteger(qty)||qty<0||qty>10000||!['bakery','cafe','grocery','dessert'].includes(cat)) return NextResponse.json({error:'Maydonlarni tekshiring'}, {status:400});
  try { const sql=neon(process.env.DATABASE_URL);const rows=await sql`INSERT INTO products(category,emoji,photo,business,name,description,price,old_price,discount,distance,pickup_time,qty) VALUES(${cat},${String(x.emoji||'🍱')},${['p1','p2','p3','p4','p5','p6'][Math.floor(Math.random()*6)]},${business},${name},${String(x.desc||'Bugungi maxsus taklif').slice(0,240)},${price},${old},${old>price?`−${Math.round((1-price/old)*100)}%`:'Narx'},${String(x.distance||'1.0 km')},${String(x.time||'Olib ketish: bugun').slice(0,100)},${qty}) RETURNING id`;return NextResponse.json({id:rows[0].id},{status:201}); } catch { return NextResponse.json({error:'Taklif saqlanmadi. SQL sxemasini tekshiring.'},{status:503}); }
}
