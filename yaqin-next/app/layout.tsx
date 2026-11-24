import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'Yaqin — Yaxshi taom, arzon narx', description: 'Toshkentdagi kafe va do‘konlardan kunlik chegirmali taomlarni toping.' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="uz"><body>{children}</body></html>; }
