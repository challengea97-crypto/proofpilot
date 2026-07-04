# Prompt for Claude Code / Codex

You are working in the ProofPilot repository.

Goal:
Turn this production starter into a full SaaS.

Keep:
- Next.js + TypeScript
- Tailwind CSS
- Supabase Auth/Database
- Stripe Checkout/Webhooks
- Netlify deploy

Stripe price IDs:
- Founder Report: price_1TpSjcDuOK9gZri6Ve4G7wdZ
- Radar: price_1TpSk5DuOK9gZri677WpGg6b
- Consultant: price_1TpSlCDuOK9gZri6b6VYhVqC

Do not hardcode secrets. Use env vars only.

Priority tasks:
1. Add Supabase login/signup/logout UI.
2. Persist projects and reports to Supabase.
3. Connect billing_events to user plan access.
4. Add real AI routes for research, competitors, reviews, landing audit, and strategy.
5. Add source citations and confidence labels.
6. Add PDF/Markdown export.
7. Polish dashboard UI.
8. Add tests.
9. Ensure Netlify build passes.

Quality rules:
- No fake claims as facts.
- Evidence must be source-linked where possible.
- Keep mobile responsive.
- Run npm build before finishing.
