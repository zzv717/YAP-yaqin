import { NextResponse } from 'next/server';
import { createPanelCookie, isPanelAdmin, panelPasswordConfigured } from '@/lib/panel-auth';
export const runtime = 'nodejs';
export async function GET() { return NextResponse.json({ authenticated: await isPanelAdmin(), configured: panelPasswordConfigured() }); }
export async function POST(request: Request) {
  if (!panelPasswordConfigured()) return NextResponse.json({ error: 'Vercel’da MERCHANT_PANEL_PASSWORD sozlanmagan' }, { status: 503 });
  const origin = request.headers.get('origin'); if (origin && new URL(origin).host !== new URL(request.url).host) return NextResponse.json({ error: 'So‘rov manbasi rad etildi' }, { status: 403 });
  let body: { password?: string }; try { body = await request.json(); } catch { return NextResponse.json({ error: 'So‘rov noto‘g‘ri' }, { status: 400 }); }
  if (body.password !== process.env.MERCHANT_PANEL_PASSWORD) return NextResponse.json({ error: 'Parol noto‘g‘ri' }, { status: 401 });
  const cookie = createPanelCookie(); const response = NextResponse.json({ authenticated: true });
  response.cookies.set(cookie.name, cookie.value, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', path: '/', maxAge: cookie.maxAge }); return response;
}
export async function DELETE() { const response = NextResponse.json({ authenticated: false }); response.cookies.set('korchi_admin','',{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'strict',path:'/',maxAge:0}); return response; }
