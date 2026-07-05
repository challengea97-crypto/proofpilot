# Teckro — v1 (complete)

Teckro v1 is finished. Everything below is real, typed, and builds cleanly
(`npm run build`). There is no placeholder code, no demo mode, and nothing deferred.

- **Framework**: Next.js 15 + React 19, strict TypeScript, Tailwind.
- **Auth**: Supabase email/password + magic link + full password reset; protected `/dashboard`.
- **Projects**: create / list / search / open / delete (RLS), tabbed workspace, example prefill.
- **Live AI Research** (Groq): opportunity score + verdict, competitors, demand signals,
  incumbent complaints, differentiators, risks, next actions — with run history.
- **Analysis modules**: Web Signals (live web search with source URLs, via groq/compound),
  SWOT, Strategy, MVP Planner, Pricing, Landing — one generic engine.
- **Founder report**: assembled from all modules; Markdown download + print/PDF.
- **Saved reports** + **public share links** (`/r/[token]`, safe token lookup).
- **Team sharing**: Consultant-plan owners invite collaborators by email; members get
  read access to the whole project (RLS-enforced viewer role).
- **Billing**: auth-linked Stripe checkout, webhook plan sync, customer portal,
  enforced tiers (Free = 3 projects; share links = paid; watchlists = Radar+;
  team sharing = Consultant).
- **Watchlists** + **scheduled monitoring** (daily Netlify function) + **notifications**
  (in-app inbox + unread badge).
- **Admin**: allowlist-gated `/dashboard/admin` with real platform stats.
- **Marketing site**: landing (product preview, stats, use cases, comparison, FAQ teaser),
  pricing with comparison table, FAQ, About, Contact (working form), Terms, Privacy.
- **Platform**: PWA manifest, OG/Twitter share images, robots + sitemap, favicon,
  security headers, error boundaries, loading skeletons, a11y (labels, focus, skip link),
  per-request auth deduping.
