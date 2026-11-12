# Prakash Safety — Website

E-commerce + catalog website for **Prakash Safety** (safety jacket manufacturer & industrial safety products supplier, Meerut). Storefront with cart, WhatsApp + Razorpay checkout, and a self-service admin panel for managing products, categories, orders, enquiries and site settings...

**Live domain:** prakashsafety.com

## Tech stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** — brand theme (hi-vis orange `#F26522` on a warm neutral ground), Archivo display + Inter body
- **Prisma** ORM + **PostgreSQL** (Neon in production)
- **Razorpay** for online payments (UPI / cards / netbanking) — optional, toggleable
- Cookie-based admin auth (JWT signed with `jose`)
- **Vercel** for hosting; **Vercel Blob** for product image uploads

## Project structure

```
prisma/
  schema.prisma        # data models (Product, Category, Order, Enquiry, Settings)
  seed.ts              # sample categories + 10 products
public/
  products/            # product photos
  brand/               # brand / hero images
src/
  app/
    (storefront)/      # public site: home, products, about, contact, cart, checkout
    admin/             # admin panel (protected by middleware)
    api/               # route handlers (public + /api/admin/* CRUD)
    sitemap.ts, robots.ts, icon.svg
  components/          # UI components (storefront + admin/)
  lib/                 # prisma, auth, settings, razorpay, whatsapp, validation, constants
  middleware.ts        # protects /admin routes
```

> **Where to change things:** business contact/address → `src/lib/constants.ts`. Theme colours → `tailwind.config.ts`. Data shape → `prisma/schema.prisma`. Page content lives in the matching folder under `src/app/(storefront)/`.

## Local setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy env and fill values:
   ```bash
   cp .env.example .env
   ```
   At minimum set `DATABASE_URL` (a free Neon Postgres works) and `AUTH_SECRET`.
3. Create tables and seed sample data:
   ```bash
   npm run db:push
   npm run db:seed
   ```
4. Run:
   ```bash
   npm run dev
   ```
   Storefront → http://localhost:3000 · Admin → http://localhost:3000/admin

## Admin panel

- URL: `/admin` (default login **admin / huang11** — change via `ADMIN_USERNAME` / `ADMIN_PASSWORD`).
- Add / edit / delete products and categories, upload images, view & update orders and enquiries.
- **Settings** page: toggle online payment, set the WhatsApp number, edit the homepage hero and announcement bar.

## Product prices are optional

Price is **off by default** for every product, existing ones included.

- Each product has a **price tag** switch (Admin → Products → edit → *Pricing*). While it is off, the storefront shows **"Price on request"** — a stored price is kept but never displayed.
- A product can also be saved with no price at all, so it can be launched before pricing is decided.
- Unpriced items still go in the cart, as **enquiry lines**. The cart and checkout total only the priced lines and label the total accordingly.
- **Online payment is disabled for any cart containing an unpriced item** — those orders go through WhatsApp so the team can quote. The server enforces this too, not just the UI.
- Products with no public price omit the `offers` block from their Product JSON-LD (an offer without a price is invalid structured data).

Switching a price tag on requires a price to be set; the form and the API both reject the mismatch.

## Checkout / payments

- **Default:** customer sees the total, then "Order on WhatsApp" sends the cart to the business WhatsApp; bulk buyers are pointed to call/contact.
- **Online payment:** add `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `NEXT_PUBLIC_RAZORPAY_KEY_ID` and turn on **Online payment** in admin Settings. Works in Razorpay **test mode** immediately; complete Razorpay KYC (GST already available) and swap in live keys to go live — no code changes.

## Deploy to Vercel

1. Push this repo to GitHub.
2. Create a Neon Postgres database; copy its connection string.
3. Import the repo in Vercel and add all env vars from `.env.example` (set `NEXT_PUBLIC_SITE_URL=https://prakashsafety.com`).
4. Add a Vercel Blob store (for image uploads) — `BLOB_READ_WRITE_TOKEN` is set automatically.
5. After the first deploy run `npx prisma db push` and `npm run db:seed` against the production DB (or from Vercel's CLI).
6. Point the `prakashsafety.com` domain at the Vercel project.

## Schema changes

`Product.price` is nullable and `Product.showPrice` / `OrderItem.price` were added. Both are additive, so applying them to an existing database is non-destructive:

```bash
npx prisma db push
```

Existing rows keep their prices and get `showPrice = false`, i.e. every product goes quiet until its price tag is switched on.

## SSL / domains

`prakashsafety.com` (apex) is the canonical host. `www` must be a **redirect** to it, not a second origin.

Required setup in **Vercel → Project → Settings → Domains**:

| Domain | Role | DNS record |
| --- | --- | --- |
| `prakashsafety.com` | Primary | `A` → the IP Vercel shows (currently `216.198.79.1`) |
| `www.prakashsafety.com` | Redirect (308) to the apex | `CNAME` → the target Vercel shows for the project |

Vercel issues and renews the Let's Encrypt certificate automatically, and 308-redirects HTTP→HTTPS at the edge. **Both hostnames must appear on the issued certificate.** Check with:

```bash
echo | openssl s_client -connect prakashsafety.com:443 -servername prakashsafety.com 2>/dev/null | openssl x509 -noout -dates -ext subjectAltName
```

The `subjectAltName` list must contain `prakashsafety.com` **and** `www.prakashsafety.com`. If `www` is missing, browsers hitting `https://www.…` get a certificate-mismatch warning before any redirect can run — remove and re-add the `www` domain in Vercel to force re-issuance.

Do not add `includeSubDomains` or `preload` to the HSTS header in `next.config.mjs` until that certificate covers every subdomain in use; doing so earlier makes the failure permanent and unskippable for returning visitors.

## SEO & performance

Server-rendered pages, per-page metadata, Open Graph, JSON-LD (Organization + Product), `sitemap.xml`, `robots.txt`, `next/image` optimisation, security headers, and mobile-first responsive layout (tested down to 320px / iPhone SE). 
