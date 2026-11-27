# Ko‘rchi — chegirmali oziq-ovqat platformasi

## Local development
1. Install Node.js 20+.
2. Run `npm install`.
3. Copy `.env.example` to `.env.local`; set `DATABASE_URL`, `MERCHANT_PANEL_PASSWORD`, and `BLOB_READ_WRITE_TOKEN`. Never commit real secrets.
4. On an empty Neon database, run `db-schema.sql` once. For the existing Neon database, run `db-migration-demo.sql` once; it idempotently ensures image/unit/store/expiry columns and seeds four sample stores plus 12 clearly labelled demo products.
5. Run `npm run dev` and open http://localhost:3000.

## Vercel
This repository has its active Next.js app at the repository root (`app/`, `package.json`). Set Root Directory to the repository root, not the old `yaqin-next/` subfolder. Configure `DATABASE_URL`, `MERCHANT_PANEL_PASSWORD`, and `BLOB_READ_WRITE_TOKEN`; then deploy.

## Current MVP
- Customer product catalogue and category filters.
- Product reservations; stock decreases atomically in Neon Postgres.
- Single-password partner panel: add offers, upload required product photos, review/confirm/cancel reservations, deactivate offers.
- Product image files stored in Vercel Blob. Public product photos should not contain private information.
- Units supported: ta, porsiya, quti, kg, litr (stock counts are whole units).
- Impact counter displays non-cancelled reservations, not independently verified food waste avoided.

Not implemented yet: multiple individual shop accounts, expiry-date tracking and automatic discounts, SMS, online payments, pickup QR, delivery, map integration, reviews, and measured CO₂/water savings. Don't claim these as working features in a pitch.
