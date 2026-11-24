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
- Redeploy after setting the variable.

## Current scope
The product list reads from Neon and customer reservations are written to `orders`, decrementing inventory atomically. Online payments, SMS verification, Google Maps, and authenticated merchant management are not implemented yet. Do not expose a real customer-facing production site until access control, rate limiting, privacy/retention policy, and merchant workflows are added.
