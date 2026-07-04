"use client";

import { generateLocalReport } from "@/lib/report";
import { PricingCards } from "@/components/PricingCards";
import { FileText, Gauge, Search, Target, Rocket } from "lucide-react";
import { useMemo, useState } from "react";

const tabs = ["Research", "Competitors", "Reviews", "Strategy", "Reports", "Billing"] as const;
type Tab = typeof tabs[number];

export default function DashboardPage() {
  const [tab, setTab] = useState<Tab>("Research");
  const [brief, setBrief] = useState({
    idea: "AI product validation platform for indie founders",
    audience: "solo founders and startup teams",
    problem: "founders build before validating competitors, demand, pricing, and real user pain"
  });
  const report = useMemo(() => generateLocalReport(brief), [brief]);

  return (
    <main className="min-h-screen bg-neutral-950">
      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex flex-col gap-4 rounded-3xl border border-neutral-800 bg-neutral-950 p-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-black">ProofPilot Dashboard</h1>
            <p className="text-neutral-400">Owned production starter for Netlify + Supabase + Stripe.</p>
          </div>
          <a href="/" className="btn-secondary">Back home</a>
        </div>

        <div className="mt-6 flex gap-2 overflow-x-auto rounded-3xl border border-neutral-800 bg-neutral-900/60 p-3">
          {tabs.map((item) => (
            <button
              key={item}
              onClick={() => setTab(item)}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold ${tab === item ? "bg-white text-neutral-950" : "bg-neutral-950 text-neutral-400"}`}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-4">
          <Metric label="Score" value={`${report.score}/100`} icon={<Gauge size={18} />} />
          <Metric label="Confidence" value={`${report.confidence}%`} icon={<Target size={18} />} />
          <Metric label="Competitors" value="4" icon={<Search size={18} />} />
          <Metric label="Report" value="Ready" icon={<FileText size={18} />} />
        </div>

        <section className="mt-6">
          {tab === "Research" && (
            <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
              <div className="card">
                <h2 className="text-xl font-black">Research brief</h2>
                <input className="input mt-4" value={brief.idea} onChange={(e) => setBrief({ ...brief, idea: e.target.value })} />
                <input className="input mt-3" value={brief.audience} onChange={(e) => setBrief({ ...brief, audience: e.target.value })} />
                <textarea className="input mt-3 min-h-32" value={brief.problem} onChange={(e) => setBrief({ ...brief, problem: e.target.value })} />
              </div>
              <div className="card">
                <h2 className="text-xl font-black">Reality check</h2>
                <p className="mt-4 leading-7 text-neutral-300">{report.summary}</p>
                <div className="mt-5 space-y-3">
                  {report.nextActions.map((item) => <div key={item} className="rounded-2xl bg-neutral-900 p-4 text-neutral-300">{item}</div>)}
                </div>
              </div>
            </div>
          )}

          {tab === "Competitors" && <Panel title="Competitor Database" items={report.competitors} />}
          {tab === "Reviews" && <Panel title="Review Intelligence" items={["Pricing complaints", "Onboarding friction", "Missing source transparency", "Feature request clustering"]} />}
          {tab === "Strategy" && <Panel title="AI Strategy Builder" items={["Positioning", "USP", "MVP roadmap", "Pricing recommendation", "GTM plan", "30-day launch plan"]} />}
          {tab === "Reports" && (
            <div className="card">
              <h2 className="text-xl font-black">Founder report export</h2>
              <pre className="mt-4 max-h-[500px] overflow-auto rounded-2xl bg-neutral-900 p-4 text-sm text-neutral-300">
{`# ProofPilot Founder Report

Idea: ${brief.idea}

Score: ${report.score}/100
Confidence: ${report.confidence}%

Summary:
${report.summary}

Next actions:
${report.nextActions.map(x => `- ${x}`).join("\n")}
`}
              </pre>
            </div>
          )}
          {tab === "Billing" && <PricingCards />}
        </section>
      </section>
    </main>
  );
}

function Metric({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="card">
      <div className="mb-4 flex items-center justify-between text-neutral-400">
        <span className="text-sm">{label}</span>
        {icon}
      </div>
      <p className="text-3xl font-black">{value}</p>
    </div>
  );
}

function Panel({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="card">
      <h2 className="text-xl font-black">{title}</h2>
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {items.map((item) => <div key={item} className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4 text-neutral-300">{item}</div>)}
      </div>
    </div>
  );
}
