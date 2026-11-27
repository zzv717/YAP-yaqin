import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'Ko‘rchi — Chegirmali oziq-ovqat', description: 'Mahalliy kafe va do‘konlardagi chegirmali oziq-ovqat takliflarini toping va band qiling.' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="uz"><body>{children}</body></html>; }
