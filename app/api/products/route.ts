import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';
import { isPanelAdmin } from '@/lib/panel-auth';
export const runtime = 'nodejs';
export async function GET() {
  if (!process.env.DATABASE_URL) return NextResponse.json({ error: 'DATABASE_URL sozlanmagan' }, { status: 503 });
  try {
    const sql = neon(process.env.DATABASE_URL);
    const rows = await sql`SELECT p.id, p.category AS cat, p.emoji, p.photo, p.image_url AS "imageUrl", p.business, p.name, p.description AS desc, p.price, p.old_price AS old, p.discount, p.distance, p.pickup_time AS time, p.qty, p.qty_unit AS unit, p.expires_on AS "expiresOn", p.is_demo AS "isDemo", s.address AS "storeAddress" FROM products p LEFT JOIN stores s ON s.id=p.store_id WHERE p.active = true AND p.qty > 0 ORDER BY p.id`;
    return NextResponse.json(rows);
  } catch {
    return NextResponse.json({ error: 'Baza tayyor emas. Neon SQL Editor’da db-schema.sql ni bajaring.' }, { status: 503 });
  }
}
export async function POST(request: Request) {
  if (!(await isPanelAdmin())) return NextResponse.json({ error: 'Hamkor paneliga kiring' }, { status: 401 });
  if (!process.env.DATABASE_URL) return NextResponse.json({ error: 'DATABASE_URL sozlanmagan' }, { status: 503 });
  let x: Record<string, unknown>; try { x = await request.json(); } catch { return NextResponse.json({error:'So‘rov noto‘g‘ri'}, {status:400}); }
  const name=String(x.name||'').trim(), business=String(x.business||'').trim(), price=Number(x.price), old=Number(x.old)||price, qty=Number(x.qty), cat=String(x.cat||'cafe'), imageUrl=String(x.imageUrl||'').trim(), unit=String(x.unit||'ta'), expiresOn=String(x.expiresOn||'');
  if(!imageUrl||!imageUrl.startsWith('https://')||imageUrl.length>2048) return NextResponse.json({error:'Mahsulot rasmini yuklang'}, {status:400});
  if(!['ta','porsiya','quti','kg','litr'].includes(unit)) return NextResponse.json({error:'Miqdor birligini tanlang'}, {status:400});
  if(!/^\d{4}-\d{2}-\d{2}$/.test(expiresOn)||Number.isNaN(Date.parse(expiresOn))) return NextResponse.json({error:'Yaroqli sanani tanlang'}, {status:400});
  if(!name||name.length>120||!business||business.length>120||!Number.isInteger(price)||price<1||price>100000000||!Number.isInteger(qty)||qty<0||qty>10000||!['bakery','cafe','grocery','dessert'].includes(cat)) return NextResponse.json({error:'Maydonlarni tekshiring'}, {status:400});
  try { const sql=neon(process.env.DATABASE_URL);const rows=await sql`INSERT INTO products(category,emoji,photo,image_url,business,name,description,price,old_price,discount,distance,pickup_time,qty,qty_unit,expires_on) VALUES(${cat},${String(x.emoji||'🍱')},${['p1','p2','p3','p4','p5','p6'][Math.floor(Math.random()*6)]},${imageUrl||null},${business},${name},${String(x.desc||'Bugungi maxsus taklif').slice(0,240)},${price},${old},${old>price?`−${Math.round((1-price/old)*100)}%`:'Narx'},${String(x.distance||'1.0 km')},${String(x.time||'Olib ketish: bugun').slice(0,100)},${qty},${unit},${expiresOn}) RETURNING id`;return NextResponse.json({id:rows[0].id},{status:201}); } catch { return NextResponse.json({error:'Taklif saqlanmadi. SQL sxemasini tekshiring.'},{status:503}); }
}
