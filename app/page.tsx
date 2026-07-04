import { Nav } from "@/components/Nav";
import { ArrowRight, Search, Target, FileText } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.14),transparent_28%),#070707]">
      <Nav />
      <section className="mx-auto grid max-w-7xl gap-8 px-6 py-16 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <div className="inline-flex rounded-full border border-neutral-800 bg-neutral-950 px-4 py-2 text-sm text-neutral-300">
            Evidence-linked startup validation
          </div>
          <h1 className="mt-6 max-w-4xl text-5xl font-black tracking-tight sm:text-7xl">
            Validate your startup before you waste months building.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-neutral-300">
            ProofPilot turns a raw idea into a source-aware report: competitors, complaints, landing copy, MVP roadmap, pricing strategy, and launch plan.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/dashboard" className="btn-primary">
              Run free reality check <ArrowRight className="inline" size={16} />
            </Link>
            <Link href="/pricing" className="btn-secondary">View pricing</Link>
          </div>
        </div>
        <div className="card">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-neutral-500">Sample output</p>
          <div className="mt-5 space-y-4">
            {[
              ["Competitor map", "Direct, indirect, substitute, pricing signals", Search],
              ["Opportunity score", "Demand, pain, saturation, differentiation", Target],
              ["Founder report", "MVP scope, strategy, GTM, launch checklist", FileText]
            ].map(([title, body, Icon]: any) => (
              <div key={title} className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4">
                <div className="flex items-center gap-3">
                  <Icon size={18} />
                  <p className="font-bold">{title}</p>
                </div>
                <p className="mt-2 text-sm text-neutral-400">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
