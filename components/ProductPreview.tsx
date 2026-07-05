import { Gauge, Target, ArrowUpRight, ListChecks } from "lucide-react";

const TABS = ["Overview", "Research", "Strategy", "MVP", "Pricing", "Report"];

const COMPETITORS: [string, string][] = [
  ["Direct validators", "direct"],
  ["Market research suites", "indirect"],
  ["SEO / competitor tools", "substitute"],
  ["Spreadsheets + AI chat", "substitute"],
];

const ACTIONS = ["Run 10 buyer interviews", "Add 5 competitor URLs", "Test a paid CTA"];

/** A styled, illustrative preview of the Teckro dashboard (marketing mockup). */
export function ProductPreview() {
  return (
    <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-950 shadow-glow">
      <div className="flex items-center gap-2 border-b border-neutral-800 bg-neutral-900/60 px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-red-500/70" aria-hidden />
        <span className="h-3 w-3 rounded-full bg-amber-500/70" aria-hidden />
        <span className="h-3 w-3 rounded-full bg-emerald-500/70" aria-hidden />
        <div className="ml-3 flex-1 truncate rounded-lg bg-neutral-900 px-3 py-1.5 text-xs text-neutral-500">
          teckro.app/dashboard/projects
        </div>
      </div>

      <div className="p-5 sm:p-7">
        <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
          {TABS.map((tab, i) => (
            <span
              key={tab}
              className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold ${
                i === 1 ? "bg-white text-neutral-950" : "bg-neutral-900 text-neutral-400"
              }`}
            >
              {tab}
            </span>
          ))}
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_1.1fr]">
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4">
                <div className="mb-2 flex items-center gap-2 text-neutral-400">
                  <Gauge className="h-4 w-4" aria-hidden />
                  <span className="text-xs">Opportunity</span>
                </div>
                <p className="text-2xl font-black">73/100</p>
              </div>
              <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4">
                <div className="mb-2 flex items-center gap-2 text-neutral-400">
                  <Target className="h-4 w-4" aria-hidden />
                  <span className="text-xs">Confidence</span>
                </div>
                <p className="text-2xl font-black">66%</p>
              </div>
            </div>
            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4">
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-neutral-300">
                <ListChecks className="h-4 w-4" aria-hidden />
                Next actions
              </div>
              <ul className="space-y-1.5">
                {ACTIONS.map((a) => (
                  <li key={a} className="rounded-lg bg-neutral-900/70 px-3 py-1.5 text-xs text-neutral-400">
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {COMPETITORS.map(([name, cat]) => (
              <div key={name} className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-white">{name}</p>
                  <ArrowUpRight className="h-4 w-4 text-neutral-600" aria-hidden />
                </div>
                <p className="mt-1 text-xs text-neutral-500">{cat} competitor</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
