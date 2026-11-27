import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';
export const runtime='nodejs';
export async function GET(){if(!process.env.DATABASE_URL)return NextResponse.json({reservations:0});try{const sql=neon(process.env.DATABASE_URL);const rows=await sql`SELECT COUNT(*)::int AS reservations FROM orders WHERE status <> 'Bekor qilindi'`;return NextResponse.json(rows[0])}catch{return NextResponse.json({reservations:0})}}
