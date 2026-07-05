# ProofPilot — Setup & Configuration

ProofPilot builds and deploys **without any secrets**. Features that need a
service (auth, database, AI, billing) show a clear "setup needed" state until
you add the matching environment variables — there is never fake data or fake
AI output.

Set variables locally in `.env.local` (copy from `.env.example`) and in
production under **Netlify → Site configuration → Environment variables**.
After changing variables in Netlify, trigger a redeploy (variables prefixed
`NEXT_PUBLIC_` are baked in at build time).

---

## Environment variables

| Variable | Required for | Where to get it |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Auth + database | Supabase → Project Settings → Data API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Auth + database | Supabase → Project Settings → API Keys → `anon` `public` |
| `SUPABASE_SERVICE_ROLE_KEY` | Stripe webhook writes | Supabase → Project Settings → API Keys → `service_role` (**secret**) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Billing (client) | Stripe → Developers → API keys → Publishable key |
| `STRIPE_SECRET_KEY` | Billing (server) | Stripe → Developers → API keys → Secret key (**secret**) |
| `STRIPE_WEBHOOK_SECRET` | Billing webhook | Stripe → Developers → Webhooks → your endpoint → Signing secret |
| `ANTHROPIC_API_KEY` | Live AI Research | Anthropic Console → API Keys (**secret**) |
| `NEXT_PUBLIC_SITE_URL` | Redirects, links | Your live URL, e.g. `https://teckro.netlify.app` |

---

## 1. Supabase (authentication + database)

1. Create a project at [supabase.com](https://supabase.com).
2. In the **SQL Editor**, paste the contents of [`supabase/schema.sql`](../supabase/schema.sql) and **Run**. This creates the `profiles`, `projects`, `reports` and `billing_events` tables with Row Level Security.
3. Copy the **Project URL**, **anon key**, and **service_role key** into the variables above.
4. Under **Authentication → URL Configuration**, add your site URL and
   `https://YOUR_DOMAIN/auth/callback` as a redirect URL (and
   `http://localhost:3000/auth/callback` for local dev).

Auth uses email/password and magic links out of the box.

## 2. Stripe (billing)

The three plan **price IDs are already in the code** (`lib/pricing.ts`):

- Founder Report (one-time): `price_1TpSjcDuOK9gZri6Ve4G7wdZ`
- Radar (subscription): `price_1TpSk5DuOK9gZri677WpGg6b`
- Consultant (subscription): `price_1TpSlCDuOK9gZri6b6VYhVqC`

1. Add `STRIPE_SECRET_KEY` and `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`.
2. Create a webhook endpoint at **Stripe → Developers → Webhooks**:
   - URL: `https://YOUR_DOMAIN/api/stripe/webhook`
   - Events: `checkout.session.completed`, `customer.subscription.created`,
     `customer.subscription.updated`, `customer.subscription.deleted`,
     `invoice.payment_failed`
3. Copy the endpoint's **Signing secret** into `STRIPE_WEBHOOK_SECRET`.

## 3. Anthropic (Live AI Research — Phase 2)

1. Create an API key in the [Anthropic Console](https://console.anthropic.com).
2. Set `ANTHROPIC_API_KEY`. Until it is set, research features render a
   "setup needed" state rather than any placeholder output.

## 4. Netlify

The repo includes `netlify.toml` with the Next.js runtime plugin. Import the
repo, add the environment variables above, and deploy. Set `NEXT_PUBLIC_SITE_URL`
to your Netlify URL and redeploy so Stripe redirects and metadata resolve
correctly.

---

## Local development

```bash
npm install
cp .env.example .env.local   # fill in the values you have
npm run dev                  # http://localhost:3000
npm run build                # production build
npm run typecheck            # strict TypeScript check
```
