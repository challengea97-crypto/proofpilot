# Teckro — Roadmap & status

Honest status. Everything under **Shipped** is real, typed, and builds cleanly
(`npm run build`). Items under **Planned** are not yet implemented — each has a
concrete next step, not a placeholder.

## Shipped

- **Framework**: Next.js 15 + React 19, strict TypeScript, Tailwind.
- **Auth**: Supabase email/password + magic link, middleware-protected `/dashboard`.
- **Projects**: create / list / open / delete (RLS), tabbed project workspace.
- **Live AI Research**: real Claude analysis (opportunity score, competitors, demand
  signals, incumbent complaints, differentiators, risks, next actions).
- **Analysis modules**: AI Strategy, MVP Planner, Pricing, Landing (one generic engine).
- **Founder report**: assembled from research + analyses; Markdown download + print/PDF.
- **Saved reports**: `/dashboard/reports` + report viewer.
- **Shareable reports**: public read-only `/r/[token]` links (safe server-side lookup).
- **Billing**: auth-linked Stripe checkout, plan sync via webhook, customer portal.
- **Watchlists**: per-project competitor/page tracking.
- **Notifications**: in-app inbox + sidebar unread badge, auto-fired on AI/report events.
- **Scheduled monitoring**: `/api/cron/monitor` + daily Netlify scheduled function that
  hashes watchlist URLs and notifies on change.
- **Admin**: `ADMIN_EMAILS`-gated `/dashboard/admin` with real platform counts.
- **Hardening**: loading skeletons, error boundaries, 404, security headers, and
  "setup needed" states everywhere a key is missing (no fake data).

## Planned (clear next steps)

### Team workspaces & sharing (largest remaining item)
Projects are currently per-user.
1. Add `workspaces` and `workspace_members` (`role`: owner/admin/member) tables + RLS.
2. Add `workspace_id` to `projects`; scope every project/report/analysis query by membership.
3. Invite flow (email invite → accept), a workspace switcher in the sidebar.

This is a multi-tenant refactor touching every data query — best done as a focused effort.

### Web-grounded citations
Research is model-reasoned and clearly labelled "directional". To add real source-linked
evidence, upgrade `@anthropic-ai/sdk` past the pinned `0.32.1`, enable the `web_search`
server tool, and store cited URLs alongside each claim.
