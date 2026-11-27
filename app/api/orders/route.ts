import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';
import { randomUUID } from 'node:crypto';
export const runtime = 'nodejs';
async function notifyPartner(text:string){const token=process.env.TELEGRAM_BOT_TOKEN,chat=process.env.TELEGRAM_CHAT_ID;if(!token||!chat)return;try{await fetch(`https://api.telegram.org/bot${token}/sendMessage`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({chat_id:chat,text,disable_web_page_preview:true}),signal:AbortSignal.timeout(3500)})}catch{/* Telegram outage must not void a saved order. */}}
type CartItem={productId:number;quantity:number};
export async function POST(request:Request){
 if(!process.env.DATABASE_URL)return NextResponse.json({error:'DATABASE_URL sozlanmagan'},{status:503});
 let body:{items?:CartItem[];productId?:number;quantity?:number;phone?:string;name?:string};try{body=await request.json()}catch{return NextResponse.json({error:'So‘rov formati noto‘g‘ri'},{status:400})}
 const rawItems=Array.isArray(body.items)?body.items:[{productId:Number(body.productId),quantity:Number(body.quantity||1)}];
 const customerName=String(body.name||'').trim(),phone=String(body.phone||'').trim();
 if(!customerName||customerName.length>100||phone.replace(/\D/g,'').length<9||phone.length>32||rawItems.length<1||rawItems.length>20)return NextResponse.json({error:'Ism, telefon yoki savat ma’lumotini tekshiring'},{status:400});
 const combined=new Map<number,number>();for(const item of rawItems){const id=Number(item.productId),qty=Number(item.quantity);if(!Number.isSafeInteger(id)||id<1||!Number.isSafeInteger(qty)||qty<1||qty>1000)return NextResponse.json({error:'Savatdagi mahsulot miqdorini tekshiring'},{status:400});combined.set(id,(combined.get(id)||0)+qty)}
 const cart=[...combined].map(([productId,quantity])=>({productId,quantity}));if(cart.some(i=>i.quantity>1000))return NextResponse.json({error:'Bir mahsulot miqdori 1000 dan oshmasin'},{status:400});
 try{const sql=neon(process.env.DATABASE_URL),token=randomUUID(),itemsJson=JSON.stringify(cart);
  const rows=await sql`WITH cart AS MATERIALIZED (
    SELECT product_id,SUM(quantity)::int AS quantity FROM jsonb_to_recordset(${itemsJson}::jsonb) AS x(product_id bigint,quantity int) GROUP BY product_id
  ), gate AS MATERIALIZED (
    SELECT (SELECT COUNT(*) FROM cart)::int AS cart_count,
      (SELECT COUNT(*) FROM cart c JOIN products p ON p.id=c.product_id WHERE p.active=true AND p.qty>=c.quantity)::int AS eligible_count,
      (SELECT COUNT(DISTINCT COALESCE(p.store_id::text,p.business)) FROM cart c JOIN products p ON p.id=c.product_id)::int AS store_count
  ), reserved AS (
    UPDATE products p SET qty=p.qty-c.quantity FROM cart c,gate g
    WHERE p.id=c.product_id AND p.active=true AND p.qty>=c.quantity AND g.eligible_count=g.cart_count AND g.store_count=1
    RETURNING p.id,p.name,p.business,p.price,p.qty_unit,p.store_id
  ), created AS (
    INSERT INTO orders(product_id,product_name,business,customer_name,customer_phone,pickup_address,quantity,tracking_token,price,qty_unit)
    SELECT MIN(r.id),CASE WHEN COUNT(*)=1 THEN MIN(r.name) ELSE 'Savat ('||COUNT(*)||' mahsulot)' END,
      MIN(r.business),${customerName},${phone},COALESCE(MIN(s.address),MIN(r.business)),SUM(c.quantity)::int,${token},SUM(r.price*c.quantity)::int,
      CASE WHEN COUNT(DISTINCT r.qty_unit)=1 THEN MIN(r.qty_unit) ELSE 'aralash' END
    FROM reserved r JOIN cart c ON c.product_id=r.id LEFT JOIN stores s ON s.id=r.store_id
    HAVING COUNT(*)=(SELECT cart_count FROM gate)
    RETURNING id,product_id,product_name,business,customer_name,customer_phone,pickup_address,quantity,tracking_token,price,qty_unit,status,created_at
  ), saved_items AS (
    INSERT INTO order_items(order_id,product_id,product_name,business,quantity,qty_unit,unit_price)
    SELECT o.id,r.id,r.name,r.business,c.quantity,r.qty_unit,r.price FROM created o JOIN reserved r ON TRUE JOIN cart c ON c.product_id=r.id RETURNING id
  ) SELECT * FROM created`;
  if(!rows.length){const info=await sql`SELECT COUNT(DISTINCT COALESCE(p.store_id::text,p.business))::int AS stores FROM products p WHERE p.id=ANY(${cart.map(i=>i.productId)}::bigint[])`;if(Number(info[0]?.stores)>1)return NextResponse.json({error:'Bitta savatda faqat bir do‘kon mahsulotlarini birlashtirish mumkin'},{status:400});return NextResponse.json({error:'Savatdagi mahsulotlardan biri tugagan yoki yetarli miqdor qolmagan'},{status:409})}
  const order=rows[0] as {id:number;product_name:string;business:string;quantity:number;qty_unit:string;price:number;customer_name:string};
  await notifyPartner(`Yangi Ko‘rchi buyurtmasi #${order.id}\n${order.product_name}\n${order.business}\n${order.customer_name}\nJami: ${Number(order.price).toLocaleString('uz-UZ')} so‘m`);
  return NextResponse.json(order,{status:201});
 }catch{return NextResponse.json({error:'Buyurtma saqlanmadi. Neon migratsiyasi va DATABASE_URL ni tekshiring.'},{status:503})}
}
