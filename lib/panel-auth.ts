import { createHmac, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';
const COOKIE = 'korchi_admin';
function secret() { return process.env.MERCHANT_PANEL_PASSWORD || ''; }
function sign(exp: string) { return createHmac('sha256', secret()).update(exp).digest('hex'); }
export async function isPanelAdmin() {
  const key = secret(); if (!key) return false;
  const token = (await cookies()).get(COOKIE)?.value || '';
  const [exp, mac, extra] = token.split('.');
  if (!exp || !mac || extra || Number(exp) < Date.now()) return false;
  const expected = sign(exp);
  try { return timingSafeEqual(Buffer.from(mac, 'hex'), Buffer.from(expected, 'hex')); } catch { return false; }
}
export function createPanelCookie() {
  const exp = String(Date.now() + 8 * 60 * 60 * 1000);
  return { name: COOKIE, value: `${exp}.${sign(exp)}`, maxAge: 8 * 60 * 60 };
}
export const panelPasswordConfigured = () => Boolean(secret());
