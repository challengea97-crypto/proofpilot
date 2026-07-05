# Teckro — v1 scope (shipped)

Teckro v1 is feature-complete. Everything below is real, typed, and builds cleanly
(`npm run build`). There is no placeholder code and no demo mode.

- **Framework**: Next.js 15 + React 19, strict TypeScript, Tailwind.
- **Auth**: Supabase email/password + magic link + full password reset; protected `/dashboard`.
- **Projects**: create / list / search / open / delete (RLS), tabbed workspace, example prefill.
- **Live AI Research** (Groq): opportunity score + verdict, competitors, demand signals,
  incumbent complaints, differentiators, risks, next actions — with run history.
- **Analysis modules**: SWOT, Strategy, MVP Planner, Pricing, Landing — one generic engine.
- **Founder report**: assembled from all modules; Markdown download + print/PDF.
- **Saved reports** + **public share links** (`/r/[token]`, safe token lookup).
- **Billing**: auth-linked Stripe checkout, webhook plan sync, customer portal,
  enforced plan tiers (Free = 3 projects; sharing = paid; watchlists = Radar+).
- **Watchlists** + **scheduled monitoring** (daily Netlify function) + **notifications**
  (in-app inbox + unread badge).
- **Admin**: allowlist-gated `/dashboard/admin` with real platform stats.
- **Marketing site**: landing (product preview, use cases, comparison, FAQ teaser),
  pricing with comparison table, FAQ, About, Contact (working form), Terms, Privacy.
- **Platform**: PWA manifest, OG/Twitter share images, robots + sitemap, favicon,
  security headers, error boundaries, loading skeletons, a11y (labels, focus, skip link),
  per-request auth deduping.

## Ideas for a future major version (not scheduled)

- Team workspaces / multi-user collaboration (multi-tenant refactor).
- Web-grounded citations: pair Groq with a search API (Tavily / Brave), store source URLs
  per claim.
- Email notifications (transactional provider) alongside the in-app inbox.
