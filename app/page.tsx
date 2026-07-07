import Link from "next/link";
import {
  ArrowRight,
  Search,
  Target,
  FileText,
  MessagesSquare,
  LayoutTemplate,
  DollarSign,
  ShieldCheck,
  Check,
  Minus,
  User,
  Briefcase,
  Users,
} from "lucide-react";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { ProductPreview } from "@/components/ProductPreview";
import { buttonVariants } from "@/components/ui/Button";

const FEATURES = [
  {
    icon: Search,
    title: "Competitor database",
    body: "Direct, indirect and substitute competitors with positioning and pricing signals.",
  },
  {
    icon: MessagesSquare,
    title: "Review intelligence",
    body: "Mine real complaints and feature requests to find where incumbents fall short.",
  },
  {
    icon: Target,
    title: "Opportunity scoring",
    body: "Demand, pain, saturation and differentiation combined into one honest score.",
  },
  {
    icon: LayoutTemplate,
    title: "Landing page analyzer",
    body: "Audit messaging, clarity and conversion structure before you drive traffic.",
  },
  {
    icon: DollarSign,
    title: "Pricing analysis",
    body: "Benchmark tiers and willingness-to-pay so you don't leave money on the table.",
  },
  {
    icon: FileText,
    title: "Founder report",
    body: "MVP scope, strategy, GTM and a launch checklist — exportable, with web sources listed where the web was searched.",
  },
];

const STEPS = [
  { n: "01", title: "Describe your idea", body: "Add the idea, audience and the problem you remove." },
  { n: "02", title: "Run the analysis", body: "Competitors, demand, reviews and pricing, gathered and scored." },
  { n: "03", title: "Get a founder report", body: "A decision-ready plan you can act on — or share with your team." },
];

const STATS = [
  "7 AI modules",
  "First report in about a minute",
  "Markdown & PDF export",
  "Cancel anytime",
];

const USE_CASES = [
  {
    icon: User,
    title: "Solo founders",
    body: "Pressure-test your idea before you spend months — or your savings — building it.",
  },
  {
    icon: Briefcase,
    title: "Agencies & consultants",
    body: "Turn client discovery into structured validation reports you can share in a link.",
  },
  {
    icon: Users,
    title: "Product teams",
    body: "Score new market and feature bets with a repeatable framework before roadmap fights.",
  },
];

const VS_ROWS: [string, boolean][] = [
  ["Structured validation framework (score, SWOT, strategy, MVP, pricing)", false],
  ["Saved projects with run history", false],
  ["One-click founder report with PDF export", false],
  ["Shareable read-only report links", false],
  ["Watchlist monitoring with alerts", false],
  ["Share projects with your team", false],
  ["Answers your questions conversationally", true],
];

const FOUNDER_QA: { ask: string; answer: string }[] = [
  {
    ask: "“Is my idea actually worth building?”",
    answer: "Run Live AI Research: an honest 0–100 opportunity score, a clear verdict, and the risks nobody tells you about.",
  },
  {
    ask: "“Who am I really competing with?”",
    answer: "A competitor map across direct, indirect and substitute players — plus a live web scan with the sources it used.",
  },
  {
    ask: "“What should I build first?”",
    answer: "The MVP Planner draws the line: must-haves, next-ups, and what to refuse to build — with milestones and success metrics.",
  },
];

