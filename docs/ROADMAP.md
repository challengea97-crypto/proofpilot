# Teckro — Roadmap & status

Honest status of the build. Everything under **Shipped** is real, typed, and builds
cleanly (`npm run build`). Items under **Planned** are not yet implemented — each has a
concrete next step rather than a placeholder.

## Shipped

- **Framework**: Next.js 15 + React 19, TypeScript (strict), Tailwind.
- **Auth**: Supabase email/password + magic link, middleware-protected `/dashboard`.
- **Projects**: create / list / open / delete (RLS), tabbed project workspace.
- **Live AI Research**: real Claude analysis (opportunity score, competitors, demand
  signals, incumbent complaints, differentiators, risks, next actions).
- **Analysis modules**: AI Strategy, MVP Planner, Pricing, Landing — one generic engine.
- **Founder report**: assembled from research + analyses; Markdown download + print/PDF.
- **Saved reports**: `/dashboard/reports` + report viewer.
- **Billing**: auth-linked Stripe checkout, plan sync via webhook, customer portal.
- **Watchlists**: per-project competitor/page tracking.
- **Polish**: loading skeletons, error boundaries, 404, security headers, "setup needed"
  states everywhere a key is missing (no fake data).

## Planned (clear TODOs)

### Background monitoring & notifications
Watchlist storage is shipped; automated checking is not.
1. Add a `notifications` table (`user_id`, `project_id`, `title`, `body`, `read`, `created_at`) + RLS.
2. Add a scheduled job — Netlify Scheduled Functions (`netlify/functions/monitor.ts` with a
   `schedule` export) or Supabase `pg_cron` — that re-checks watchlist URLs / re-runs research
   and inserts notifications on change.
3. Surface a bell + unread count in `AppShell`, and a `/dashboard/notifications` page.

### Team workspaces & sharing
Projects are currently per-user.
1. Add `workspaces` and `workspace_members` (`role`: owner/admin/member) tables + RLS.
2. Add `workspace_id` to `projects`; scope queries by membership.
3. Invite flow (email invite → accept), a workspace switcher in the sidebar, and a shareable
   read-only report link (signed token).

### Admin dashboard & analytics
1. Gate `/dashboard/admin` behind an `ADMIN_EMAILS` allowlist (env), checked in the layout.
2. Show counts (users, projects, reports) via service-role aggregate queries, and revenue via
   the Stripe API.
3. Product analytics: aggregate events into a `usage_events` table, or wire a provider.

### Evidence / citations (web-grounded)
Research is currently model-reasoned and clearly labelled "directional". To add real
source-linked evidence, enable Anthropic's `web_search` server tool (requires a newer
`@anthropic-ai/sdk` than the pinned `0.32.1`) and store cited URLs alongside each claim.
