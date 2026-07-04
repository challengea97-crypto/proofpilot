# ProofPilot

AI startup validation platform with live research, competitor intelligence, review intelligence, landing-page audits, AI strategy reports, and Stripe payments.

## Stack

- Next.js + TypeScript
- Tailwind CSS
- Supabase Auth + Database
- Stripe Checkout + Webhooks
- Netlify hosting

## Stripe Price IDs

- Founder Report: `price_1TpSjcDuOK9gZri6Ve4G7wdZ`
- Radar: `price_1TpSk5DuOK9gZri677WpGg6b`
- Consultant: `price_1TpSlCDuOK9gZri6b6VYhVqC`

## Local setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

## Environment variables

Never commit real secrets.

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

SUPABASE_SERVICE_ROLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Netlify

Build command:

```bash
npm run build
```

Publish directory:

```bash
.next
```

Install Netlify Next.js runtime/plugin if Netlify does not auto-detect Next.js.

## Stripe webhook URL

Use your production site URL:

```text
https://YOUR_DOMAIN.com/api/stripe/webhook
```

Events:

- `checkout.session.completed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_failed`

## Supabase

Run `supabase/schema.sql` inside the Supabase SQL editor.
