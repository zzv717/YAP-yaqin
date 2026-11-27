# Yaqin — Next.js + Neon Postgres

## Local setup
1. Install Node.js 20 or newer.
2. Run `npm install`.
3. Copy `.env.example` to `.env.local` and set `DATABASE_URL` from Neon. Keep Neon's pooled connection enabled; never commit this secret.
4. Run `db-schema.sql` once in the Neon SQL Editor (production branch).
5. Run `npm run dev` and open http://localhost:3000.

## Vercel setup
- Import this repository and set Root Directory to `yaqin-next` if this folder is inside a larger repository.
- Add `DATABASE_URL` in Project Settings → Environment Variables for Production, Preview, and Development.
- Add `MERCHANT_PANEL_PASSWORD` with a long unique secret in the same settings (never put it in GitHub).
- Create a Vercel Blob store and add its `BLOB_READ_WRITE_TOKEN` in the project settings for image uploads.
- Redeploy after setting the variables. Run `db-migration-image.sql` and `db-migration-units.sql` once each in Neon to enable product photos and stock units.

## Current scope
The product list reads from Neon and customer reservations are written to `orders`, decrementing inventory atomically. The single admin merchant panel can add offers, review orders, and manage listings. Product photos use Vercel Blob. Online payments, SMS verification, Google Maps, and separate accounts for each merchant are not implemented yet; add those before a broad public launch.
