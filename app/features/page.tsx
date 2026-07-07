import Link from "next/link";
import {
  Search,
  Globe,
  Grid3x3,
  Compass,
  Hammer,
  DollarSign,
  LayoutTemplate,
  FileText,
  Radar,
  Users,
  ArrowRight,
  Check,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { buttonVariants } from "@/components/ui/Button";

export const metadata = {
  title: "Features",
  description:
    "Every Teckro capability: live AI research, web signals with sources, SWOT, strategy, MVP, pricing, landing analysis, premium reports, monitoring and team sharing.",
};

const MODULES: { icon: LucideIcon; title: string; body: string; points: string[]; badge?: string }[] = [
  {
    icon: Search,
    title: "Live AI Research",
    body: "The core engine. A rigorous, honest read on your idea in under a minute.",
    points: [
      "Calibrated 0–100 opportunity score + plain-language verdict",
      "Competitor map across direct, indirect and substitute players",
      "Demand signals, incumbent complaints, differentiators and risks",
      "Concrete next actions — who to talk to, how many, and the success bar",
    ],
    badge: "Two-pass",
  },
  {
    icon: Globe,
    title: "Web Signals",
    body: "A live web scan that lists the sources it used, so you can check every claim.",
    points: [
      "Real-time search at generation time",
      "Recent funding, launches and community signals",
      "Every source URL listed for verification",
    ],
    badge: "Sourced",
  },
  {
    icon: Grid3x3,
    title: "SWOT",
    body: "The classic lens, applied specifically to your idea and market.",
    points: ["Strengths & weaknesses", "Opportunities & threats", "3–5 specific items per quadrant"],
  },
  {
    icon: Compass,
    title: "Strategy",
    body: "A go-to-market plan you could act on this week.",
    points: ["Positioning & unique value", "Channel and wedge recommendations", "A 30-day launch sequence"],
  },
  {
    icon: Hammer,
    title: "MVP Planner",
    body: "Draw the line between must-build and never-build.",
    points: ["Must-haves vs out-of-scope", "Milestones and success metrics", "Scope discipline for a fast v1"],
  },
  {
    icon: DollarSign,
    title: "Pricing",
    body: "A defensible pricing model, not a guess.",
    points: ["Model + tier recommendations", "Willingness-to-pay signals", "Realistic price points"],
  },
  {
    icon: LayoutTemplate,
    title: "Landing Page",
    body: "A conversion-ready blueprint for your first page.",
    points: ["Headline and subhead options", "Section-by-section structure", "The CTA that fits your buyer"],
  },
];

const PILLARS: {
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  body: string;
  points: string[];
}[] = [
  {
    icon: FileText,
    eyebrow: "Deliverable",
    title: "A premium founder report",
    body: "Every module assembles into one decision-ready document — an executive summary with score and confidence meters, a competitor table, color-coded strengths and risks, and a numbered action plan.",
    points: [
      "Executive summary with visual score + verdict",
      "Export to Markdown or print/Save-as-PDF",
      "Private, revocable share links for anyone",
      "Clear labeling of AI inference vs web-sourced data",
    ],
  },
  {
    icon: Radar,
    eyebrow: "Stay ahead",
    title: "Radar monitoring",
    body: "Add competitors and pages to a watchlist. Teckro checks them on a schedule and only tells you when the meaningful, visible content actually changes.",
    points: [
      "Daily scheduled checks",
      "Content-aware change detection (no markup-churn noise)",
      "In-app notifications with an unread badge",
      "Per-item last-checked status and errors",
    ],
  },
  {
    icon: Users,
    eyebrow: "Together",
    title: "Team sharing",
    body: "Invite collaborators to a project by email. They get read access to everything — research, analyses, watchlist and the report — while you stay in control of changes.",
    points: [
      "Invite by email in one click",
      "Read-only viewer access, enforced by database security",
      "Shared projects appear instantly for teammates",
    ],
  },
];

export default function FeaturesPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-grid opacity-60" aria-hidden />
      <div
        className="pointer-events-none absolute -left-32 top-24 -z-10 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl animate-aurora"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-40 top-72 -z-10 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl animate-aurora [animation-delay:-9s]"
        aria-hidden
      />
      <Nav />

      {/* Hero */}
      <section className="mx-auto max-w-4xl px-6 py-20 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-950 px-4 py-2 text-sm text-neutral-300">
          <Search className="h-4 w-4" aria-hidden />
          7 AI modules · one workflow
        </div>
        <h1 className="mt-6 pb-2 text-4xl font-black leading-[1.08] tracking-tight text-gradient sm:text-6xl">
          Everything you need to validate an idea.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-neutral-300">
          Teckro turns a raw idea into competitor intelligence, sourced market signals, a full
          strategy, and a decision-ready founder report — in one place, in minutes.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/dashboard" className={buttonVariants({ size: "lg" })}>
            Start free — no card required
          </Link>
          <Link href="/pricing" className={buttonVariants({ variant: "secondary", size: "lg" })}>
            See pricing
          </Link>
        </div>
      </section>

      {/* Modules grid */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        <h2 className="text-3xl font-black sm:text-4xl">The analysis modules</h2>
        <p className="mt-3 max-w-2xl text-neutral-400">
          Run any module in one click. Each one produces specific, evidence-directional output — no
          generic filler.
        </p>
        <Reveal className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {MODULES.map(({ icon: Icon, title, body, points, badge }) => (
            <article
              key={title}
              className="flex flex-col rounded-3xl border border-neutral-800/80 bg-neutral-950/60 p-6"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-neutral-900 text-white">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                {badge && (
                  <span className="rounded-full border border-neutral-700 px-2.5 py-0.5 text-xs font-semibold text-neutral-300">
                    {badge}
                  </span>
                )}
              </div>
              <h3 className="text-lg font-bold text-white">{title}</h3>
              <p className="mt-1 text-sm text-neutral-400">{body}</p>
              <ul className="mt-4 space-y-2">
                {points.map((p) => (
                  <li key={p} className="flex gap-2 text-sm text-neutral-300">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" aria-hidden />
                    {p}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </Reveal>
      </section>

      {/* Pillar deep-dives */}
      {PILLARS.map(({ icon: Icon, eyebrow, title, body, points }, i) => (
        <section key={title} className="mx-auto max-w-7xl px-6 py-12">
          <Reveal
            className={`grid items-center gap-8 lg:grid-cols-2 ${i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""}`}
          >
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-neutral-500">
                {eyebrow}
              </p>
              <h2 className="mt-2 text-3xl font-black sm:text-4xl">{title}</h2>
              <p className="mt-4 text-neutral-400">{body}</p>
              <ul className="mt-6 space-y-3">
                {points.map((p) => (
                  <li key={p} className="flex gap-3 text-neutral-300">
                    <Check className="mt-1 h-4 w-4 shrink-0 text-emerald-400" aria-hidden />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex items-center justify-center rounded-3xl border border-neutral-800/80 bg-gradient-to-br from-neutral-900/70 to-neutral-950/50 p-12">
              <Icon className="h-24 w-24 text-neutral-700" aria-hidden />
            </div>
          </Reveal>
        </section>
      ))}

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="rounded-3xl border border-neutral-800/80 bg-gradient-to-br from-neutral-900 to-neutral-950 p-10 text-center">
          <h2 className="text-3xl font-black sm:text-4xl">Try every feature free for 5 days.</h2>
          <p className="mx-auto mt-3 max-w-xl text-neutral-400">
            No credit card required. Start validating your idea in the next minute.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/dashboard" className={buttonVariants({ size: "lg" })}>
              Start your free trial
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link href="/faq" className={buttonVariants({ variant: "secondary", size: "lg" })}>
              Read the FAQ
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