const FAQ_TEASER: [string, string][] = [
  [
    "Is the AI real, or is this a demo?",
    "It's real. Every research run and analysis is generated live by an AI model and validated before it's saved. There is no mock output.",
  ],
  [
    "Is there a free plan?",
    "Yes — start free with up to 3 projects, full AI research and analyses, and founder reports.",
  ],
  [
    "Can I export and share reports?",
    "Every report exports to Markdown or PDF, and paid plans can share a private read-only link.",
  ],
];

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-ink">
      <div
        className="pointer-events-none absolute -left-32 top-24 -z-10 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl animate-aurora"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-40 top-52 -z-10 h-[28rem] w-[28rem] rounded-full bg-indigo-500/10 blur-3xl animate-aurora [animation-delay:-9s]"
        aria-hidden
      />
      <Nav />

      {/* Hero */}
      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-950 px-4 py-2 text-sm text-neutral-300">
            <ShieldCheck className="h-4 w-4" aria-hidden />
            AI-powered startup validation
          </div>
          <h1 className="mt-6 max-w-4xl pb-2 text-5xl font-black leading-[1.08] tracking-tight text-gradient sm:text-7xl">
            Validate your startup before you waste months building.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-neutral-300">
            Teckro turns a raw idea into a decision-ready report: competitors, complaints, landing
            copy, MVP roadmap, pricing strategy, and launch plan — with live web signals and their
            sources.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/dashboard" className={buttonVariants({ size: "lg" })}>
              Start 5-day free trial
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link href="/features" className={buttonVariants({ variant: "secondary", size: "lg" })}>
              Explore features
            </Link>
          </div>
          <p className="mt-3 text-sm text-neutral-500">No credit card required · cancel anytime</p>
        </div>

        <div className="rounded-3xl border border-neutral-800/80 bg-neutral-950/60 p-6 shadow-glow backdrop-blur">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-neutral-500">Sample output</p>
          <div className="mt-5 space-y-4">
            {[
              { title: "Competitor map", body: "Direct, indirect, substitute, pricing signals", Icon: Search },
              { title: "Opportunity score", body: "Demand, pain, saturation, differentiation", Icon: Target },
              { title: "Founder report", body: "MVP scope, strategy, GTM, launch checklist", Icon: FileText },
            ].map(({ title, body, Icon }) => (
              <div key={title} className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4">
                <div className="flex items-center gap-3">
                  <Icon size={18} aria-hidden />
                  <p className="font-bold">{title}</p>
                </div>
                <p className="mt-2 text-sm text-neutral-400">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="mx-auto max-w-7xl px-6 pb-10">
        <div className="grid gap-3 rounded-3xl border border-neutral-800/80 bg-neutral-950/60 p-6 text-center sm:grid-cols-4">
          {STATS.map((stat) => (
            <p key={stat} className="text-sm font-semibold text-neutral-300">
              {stat}
            </p>
          ))}
        </div>
      </section>

      {/* Product preview */}
      <section className="mx-auto max-w-7xl px-6 pb-6">
        <Reveal>
          <ProductPreview />
        </Reveal>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        <h2 className="text-3xl font-black sm:text-4xl">Everything you need to de-risk an idea</h2>
        <p className="mt-3 max-w-2xl text-neutral-400">
          Each module produces evidence you can act on — not vibes.
        </p>
        <Reveal className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="rounded-3xl border border-neutral-800/80 bg-neutral-950/60 p-6 transition hover:border-neutral-700"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-neutral-900 text-white">
                <Icon className="h-5 w-5" aria-hidden />
              </div>
              <h3 className="font-bold text-white">{title}</h3>
              <p className="mt-2 text-sm text-neutral-400">{body}</p>
            </div>
          ))}
        </Reveal>
      </section>

      {/* Use cases */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        <h2 className="text-3xl font-black sm:text-4xl">Built for the way you work</h2>
        <Reveal className="mt-8 grid gap-4 md:grid-cols-3">
          {USE_CASES.map(({ icon: Icon, title, body }) => (
            <div key={title} className="rounded-3xl border border-neutral-800/80 bg-neutral-950/60 p-6">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-neutral-900 text-white">
                <Icon className="h-5 w-5" aria-hidden />
              </div>
              <h3 className="font-bold text-white">{title}</h3>
              <p className="mt-2 text-sm text-neutral-400">{body}</p>
            </div>
          ))}
        </Reveal>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        <h2 className="text-3xl font-black sm:text-4xl">How it works</h2>
        <Reveal className="mt-8 grid gap-4 md:grid-cols-3">
          {STEPS.map((step) => (
            <div key={step.n} className="rounded-3xl border border-neutral-800/80 bg-neutral-950/60 p-6">
              <p className="text-sm font-black text-neutral-600">{step.n}</p>
              <h3 className="mt-2 text-lg font-bold">{step.title}</h3>
              <p className="mt-2 text-sm text-neutral-400">{step.body}</p>
            </div>
          ))}
        </Reveal>
      </section>

      {/* Founders ask → Teckro answers */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        <h2 className="text-3xl font-black sm:text-4xl">The questions that keep founders up at night</h2>
        <Reveal className="mt-8 grid gap-4 md:grid-cols-3">
          {FOUNDER_QA.map(({ ask, answer }) => (
            <figure
              key={ask}
              className="flex flex-col rounded-3xl border border-neutral-800/80 bg-gradient-to-b from-neutral-900/70 to-neutral-950/60 p-6"
            >
              <blockquote className="text-lg font-bold leading-snug text-white">{ask}</blockquote>
              <figcaption className="mt-4 border-t border-neutral-800 pt-4 text-sm leading-6 text-neutral-400">
                {answer}
              </figcaption>
            </figure>
          ))}
        </Reveal>
      </section>

      {/* Why not just chat? */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        <h2 className="text-3xl font-black sm:text-4xl">“Can’t I just ask an AI chatbot?”</h2>
        <p className="mt-3 max-w-2xl text-neutral-400">
          You can — and you’ll get a wall of text that disappears. Teckro turns the same AI power
          into a structured, saved, exportable validation system.
        </p>
        <Reveal className="mt-8 overflow-x-auto rounded-3xl border border-neutral-800">
          <table className="w-full min-w-[560px] border-collapse text-left">
            <thead>
              <tr className="border-b border-neutral-800 bg-neutral-950/60">
                <th scope="col" className="p-4 text-sm font-bold text-neutral-300">Capability</th>
                <th scope="col" className="p-4 text-center text-sm font-bold text-white">Generic AI chat</th>
                <th scope="col" className="p-4 text-center text-sm font-bold text-white">Teckro</th>
              </tr>
            </thead>
            <tbody>
              {VS_ROWS.map(([capability, chatHasIt], i) => (
                <tr key={capability} className={i % 2 === 1 ? "bg-neutral-950/30" : undefined}>
                  <th scope="row" className="p-4 text-left text-sm font-medium text-neutral-300">
                    {capability}
                  </th>
                  <td className="p-4 text-center">
                    {chatHasIt ? (
                      <Check className="mx-auto h-5 w-5 text-emerald-400" aria-label="Yes" />
                    ) : (
                      <Minus className="mx-auto h-4 w-4 text-neutral-700" aria-label="No" />
                    )}
                  </td>
                  <td className="p-4 text-center">
                    <Check className="mx-auto h-5 w-5 text-emerald-400" aria-label="Yes" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Reveal>
      </section>

      {/* FAQ teaser */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        <h2 className="text-3xl font-black sm:text-4xl">Common questions</h2>
        <div className="mt-8 grid gap-3 md:grid-cols-3">
          {FAQ_TEASER.map(([q, a]) => (
            <div key={q} className="rounded-3xl border border-neutral-800/80 bg-neutral-950/60 p-6">
              <h3 className="font-bold text-white">{q}</h3>
              <p className="mt-2 text-sm leading-6 text-neutral-400">{a}</p>
            </div>
          ))}
        </div>
        <Link
          href="/faq"
          className="mt-6 inline-flex items-center gap-1 text-sm text-neutral-400 hover:text-white"
        >
          See all FAQs <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <Reveal className="rounded-3xl border border-neutral-800/80 bg-gradient-to-br from-neutral-900 to-neutral-950 p-10 text-center">
          <h2 className="text-3xl font-black sm:text-4xl">Stop guessing. Start proving.</h2>
          <p className="mx-auto mt-3 max-w-xl text-neutral-400">
            Start your 5-day free trial — no credit card — and get your first report in minutes.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/dashboard" className={buttonVariants({ size: "lg" })}>
              Start 5-day free trial
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link href="/pricing" className={buttonVariants({ variant: "secondary", size: "lg" })}>
              View pricing
            </Link>
          </div>
        </Reveal>
      </section>

      <Footer />
    </main>
  );
}
