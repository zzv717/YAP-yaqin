import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';
import { isPanelAdmin } from '@/lib/panel-auth';
export const runtime='nodejs';
export async function DELETE(_:Request,{params}:{params:Promise<{id:string}>}){if(!(await isPanelAdmin()))return NextResponse.json({error:'Kirish talab qilinadi'},{status:401});if(!process.env.DATABASE_URL)return NextResponse.json({error:'DATABASE_URL sozlanmagan'},{status:503});const {id:raw}=await params;const id=Number(raw);if(!Number.isSafeInteger(id)||id<1)return NextResponse.json({error:'ID noto‘g‘ri'},{status:400});try{const sql=neon(process.env.DATABASE_URL);const rows=await sql`UPDATE products SET active=false WHERE id=${id} RETURNING id`;if(!rows.length)return NextResponse.json({error:'Taklif topilmadi'},{status:404});return NextResponse.json({ok:true})}catch{return NextResponse.json({error:'Taklif o‘chirilmadi'},{status:503})}}
