'use client';

import { useEffect, useMemo, useState } from 'react';

type Product = {
  id: number;
  cat: string;
  emoji: string;
  photo: string;
  imageUrl?: string | null;
  unit?: string;
  expiresOn?: string | null;
  isDemo?: boolean;
  storeAddress?: string | null;
  business: string;
  name: string;
  desc: string;
  price: number;
  old: number;
  discount: string;
  distance: string;
  time: string;
  qty: number;
};

type MerchantOrder = {
  id: number;
  product: string;
  business: string;
  name: string;
  phone: string;
  pickupAddress: string;
  quantity: number;
  trackingToken: string;
  price: number;
  unit: string;
  status: string;
  createdAt: string;
};

const initial: Product[] = [
  {
    id: 1,
    cat: 'bakery',
    emoji: '🥐',
    photo: 'p1',
    business: 'Bon! · Chilonzor',
    name: 'Kruassan to‘plami',
    desc: '3 ta yangi kruassan · kechki taklif',
    price: 18000,
    old: 36000,
    discount: '−50%',
    distance: '0.4 km',
    time: 'Olib ketish: 19:00–21:00',
    qty: 4,
  },
  {
    id: 2,
    cat: 'cafe',
    emoji: '🥗',
    photo: 'p2',
    business: 'Green Bowl · Oybek',
    name: 'Fresh lunch box',
    desc: 'Salat, donli garnir va sous',
    price: 29000,
    old: 49000,
    discount: '−41%',
    distance: '0.8 km',
    time: 'Olib ketish: 18:30–20:00',
    qty: 3,
  },
  {
    id: 3,
    cat: 'dessert',
    emoji: '🍰',
    photo: 'p3',
    business: 'Cake Lab · Mirobod',
    name: 'Shirinliklar qutisi',
    desc: 'Kunlik desertlardan 4 xil tanlov',
    price: 35000,
    old: 62000,
    discount: '−44%',
    distance: '1.2 km',
    time: 'Olib ketish: 19:30–21:30',
    qty: 2,
  },
  {
    id: 4,
    cat: 'bakery',
    emoji: '🥖',
    photo: 'p4',
    business: 'Nonvoy · Yakkasaroy',
    name: 'Oilaviy non savati',
    desc: 'Non, patir va bulochka aralashmasi',
    price: 15000,
    old: 27000,
    discount: '−44%',
    distance: '1.5 km',
    time: 'Olib ketish: 20:00–21:00',
    qty: 5,
  },
  {
    id: 5,
    cat: 'grocery',
    emoji: '🥑',
    photo: 'p5',
    business: 'Eco Market · Yunusobod',
    name: 'Sabzavotlar to‘plami',
    desc: 'Mavsumiy, saralangan yangi mahsulotlar',
    price: 22000,
    old: 40000,
    discount: '−45%',
    distance: '2.1 km',
    time: 'Olib ketish: 18:00–20:30',
    qty: 3,
  },
  {
    id: 6,
    cat: 'cafe',
    emoji: '🍱',
    photo: 'p6',
    business: 'Choyxona 24 · Minor',
    name: 'Kechki taom to‘plami',
    desc: 'Issiq taom va salat — bugungi menyudan',
    price: 32000,
    old: 55000,
    discount: '−42%',
    distance: '2.4 km',
    time: 'Olib ketish: 19:00–20:30',
    qty: 2,
  },
];

const categories: Array<[string, string]> = [
  ['all', 'Hammasi'],
  ['bakery', '🥐 Nonvoyxona'],
  ['cafe', '☕ Kafe'],
  ['grocery', '🥬 Oziq-ovqat'],
  ['dessert', '🍰 Shirinlik'],
];

const photoGradients: Record<string, string> = {
  p1: 'linear-gradient(135deg, #fff3dc 0%, #ffd89b 100%)',
  p2: 'linear-gradient(135deg, #e5f7ed 0%, #b7ebc8 100%)',
  p3: 'linear-gradient(135deg, #ffe8ef 0%, #ffc2d4 100%)',
  p4: 'linear-gradient(135deg, #fdf0d5 0%, #f5cfa0 100%)',
  p5: 'linear-gradient(135deg, #e7f6e7 0%, #c1e7c1 100%)',
  p6: 'linear-gradient(135deg, #fff0db 0%, #ffcf96 100%)',
};

function daysRemaining(value?: string | null) {
  if (!value) return 999;
  const [y, m, d] = value.slice(0, 10).split('-').map(Number);
  const target = new Date(y, m - 1, d);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - today.getTime()) / 86400000);
}

function expiryText(value?: string | null) {
  if (!value) return '';
  const [y, m, d] = value.slice(0, 10).split('-').map(Number);
  const days = daysRemaining(value);
  return `${String(d).padStart(2, '0')}.${String(m).padStart(2, '0')}.${y} · ${
    days < 0 ? 'muddati o‘tgan' : days === 0 ? 'bugun yaroqli' : `${days} kun qoldi`
  }`;
}

