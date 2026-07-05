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
} from "lucide-react";
import { Nav } from "@/components/Nav";
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
    body: "MVP scope, strategy, GTM and a launch checklist — exportable and evidence-linked.",
  },
];

const STEPS = [
  { n: "01", title: "Describe your idea", body: "Add the idea, audience and the problem you remove." },
  { n: "02", title: "Run the analysis", body: "Competitors, demand, reviews and pricing, gathered and scored." },
  { n: "03", title: "Get a founder report", body: "A source-aware plan you can act on — or share with your team." },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.10),transparent_30%),#070707]">
      <Nav />

      {/* Hero */}
      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-950 px-4 py-2 text-sm text-neutral-300">
            <ShieldCheck className="h-4 w-4" aria-hidden />
            Evidence-linked startup validation
          </div>
          <h1 className="mt-6 max-w-4xl text-5xl font-black tracking-tight sm:text-7xl">
            Validate your startup before you waste months building.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-neutral-300">
            ProofPilot turns a raw idea into a source-aware report: competitors, complaints, landing
            copy, MVP roadmap, pricing strategy, and launch plan.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/dashboard" className={buttonVariants({ size: "lg" })}>
              Run free reality check
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link href="/pricing" className={buttonVariants({ variant: "secondary", size: "lg" })}>
              View pricing
            </Link>
          </div>
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

      {/* Features */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        <h2 className="text-3xl font-black sm:text-4xl">Everything you need to de-risk an idea</h2>
        <p className="mt-3 max-w-2xl text-neutral-400">
          Each module produces evidence you can act on — not vibes.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        <h2 className="text-3xl font-black sm:text-4xl">How it works</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {STEPS.map((step) => (
            <div key={step.n} className="rounded-3xl border border-neutral-800/80 bg-neutral-950/60 p-6">
              <p className="text-sm font-black text-neutral-600">{step.n}</p>
              <h3 className="mt-2 text-lg font-bold">{step.title}</h3>
              <p className="mt-2 text-sm text-neutral-400">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="rounded-3xl border border-neutral-800/80 bg-gradient-to-br from-neutral-900 to-neutral-950 p-10 text-center">
          <h2 className="text-3xl font-black sm:text-4xl">Stop guessing. Start proving.</h2>
          <p className="mx-auto mt-3 max-w-xl text-neutral-400">
            Run a free reality check now, then upgrade when you need a serious report.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/dashboard" className={buttonVariants({ size: "lg" })}>
              Run free reality check
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link href="/pricing" className={buttonVariants({ variant: "secondary", size: "lg" })}>
              View pricing
            </Link>
          </div>
        </div>
      </section>

      <footer className="mx-auto max-w-7xl px-6 py-10 text-sm text-neutral-600">
        <div className="flex flex-col items-center justify-between gap-4 border-t border-neutral-800 pt-8 sm:flex-row">
          <p>© {new Date().getFullYear()} ProofPilot. Proof before build.</p>
          <div className="flex gap-4">
            <Link href="/pricing" className="hover:text-neutral-300">
              Pricing
            </Link>
            <Link href="/login" className="hover:text-neutral-300">
              Sign in
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