export default function Home() {
  const [items, setItems] = useState<Product[]>(initial);
  const [cat, setCat] = useState('all');
  const [selected, setSelected] = useState<Product | null>(null);
  const [detailOnly, setDetailOnly] = useState(false);
  const [phone, setPhone] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [orderQty, setOrderQty] = useState(1);
  const [trackingLink, setTrackingLink] = useState('');
  const [message, setMessage] = useState('');
  const [favorites, setFavorites] = useState<number[]>([]);
  const [maxPrice, setMaxPrice] = useState(60000);
  const [maxDays, setMaxDays] = useState(7);
  const [district, setDistrict] = useState('all');
  const [panelOpen, setPanelOpen] = useState(false);
  const [panelPass, setPanelPass] = useState('');
  const [panelAuthed, setPanelAuthed] = useState(false);
  const [panelError, setPanelError] = useState('');
  const [orders, setOrders] = useState<MerchantOrder[]>([]);
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [submittingOrder, setSubmittingOrder] = useState(false);
  const [impactCount, setImpactCount] = useState(0);

  const visible = useMemo(
    () =>
      items.filter((p) => {
        const area = p.storeAddress || p.business;
        return (
          (cat === 'all' || p.cat === cat) &&
          p.qty > 0 &&
          p.price <= maxPrice &&
          (!p.expiresOn || daysRemaining(p.expiresOn) <= maxDays) &&
          (district === 'all' || area.toLowerCase().includes(district.toLowerCase()))
        );
      }),
    [items, cat, maxPrice, maxDays, district]
  );

  const stores = useMemo(
    () =>
      Array.from(
        new Map(
          items.map((p) => [
            p.business,
            { name: p.business, address: p.storeAddress || 'Toshkent — demo manzil' },
          ])
        ).values()
      ),
    [items]
  );

  useEffect(() => {
    fetch('/api/products')
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data: Product[]) => {
        if (Array.isArray(data) && data.length) setItems(data);
      })
      .catch(() => {});

    fetch('/api/impact')
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => setImpactCount(Number(d.reservations) || 0))
      .catch(() => {});
  }, []);

  async function reserve() {
    if (!selected || submittingOrder) return;
    if (!customerName.trim() || phone.replace(/\D/g, '').length < 9 || orderQty < 1 || orderQty > selected.qty) {
      setMessage('Ism, telefon va miqdorni tekshiring.');
      return;
    }
    setSubmittingOrder(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: selected.id,
          phone,
          name: customerName,
          quantity: orderQty,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error || 'Buyurtmani band qilib bo‘lmadi.');
        return;
      }
      setItems((curr) =>
        curr.map((p) => (p.id === selected.id ? { ...p, qty: Math.max(0, p.qty - orderQty) } : p))
      );
      setImpactCount((n) => n + 1);
      setTrackingLink(`/orders/${data.tracking_token}`);
      setMessage(
        `Buyurtma #${data.id} saqlandi. Hamkor tasdiqlaganidan keyin belgilangan joydan olib ketasiz.`
      );
    } catch {
      setMessage('Serverga ulanib bo‘lmadi. Keyinroq urinib ko‘ring.');
    } finally {
      setSubmittingOrder(false);
    }
  }

  async function openPanel() {
    setPanelOpen(true);
    setPanelError('');
    try {
      const r = await fetch('/api/merchant/session');
      const d = await r.json();
      setPanelAuthed(Boolean(d.authenticated));
      if (d.authenticated) await refreshOrders();
      if (!d.configured) {
        setPanelError('Vercel’da MERCHANT_PANEL_PASSWORD maxfiy sozlamasini qo‘shish kerak.');
      }
    } catch {
      setPanelError('Serverga ulanib bo‘lmadi.');
    }
  }

  async function refreshOrders() {
    try {
      const r = await fetch('/api/merchant/orders');
      const d = await r.json();
      if (r.ok) setOrders(d);
      else setPanelError(d.error || 'Buyurtmalar yuklanmadi');
    } catch {
      setPanelError('Buyurtmalarni yuklab bo‘lmadi');
    }
  }

  async function loginPanel(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPanelError('');
    try {
      const r = await fetch('/api/merchant/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: panelPass }),
      });
      const d = await r.json();
      if (!r.ok) {
        setPanelError(d.error || 'Kirish amalga oshmadi');
        return;
      }
      setPanelAuthed(true);
      setPanelPass('');
      await refreshOrders();
    } catch {
      setPanelError('Serverga ulanib bo‘lmadi');
    }
  }

  async function uploadProductImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setPanelError('');
    try {
      const fd = new FormData();
      fd.append('file', file);
      const r = await fetch('/api/merchant/upload', { method: 'POST', body: fd });
      const d = await r.json();
      if (!r.ok) {
        setPanelError(d.error || 'Rasm yuklanmoqda xatolik');
        return;
      }
      setImageUrl(d.url);
    } catch {
      setPanelError('Rasm yuklanmadi');
    } finally {
      setUploading(false);
    }
  }

  async function addOffer(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!imageUrl) {
      setPanelError('Avval mahsulot rasmini yuklang');
      return;
    }
    const form = e.currentTarget;
    const f = { ...Object.fromEntries(new FormData(form)), imageUrl };
    const r = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(f),
    });
    const d = await r.json();
    if (!r.ok) {
      setPanelError(d.error || 'Taklif qo‘shilmadi');
      return;
    }
    const list = await fetch('/api/products').then((x) => x.json());
    if (Array.isArray(list)) setItems(list);
    form.reset();
    setImageUrl('');
    setPanelError('Taklif qo‘shildi.');
  }

  async function updateOrder(id: number, status: string) {
    const r = await fetch('/api/merchant/orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    if (!r.ok) {
      const d = await r.json();
      setPanelError(d.error || 'Holat yangilanmadi');
      return;
    }
    await refreshOrders();
  }

  async function removeOffer(id: number) {
    const r = await fetch(`/api/merchant/products/${id}`, { method: 'DELETE' });
    if (!r.ok) {
      const d = await r.json();
      setPanelError(d.error || 'Taklif o‘chirilmadi');
      return;
    }
    const list = await fetch('/api/products').then((x) => x.json());
    if (Array.isArray(list)) setItems(list);
  }

  return (
    <>
      <style jsx global>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes floatSlow {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-6px);
          }
        }
        @keyframes modalPop {
          from {
            opacity: 0;
            transform: translateY(14px) scale(0.97);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes backdropFade {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        html {
          scroll-behavior: smooth;
        }
        body {
          margin: 0;
          background: #f6f8f4;
          color: #16221b;
          font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        .yy-top {
          background: linear-gradient(90deg, #125c3f 0%, #1d7a54 55%, #238b5e 100%);
          color: #ecfdf5;
          text-align: center;
          padding: 9px 16px;
          font-size: 13px;
          letter-spacing: 0.01em;
        }
        .yy-header {
          position: sticky;
          top: 0;
          z-index: 30;
          backdrop-filter: blur(14px);
          background: rgba(255, 255, 255, 0.86);
          border-bottom: 1px solid rgba(22, 34, 27, 0.08);
          transition: box-shadow 0.25s ease, background 0.25s ease;
        }
        .yy-header-inner {
          max-width: 1180px;
          margin: 0 auto;
          padding: 13px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          flex-wrap: wrap;
        }
        .yy-brand {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-size: 20px;
          font-weight: 800;
          color: #113b29;
          text-decoration: none;
        }
        .yy-logo {
          width: 36px;
          height: 36px;
          border-radius: 12px;
          background: linear-gradient(135deg, #167c52 0%, #f97316 100%);
          color: #fff;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          font-size: 17px;
          box-shadow: 0 8px 18px rgba(22, 124, 82, 0.24);
          transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .yy-brand:hover .yy-logo {
          transform: rotate(-8deg) scale(1.06);
        }
        .yy-nav {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }
        .yy-nav a {
          color: #26392f;
          text-decoration: none;
          font-size: 14px;
          font-weight: 600;
          padding: 7px 11px;
          border-radius: 10px;
          transition: background 0.2s ease, color 0.2s ease, transform 0.2s ease;
        }
        .yy-nav a:hover {
          background: #eaf5ee;
          color: #146947;
          transform: translateY(-1px);
        }
        .yy-pill-btn {
          border: 1px solid #d7e2db;
          background: #ffffff;
          color: #17281f;
          padding: 8px 13px;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.22s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .yy-pill-btn:hover {
          border-color: #167c52;
          background: #f1fbf5;
          transform: translateY(-1px);
          box-shadow: 0 6px 14px rgba(22, 124, 82, 0.1);
        }
        .yy-wrap {
          max-width: 1180px;
          margin: 0 auto;
          padding: 26px 20px 64px;
        }
        .yy-hero {
          position: relative;
          overflow: hidden;
          border-radius: 28px;
          padding: 42px 34px;
          background:
            radial-gradient(circle at 88% 18%, rgba(251, 146, 60, 0.24), transparent 42%),
            radial-gradient(circle at 12% 85%, rgba(34, 197, 94, 0.18), transparent 45%),
            linear-gradient(135deg, #ffffff 0%, #f2faf5 100%);
          border: 1px solid #dfece4;
          box-shadow: 0 18px 40px rgba(17, 59, 41, 0.06);
          animation: fadeUp 0.55s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .yy-eyebrow {
          display: inline-block;
          font-size: 12px;
          font-weight: 700;
          color: #146947;
          background: #e3f5ea;
          padding: 6px 12px;
          border-radius: 999px;
          margin-bottom: 14px;
        }
        .yy-hero h1 {
          margin: 0;
          font-size: clamp(30px, 4.6vw, 48px);
          line-height: 1.12;
          letter-spacing: -0.02em;
          color: #10241b;
        }
        .yy-hero h1 em {
          font-style: normal;
          color: #ea580c;
        }
        .yy-hero p {
          max-width: 600px;
          margin: 14px 0 24px;
          color: #485b51;
          font-size: 16px;
          line-height: 1.6;
        }
        .yy-hero-btn {
          border: none;
          background: linear-gradient(135deg, #157a50 0%, #1f9664 100%);
          color: #fff;
          padding: 13px 22px;
          border-radius: 14px;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 12px 24px rgba(21, 122, 80, 0.25);
          transition: transform 0.25s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.25s ease;
        }
        .yy-hero-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 16px 28px rgba(21, 122, 80, 0.32);
        }
        .yy-hero-btn:active {
          transform: translateY(0) scale(0.98);
        }
        .yy-stats {
          margin-top: 28px;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
          gap: 14px;
        }
        .yy-stat-box {
          background: rgba(255, 255, 255, 0.85);
          border: 1px solid #e2ede6;
          border-radius: 16px;
          padding: 14px 16px;
          transition: transform 0.25s ease, border-color 0.25s ease;
        }
        .yy-stat-box:hover {
          transform: translateY(-3px);
          border-color: #9dd4b7;
        }
        .yy-stat-box strong {
          display: block;
          font-size: 16px;
          color: #124832;
          margin-bottom: 3px;
        }
        .yy-stat-box span {
          font-size: 13px;
          color: #5b6e64;
        }
        .yy-section {
          margin-top: 44px;
          animation: fadeUp 0.55s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .yy-sec-head {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 16px;
          gap: 12px;
        }
        .yy-sec-head h2 {
          margin: 0;
          font-size: 24px;
          color: #13281e;
        }
        .yy-sec-head p {
          margin: 4px 0 0;
          font-size: 14px;
          color: #5d7066;
        }
        .yy-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 16px;
        }
        .yy-chip {
          border: 1px solid #dce6e0;
          background: #fff;
          color: #24372d;
          padding: 8px 14px;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.22s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .yy-chip:hover {
          border-color: #167c52;
          transform: translateY(-1px);
        }
        .yy-chip.active {
          background: #157a50;
          color: #fff;
          border-color: #157a50;
          box-shadow: 0 8px 18px rgba(21, 122, 80, 0.22);
          transform: translateY(-1px);
        }
        .yy-filter-bar {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          align-items: center;
          margin-bottom: 22px;
          background: #ffffff;
          padding: 14px 18px;
          border-radius: 18px;
          border: 1px solid #e3ece6;
          box-shadow: 0 6px 20px rgba(17, 59, 41, 0.04);
        }
        .yy-filter-bar label {
          font-size: 12px;
          font-weight: 600;
          color: #3c4f45;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .yy-filter-bar select {
          border: 1px solid #d5e0d9;
          border-radius: 10px;
          padding: 6px 10px;
          font-size: 13px;
          background: #fafcfb;
          color: #16221b;
          outline: none;
          transition: border-color 0.2s ease;
        }
        .yy-filter-bar select:focus {
          border-color: #157a50;
        }
        .yy-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
          gap: 20px;
        }
        .yy-card {
          background: #ffffff;
          border: 1px solid #e3ece6;
          border-radius: 22px;
          overflow: hidden;
          box-shadow: 0 10px 26px rgba(16, 36, 27, 0.05);
          transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.3s ease, border-color 0.3s ease;
          animation: fadeUp 0.42s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .yy-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 38px rgba(16, 36, 27, 0.11);
          border-color: #b7dcc7;
        }
        .yy-photo {
          position: relative;
          height: 168px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .yy-photo img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .yy-card:hover .yy-photo img {
          transform: scale(1.06);
        }
        .yy-food-emoji {
          font-size: 56px;
          z-index: 1;
          transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
          animation: floatSlow 3.4s ease-in-out infinite;
        }
        .yy-card:hover .yy-food-emoji {
          transform: scale(1.14);
        }
        .yy-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          z-index: 2;
          background: #ea580c;
          color: #fff;
          font-size: 12px;
          font-weight: 800;
          padding: 5px 10px;
          border-radius: 999px;
          box-shadow: 0 6px 14px rgba(234, 88, 12, 0.28);
        }
        .yy-heart {
          position: absolute;
          top: 12px;
          right: 12px;
          z-index: 2;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          border: none;
          background: rgba(255, 255, 255, 0.92);
          color: #475569;
          font-size: 16px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          transition: transform 0.22s cubic-bezier(0.22, 1, 0.36, 1), color 0.2s ease, background 0.2s ease;
        }
        .yy-heart:hover {
          transform: scale(1.12);
        }
        .yy-heart.liked {
          color: #e11d48;
          background: #ffe4e6;
        }
        .yy-card-body {
          padding: 16px 18px 18px;
        }
        .yy-business {
          font-size: 12px;
          font-weight: 700;
          color: #157a50;
          display: flex;
          align-items: center;
          gap: 6px;
          flex-wrap: wrap;
        }
        .yy-title-row {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 8px;
          margin-top: 6px;
        }
        .yy-title-row h3 {
          margin: 0;
          font-size: 18px;
          color: #13251d;
          transition: color 0.2s ease;
        }
        .yy-title-row h3:hover {
          color: #157a50;
        }
        .yy-distance {
          font-size: 12px;
          color: #63766c;
          white-space: nowrap;
        }
        .yy-desc {
          margin: 6px 0 14px;
          font-size: 13px;
          color: #55685e;
          line-height: 1.45;
        }
        .yy-card-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }
        .yy-price {
          font-size: 16px;
          font-weight: 800;
          color: #12261d;
        }
        .yy-old {
          margin-left: 7px;
          font-size: 12px;
          color: #8c9c93;
          text-decoration: line-through;
        }
        .yy-reserve-btn {
          border: none;
          background: #157a50;
          color: #fff;
          padding: 9px 14px;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.2s ease, transform 0.2s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.2s ease;
        }
        .yy-reserve-btn:hover {
          background: #116441;
          transform: translateY(-1px);
          box-shadow: 0 8px 16px rgba(21, 122, 80, 0.22);
        }
        .yy-reserve-btn:active {
          transform: scale(0.97);
        }
        .yy-time {
          margin-top: 10px;
          font-size: 12px;
          color: #54665d;
        }
        .yy-empty {
          text-align: center;
          padding: 36px 20px;
          background: #fff;
          border-radius: 20px;
          border: 1px dashed #c8d7ce;
          color: #55685e;
          animation: fadeUp 0.35s ease both;
        }
        .yy-impact {
          margin-top: 46px;
          border-radius: 26px;
          padding: 32px;
          background: linear-gradient(125deg, #114b34 0%, #186e4b 60%, #1e845a 100%);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          flex-wrap: wrap;
          box-shadow: 0 20px 42px rgba(17, 75, 52, 0.22);
          animation: fadeUp 0.55s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .yy-impact h3 {
          margin: 0 0 8px;
          font-size: 22px;
        }
        .yy-impact p {
          margin: 0;
          color: rgba(255, 255, 255, 0.85);
          max-width: 540px;
          line-height: 1.5;
        }
        .yy-impact-num {
          font-size: 40px;
          font-weight: 900;
          line-height: 1;
          color: #fde047;
          text-align: right;
          transition: transform 0.3s ease;
        }
        .yy-impact:hover .yy-impact-num {
          transform: scale(1.06);
        }
        .yy-impact-label {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.78);
          margin-top: 6px;
          text-align: right;
        }
        .yy-footer {
          border-top: 1px solid #e2ebe5;
          background: #ffffff;
          padding: 22px 20px;
          color: #576960;
          font-size: 13px;
        }
        .yy-foot-inner {
          max-width: 1180px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
        }
        .yy-modal-back {
          position: fixed;
          inset: 0;
          z-index: 60;
          background: rgba(12, 24, 18, 0.56);
          backdrop-filter: blur(5px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          animation: backdropFade 0.22s ease both;
        }
        .yy-modal {
          position: relative;
          width: 100%;
          max-width: 480px;
          background: #ffffff;
          border-radius: 24px;
          padding: 24px;
          box-shadow: 0 28px 64px rgba(10, 24, 18, 0.25);
          animation: modalPop 0.28s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .yy-close {
          position: absolute;
          top: 14px;
          right: 14px;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          border: none;
          background: #f1f5f3;
          color: #1e293b;
          font-size: 20px;
          cursor: pointer;
          transition: transform 0.2s ease, background 0.2s ease;
        }
        .yy-close:hover {
          background: #e2e8f0;
          transform: rotate(90deg);
        }
        .yy-modal label {
          display: block;
          font-size: 12px;
          font-weight: 700;
          color: #2d4036;
          margin-top: 12px;
          margin-bottom: 5px;
        }
        .yy-modal input,
        .yy-modal select {
          width: 100%;
          box-sizing: border-box;
          border: 1px solid #d3dfd8;
          border-radius: 12px;
          padding: 10px 12px;
          font-size: 14px;
          background: #fafcfb;
          outline: none;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .yy-modal input:focus,
        .yy-modal select:focus {
          border-color: #157a50;
          box-shadow: 0 0 0 3px rgba(21, 122, 80, 0.14);
        }
        .yy-confirm {
          margin-top: 18px;
          width: 100%;
          border: none;
          background: linear-gradient(135deg, #157a50 0%, #1c915f 100%);
          color: #fff;
          padding: 12px 16px;
          border-radius: 14px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .yy-confirm:hover {
          transform: translateY(-1px);
          box-shadow: 0 10px 22px rgba(21, 122, 80, 0.25);
        }
        .yy-success {
          text-align: center;
          padding: 8px 0;
          animation: fadeUp 0.3s ease both;
        }
        .yy-tick {
          font-size: 40px;
          margin-bottom: 6px;
        }
      `}</style>

      <div className="yy-top">
        Chegirmali oziq-ovqatni toping, isrofni kamaytiring. <b>Tejamkor tanlov — Ko‘rchi’da.</b>
      </div>

      <header className="yy-header">
        <div className="yy-header-inner">
          <a href="#" className="yy-brand">
            <span className="yy-logo">K</span>
            <span>Ko‘rchi</span>
          </a>
          <nav className="yy-nav">
            <a href="#offers">Takliflar</a>
            <a href="#how">Qanday ishlaydi?</a>
            <a href="#impact">Ta’sirimiz</a>
            <button
              type="button"
              className="yy-pill-btn"
              onClick={() => alert('Manzil tanlash Google Maps API ulangandan keyin ishlaydi.')}
            >
              📍 Toshkent ▾
            </button>
            <button type="button" className="yy-pill-btn" onClick={openPanel}>
              Hamkor paneli
            </button>
          </nav>
        </div>
      </header>

      <main className="yy-wrap">
        <section className="yy-hero">
          <div className="yy-eyebrow">Mahalliy takliflar · Tejamkor xarid · Kamroq isrof</div>
          <h1>
            Yaxshi mahsulotlar
            <br />
            <em>yanada qulay narxda.</em>
          </h1>
          <p>
            Mahalliy do‘kon va kafelardagi chegirmali oziq-ovqat takliflarini toping, oldindan band
            qiling va olib keting.
          </p>
          <button
            type="button"
            className="yy-hero-btn"
            onClick={() => document.querySelector('#offers')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Takliflarni ko‘rish →
          </button>

          <div className="yy-stats">
            <div className="yy-stat-box">
              <strong>Mahalliy</strong>
              <span>do‘kon va kafelar</span>
            </div>
            <div className="yy-stat-box">
              <strong>Band qiling</strong>
              <span>keyin olib keting</span>
            </div>
            <div className="yy-stat-box">
              <strong>Kamroq isrof</strong>
              <span>aqlli xarid</span>
            </div>
          </div>
        </section>

        <section id="offers" className="yy-section">
          <div className="yy-sec-head">
            <div>
              <h2>Bugungi yaqin takliflar</h2>
              <p>Olib ketish uchun band qiling — soni cheklangan</p>
            </div>
          </div>

          <div className="yy-chips">
            {categories.map(([key, label]) => (
              <button
                type="button"
                key={key}
                className={`yy-chip ${cat === key ? 'active' : ''}`}
                onClick={() => setCat(key)}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="yy-filter-bar">
            <label>
              <span>
                Narxgacha: <b>{maxPrice.toLocaleString('uz-UZ')} so‘m</b>
              </span>
              <input
                aria-label="Maksimal narx"
                type="range"
                min="10000"
                max="60000"
                step="5000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                style={{ width: 160, accentColor: '#157a50' }}
              />
            </label>

            <label>
              <span>Hudud</span>
              <select value={district} onChange={(e) => setDistrict(e.target.value)}>
                <option value="all">Barcha hududlar</option>
                <option value="Chilonzor">Chilonzor</option>
                <option value="Mirobod">Mirobod</option>
                <option value="Yunusobod">Yunusobod</option>
                <option value="Yakkasaroy">Yakkasaroy</option>
              </select>
            </label>

            <label>
              <span>Yaroqlilik muddati</span>
              <select value={maxDays} onChange={(e) => setMaxDays(Number(e.target.value))}>
                <option value={1}>1 kun ichida</option>
                <option value={3}>3 kun ichida</option>
                <option value={7}>7 kun ichida</option>
                <option value={30}>30 kun</option>
              </select>
            </label>
          </div>

          <div className="yy-grid">
            {visible.map((p, idx) => (
              <article
                className="yy-card"
                key={p.id}
                style={{ animationDelay: `${Math.min(idx * 45, 270)}ms` }}
              >
                <div
                  className="yy-photo"
                  style={{
                    background: photoGradients[p.photo] || 'linear-gradient(135deg, #eef6f0, #d8ede0)',
                    cursor: 'pointer',
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label={`${p.name} mahsulot tafsilotlarini ko‘rish`}
                  onClick={() => {
                    setSelected(p);
                    setDetailOnly(true);
                    setMessage('');
                    setTrackingLink('');
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelected(p);
                      setDetailOnly(true);
                      setMessage('');
                      setTrackingLink('');
                    }
                  }}
                >
                  {p.imageUrl && <img src={p.imageUrl} alt={p.name} />}
                  <span className="yy-food-emoji" style={{ opacity: p.imageUrl ? 0 : 1 }}>
                    {p.emoji}
                  </span>
                  <span className="yy-badge">{p.discount} chegirma</span>
                  <button
                    type="button"
                    className={`yy-heart ${favorites.includes(p.id) ? 'liked' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setFavorites((f) =>
                        f.includes(p.id) ? f.filter((i) => i !== p.id) : [...f, p.id]
                      );
                    }}
                  >
                    {favorites.includes(p.id) ? '♥' : '♡'}
                  </button>
                </div>

                <div className="yy-card-body">
                  <div className="yy-business">
                    <span>{p.business}</span>
                    {p.isDemo && (
                      <span
                        style={{
                          background: '#fff1dd',
                          color: '#99601c',
                          borderRadius: 20,
                          padding: '3px 8px',
                          fontSize: 10,
                          fontWeight: 800,
                        }}
                      >
                        NAMUNA
                      </span>
                    )}
                  </div>

                  <div className="yy-title-row">
                    <h3
                      role="button"
                      tabIndex={0}
                      onClick={() => {
                        setSelected(p);
                        setDetailOnly(true);
                        setMessage('');
                        setTrackingLink('');
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          setSelected(p);
                          setDetailOnly(true);
                          setMessage('');
                          setTrackingLink('');
                        }
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      {p.name}
                    </h3>
                    <span className="yy-distance">📍 {p.storeAddress || p.distance}</span>
                  </div>

                  <p className="yy-desc">{p.desc}</p>

                  <div className="yy-card-bottom">
                    <div>
                      <span className="yy-price">
                        {p.price.toLocaleString('uz-UZ')} so‘m / {p.unit || 'ta'}
                      </span>
                      <span className="yy-old">{p.old.toLocaleString('uz-UZ')}</span>
                    </div>
                    <button
                      type="button"
                      className="yy-reserve-btn"
                      onClick={() => {
                        setSelected(p);
                        setDetailOnly(false);
                        setPhone('');
                        setCustomerName('');
                        setOrderQty(1);
                        setMessage('');
                        setTrackingLink('');
                      }}
                    >
                      Band qilish
                    </button>
                  </div>

                  <div className="yy-time">
                    ◷ {p.time} · {p.qty} {p.unit || 'ta'} qoldi
                  </div>
                  {p.expiresOn && (
                    <div className="yy-time" style={{ color: '#6e7b72' }}>
                      Yaroqli sana: {expiryText(p.expiresOn)}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>

          {visible.length === 0 && (
            <div className="yy-empty">
              Bu filtrlarda taklif topilmadi. Filtrlarni kengaytirib ko‘ring.
            </div>
          )}
        </section>

        <section className="yy-section">
          <div className="yy-sec-head">
            <div>
              <h2>Hamkor do‘konlar</h2>
              <p>Demo do‘kon nomlari va manzillari — namuna ma’lumot</p>
            </div>
          </div>
          <div className="yy-grid">
            {stores.map((s) => (
              <article className="yy-card" key={s.name} style={{ padding: 20 }}>
                <div style={{ fontSize: 28 }}>🏪</div>
                <h3 style={{ margin: '10px 0 6px', fontSize: 17 }}>{s.name}</h3>
                <p style={{ fontSize: 13, color: '#64766d', margin: '0 0 14px' }}>{s.address}</p>
                <button
                  type="button"
                  className="yy-reserve-btn"
                  onClick={() => {
                    setDistrict(s.address.split(' ')[0]);
                    document.querySelector('#offers')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Do‘kon takliflari
                </button>
              </article>
            ))}
          </div>
        </section>

        <section id="how" className="yy-section">
          <div className="yy-sec-head">
            <div>
              <h2>Qanday ishlaydi?</h2>
              <p>Qisqa va sodda — xaridor uchun ham, do‘kon uchun ham.</p>
            </div>
          </div>
          <div className="yy-grid">
            <article className="yy-card" style={{ padding: 20 }}>
              <h3 style={{ margin: '0 0 8px' }}>1. Taklifni toping</h3>
              <p style={{ margin: 0, color: '#56695f', fontSize: 14, lineHeight: 1.5 }}>
                Hudud, narx va yaroqlilik sanasi bo‘yicha mos mahsulotni tanlang.
              </p>
            </article>
            <article className="yy-card" style={{ padding: 20 }}>
              <h3 style={{ margin: '0 0 8px' }}>2. Band qiling</h3>
              <p style={{ margin: 0, color: '#56695f', fontSize: 14, lineHeight: 1.5 }}>
                Ism va telefon raqamingizni kiriting, buyurtma raqamini saqlab qo‘ying.
              </p>
            </article>
            <article className="yy-card" style={{ padding: 20 }}>
              <h3 style={{ margin: '0 0 8px' }}>3. Olib keting</h3>
              <p style={{ margin: 0, color: '#56695f', fontSize: 14, lineHeight: 1.5 }}>
                Hamkor tasdiqlagach, ko‘rsatilgan joy va vaqtda mahsulotni olib keting.
              </p>
            </article>
          </div>
        </section>

        <section className="yy-impact" id="impact">
          <div>
            <h3>Har bir band qilingan mahsulot — isrofni kamaytirishga qadam 🌱</h3>
            <p>
              Ko‘rchi bilan tejang, mazali xarid qiling va oziq-ovqat isrofini kamaytirishga hissa
              qo‘shing.
            </p>
          </div>
          <div>
            <div className="yy-impact-num">{impactCount.toLocaleString('uz-UZ')}</div>
            <div className="yy-impact-label">bekor qilinmagan bandlar · haqiqiy baza hisobi</div>
          </div>
        </section>
      </main>

      <footer className="yy-footer">
        <div className="yy-foot-inner">
          <strong style={{ color: '#13281e' }}>Ko‘rchi</strong>
          <span>Yaqin mahsulotlar. Aqlli xaridlar. Kamroq isrof.</span>
          <span>© 2026 Ko‘rchi · Sinov versiyasi</span>
        </div>
      </footer>

      {selected && (
        <div
          className="yy-modal-back"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelected(null);
          }}
        >
          <div className="yy-modal">
            <button type="button" className="yy-close" onClick={() => setSelected(null)}>
              ×
            </button>

            {detailOnly ? (
              <>
                <div className="yy-eyebrow">MAHSULOT TAFSILOTLARI</div>
                {selected.imageUrl && (
                  <img
                    src={selected.imageUrl}
                    alt={selected.name}
                    style={{
                      width: '100%',
                      height: 210,
                      objectFit: 'cover',
                      borderRadius: 14,
                      marginTop: 8,
                    }}
                  />
                )}
                <h2 style={{ margin: '14px 0 6px' }}>{selected.name}</h2>
                <p style={{ margin: '0 0 8px', color: '#55685e', fontSize: 14 }}>
                  {selected.business} · {selected.storeAddress || selected.distance}
                </p>
                <p style={{ margin: '0 0 12px', color: '#37483f', fontSize: 14 }}>{selected.desc}</p>
                <p style={{ margin: '0 0 8px' }}>
                  <b>
                    {selected.price.toLocaleString('uz-UZ')} so‘m / {selected.unit || 'ta'}
                  </b>
                  {selected.old > selected.price && (
                    <span className="yy-old">{selected.old.toLocaleString('uz-UZ')} so‘m</span>
                  )}
                </p>
                {selected.expiresOn && (
                  <p style={{ margin: '0 0 6px', fontSize: 13 }}>
                    Yaroqli sana: {expiryText(selected.expiresOn)}
                  </p>
                )}
                <p style={{ margin: '0 0 10px', fontSize: 13 }}>
                  ◷ {selected.time} · {selected.qty} {selected.unit || 'ta'} qoldi
                </p>
                <button
                  type="button"
                  className="yy-confirm"
                  onClick={() => {
                    setDetailOnly(false);
                    setPhone('');
                    setCustomerName('');
                    setOrderQty(1);
                    setMessage('');
                    setTrackingLink('');
                  }}
                >
                  Band qilish
                </button>
              </>
            ) : message ? (
              <div className="yy-success">
                <div className="yy-tick">✅</div>
                <h2 style={{ margin: '0 0 8px' }}>Buyurtma</h2>
                <p style={{ margin: '0 0 14px', color: '#475950', lineHeight: 1.5 }}>{message}</p>
                {trackingLink && (
                  <a
                    className="yy-confirm"
                    style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}
                    href={trackingLink}
                  >
                    Buyurtma holatini ko‘rish
                  </a>
                )}
                <button type="button" className="yy-confirm" onClick={() => setSelected(null)}>
                  Yopish
                </button>
              </div>
            ) : (
              <>
                <div className="yy-eyebrow">MAHSULOT VA BAND QILISH</div>
                {selected.imageUrl && (
                  <img
                    src={selected.imageUrl}
                    alt={selected.name}
                    style={{
                      width: '100%',
                      height: 170,
                      objectFit: 'cover',
                      borderRadius: 14,
                      marginTop: 8,
                    }}
                  />
                )}
                <h2 style={{ margin: '12px 0 6px' }}>{selected.name}</h2>
                <p style={{ margin: '0 0 8px', fontSize: 14, color: '#4a5d53', lineHeight: 1.5 }}>
                  {selected.business} · {selected.storeAddress || selected.distance}
                  <br />
                  <b>
                    {selected.price.toLocaleString('uz-UZ')} so‘m / {selected.unit || 'ta'}
                  </b>{' '}
                  · {selected.time}
                </p>
                {selected.expiresOn && (
                  <p style={{ margin: '0 0 6px', fontSize: 13 }}>
                    Yaroqli sana: {expiryText(selected.expiresOn)}
                  </p>
                )}

                <label htmlFor="customerName">Ismingiz</label>
                <input
                  id="customerName"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Ism familiya"
                  autoComplete="name"
                />

                <label htmlFor="orderQty">Miqdori ({selected.unit || 'ta'})</label>
                <select
                  id="orderQty"
                  value={orderQty}
                  onChange={(e) => setOrderQty(Number(e.target.value))}
                >
                  {Array.from({ length: Math.min(selected.qty, 10) }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>

                <label htmlFor="phone">Telefon raqamingiz</label>
                <input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+998 90 123 45 67"
                  inputMode="tel"
                  autoComplete="tel"
                />

                <p style={{ margin: '10px 0 0', fontSize: 13, color: '#55685e' }}>
                  Olib ketish: {selected.storeAddress || selected.business}
                </p>

                <button
                  type="button"
                  className="yy-confirm"
                  disabled={submittingOrder}
                  onClick={reserve}
                >
                  {submittingOrder
                    ? 'Yuborilmoqda...'
                    : `Band qilish — ${(selected.price * orderQty).toLocaleString('uz-UZ')} so‘m`}
                </button>
                <p style={{ margin: '10px 0 0', fontSize: 11, color: '#74867c' }}>
                  To‘lovni olib ketayotganda hamkor joyda amalga oshirasiz.
                </p>
              </>
            )}
          </div>
        </div>
      )}

      {panelOpen && (
        <div
          className="yy-modal-back"
          onClick={(e) => {
            if (e.target === e.currentTarget) setPanelOpen(false);
          }}
        >
          <div className="yy-modal" style={{ maxWidth: 780, maxHeight: '90vh', overflow: 'auto' }}>
            <button type="button" className="yy-close" onClick={() => setPanelOpen(false)}>
              ×
            </button>
            <div className="yy-eyebrow">HAMKOR KABINETI</div>
            <h2 style={{ margin: '6px 0 14px' }}>Taklif va buyurtmalar</h2>

            {!panelAuthed ? (
              <form onSubmit={loginPanel}>
                <p style={{ margin: '0 0 8px', color: '#55685e', fontSize: 14 }}>
                  Administrator parolini kiriting.
                </p>
                <label htmlFor="panel-password">Panel paroli</label>
                <input
                  id="panel-password"
                  type="password"
                  value={panelPass}
                  onChange={(e) => setPanelPass(e.target.value)}
                  autoComplete="current-password"
                  required
                />
                <button type="submit" className="yy-confirm">
                  Kirish
                </button>
              </form>
            ) : (
              <>
                <button
                  type="button"
                  className="yy-pill-btn"
                  onClick={async () => {
                    await fetch('/api/merchant/session', { method: 'DELETE' });
                    setPanelAuthed(false);
                  }}
                >
                  Chiqish
                </button>

                <h3 style={{ margin: '18px 0 10px' }}>Yangi taklif qo‘shish</h3>
                <form
                  onSubmit={addOffer}
                  style={{
                    background: '#f5f7f2',
                    padding: 16,
                    borderRadius: 16,
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
                    gap: 10,
                  }}
                >
                  <input name="business" placeholder="Biznes nomi" required />
                  <input name="name" placeholder="Taklif nomi" required />
                  <input name="price" type="number" min="1" placeholder="Chegirmali narx (so‘m)" required />
                  <input name="old" type="number" min="1" placeholder="Eski narx" />
                  <input name="qty" type="number" min="0" step="1" placeholder="Miqdori" required />
                  <select name="unit" aria-label="Miqdor birligi">
                    <option value="ta">Dona (ta)</option>
                    <option value="porsiya">Porsiya</option>
                    <option value="quti">Quti</option>
                    <option value="kg">Kilogramm (kg)</option>
                    <option value="litr">Litr</option>
                  </select>
                  <select name="cat">
                    <option value="cafe">Kafe</option>
                    <option value="bakery">Nonvoyxona</option>
                    <option value="grocery">Oziq-ovqat</option>
                    <option value="dessert">Shirinlik</option>
                  </select>
                  <input name="desc" placeholder="Qisqa izoh" />
                  <input name="time" placeholder="Olib ketish vaqti" />
                  <label style={{ margin: 0 }}>
                    Yaroqli sana
                    <input name="expiresOn" type="date" required style={{ marginTop: 6 }} />
                  </label>
                  <label style={{ gridColumn: '1 / -1', margin: 0 }}>
                    Mahsulot rasmi (JPG, PNG yoki WebP, 5 MB gacha)
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      required
                      onChange={uploadProductImage}
                      style={{ marginTop: 6 }}
                    />
                  </label>
                  {uploading && (
                    <p style={{ gridColumn: '1 / -1', margin: 0, fontSize: 13 }}>Rasm yuklanmoqda…</p>
                  )}
                  {imageUrl && (
                    <img
                      src={imageUrl}
                      alt="Mahsulot rasmi"
                      style={{
                        gridColumn: '1 / -1',
                        width: 150,
                        height: 100,
                        objectFit: 'cover',
                        borderRadius: 12,
                      }}
                    />
                  )}
                  <button type="submit" className="yy-confirm" style={{ gridColumn: '1 / -1', marginTop: 4 }}>
                    Taklifni saqlash
                  </button>
                </form>

                <h3 style={{ margin: '22px 0 10px' }}>Buyurtmalar ({orders.length})</h3>
                {orders.length ? (
                  orders.map((o) => (
                    <div
                      key={o.id}
                      style={{
                        padding: '12px 0',
                        borderBottom: '1px solid #e7ebe4',
                        fontSize: 13,
                        lineHeight: 1.5,
                      }}
                    >
                      <b>
                        #{o.id} · {o.product}
                      </b>
                      <br />
                      {o.business} · {o.name} · {o.phone}
                      <br />
                      {o.quantity} {o.unit} · {Number(o.price).toLocaleString('uz-UZ')} so‘m jami ·{' '}
                      <b>{o.status}</b>
                      <br />
                      <a
                        href={`/orders/${o.trackingToken}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: '#157a50', fontWeight: 600 }}
                      >
                        Mijoz tracking sahifasi
                      </a>
                      <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                        <button
                          type="button"
                          className="yy-pill-btn"
                          onClick={() => updateOrder(o.id, 'Tasdiqlandi')}
                        >
                          Tasdiqlash
                        </button>
                        <button
                          type="button"
                          className="yy-pill-btn"
                          onClick={() => updateOrder(o.id, 'Olib ketildi')}
                        >
                          Olib ketildi
                        </button>
                        <button
                          type="button"
                          className="yy-pill-btn"
                          onClick={() => updateOrder(o.id, 'Bekor qilindi')}
                        >
                          Bekor qilish
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p style={{ fontSize: 13, color: '#64766d' }}>Hozircha buyurtmalar yo‘q.</p>
                )}

                <h3 style={{ margin: '22px 0 10px' }}>Faol takliflar</h3>
                {items.map((p) => (
                  <div
                    key={p.id}
                    style={{
                      padding: '10px 0',
                      borderBottom: '1px solid #e7ebe4',
                      fontSize: 13,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 10,
                    }}
                  >
                    <span>
                      {p.emoji} <b>{p.name}</b> · {p.business} · {p.qty} {p.unit || 'ta'}
                    </span>
                    <button type="button" className="yy-pill-btn" onClick={() => removeOffer(p.id)}>
                      O‘chirish
                    </button>
                  </div>
                ))}
              </>
            )}

            {panelError && (
              <p style={{ color: '#a34335', fontSize: 13, marginTop: 12, fontWeight: 600 }}>
                {panelError}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
