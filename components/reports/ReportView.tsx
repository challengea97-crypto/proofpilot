import {
  Sparkles,
  Users,
  CheckCircle2,
  AlertTriangle,
  ListChecks,
  Info,
  FileText,
  Layers,
} from "lucide-react";
import { verdictForScore, type FounderReport, type ReportSection } from "@/lib/reports/build";

const TONE_BAR: Record<"accent" | "warning" | "danger", string> = {
  accent: "bg-emerald-400",
  warning: "bg-amber-400",
  danger: "bg-red-400",
};
const TONE_TEXT: Record<"accent" | "warning" | "danger", string> = {
  accent: "text-emerald-300",
  warning: "text-amber-300",
  danger: "text-red-300",
};

function Meter({ label, value, suffix, tone }: { label: string; value: number; suffix: string; tone: "accent" | "warning" | "danger" }) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between">
        <span className="text-xs font-medium text-neutral-400">{label}</span>
        <span className={`text-sm font-black ${TONE_TEXT[tone]}`}>
          {value}
          <span className="text-neutral-500">{suffix}</span>
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-neutral-800">
        <div className={`h-full rounded-full ${TONE_BAR[tone]}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function ExecutiveSummary({ report }: { report: FounderReport }) {
  if (report.score === undefined) return null;
  const verdict = verdictForScore(report.score);
  const summary = report.sections.find((s) => s.kind === "opportunity")?.body;
  return (
    <div className="rounded-2xl border border-neutral-800 bg-gradient-to-br from-neutral-900/80 to-neutral-950/50 p-5">
      <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-neutral-300">
        <Sparkles className="h-4 w-4" aria-hidden />
        Executive summary
      </div>
      <div className="grid gap-5 sm:grid-cols-[1.2fr_1fr] sm:items-center">
        {summary && <p className="text-sm leading-7 text-neutral-300">{summary}</p>}
        <div className="space-y-3">
          <Meter label="Opportunity" value={report.score} suffix="/100" tone={verdict.tone} />
          {report.confidence !== undefined && (
            <Meter label="Confidence" value={report.confidence} suffix="%" tone="accent" />
          )}
          <span
            className={`inline-flex rounded-full border border-neutral-700 px-3 py-1 text-xs font-bold ${TONE_TEXT[verdict.tone]}`}
          >
            {verdict.label}
          </span>
        </div>
      </div>
    </div>
  );
}

function CompetitorTable({ bullets }: { bullets: string[] }) {
  const rows = bullets.map((b) => {
    const [head, rest = ""] = b.split(" — ");
    const m = head.match(/^(.*?)\s*\(([^)]+)\)\s*$/);
    const name = m ? m[1] : head;
    const category = m ? m[2] : null;
    let positioning = rest;
    let pricing: string | null = null;
    const idx = positioning.indexOf(" · Pricing: ");
    if (idx >= 0) {
      pricing = positioning.slice(idx + " · Pricing: ".length);
      positioning = positioning.slice(0, idx);
    }
    return { name, category, positioning, pricing, raw: b };
  });
  return (
    <div className="overflow-x-auto rounded-xl border border-neutral-800">
      <table className="w-full min-w-[520px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-neutral-800 text-xs uppercase tracking-wide text-neutral-500">
            <th className="p-3 font-semibold">Competitor</th>
            <th className="p-3 font-semibold">Type</th>
            <th className="p-3 font-semibold">Positioning</th>
            <th className="p-3 font-semibold">Pricing</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b border-neutral-800/60 last:border-0">
              <td className="p-3 font-semibold text-white">{r.name}</td>
              <td className="p-3 text-neutral-400">{r.category ?? "—"}</td>
              <td className="p-3 text-neutral-300">{r.positioning || "—"}</td>
              <td className="p-3 text-neutral-400">{r.pricing ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SectionCard({ section }: { section: ReportSection }) {
  const kind = section.kind;

  const accent =
    kind === "risks"
      ? "border-red-500/20 bg-red-500/[0.03]"
      : kind === "positive"
        ? "border-emerald-500/20 bg-emerald-500/[0.03]"
        : kind === "provenance"
          ? "border-neutral-800 bg-neutral-950/40"
          : "border-neutral-800 bg-neutral-900/40";

  const Icon =
    kind === "competitors"
      ? Users
      : kind === "positive"
        ? CheckCircle2
        : kind === "risks"
          ? AlertTriangle
          : kind === "actions"
            ? ListChecks
            : kind === "provenance"
              ? Info
              : kind === "analysis"
                ? Layers
                : FileText;

  return (
    <section className={`rounded-2xl border p-5 ${accent}`}>
      <div className="mb-3 flex items-center gap-2">
        <Icon
          className={`h-4 w-4 ${kind === "risks" ? "text-red-400" : kind === "positive" ? "text-emerald-400" : "text-neutral-400"}`}
          aria-hidden
        />
        <h2 className="text-base font-bold text-white">{section.heading}</h2>
      </div>

      {section.body && (
        <p className={`leading-7 text-neutral-300 ${kind === "provenance" ? "text-sm text-neutral-500" : ""}`}>
          {section.body}
        </p>
      )}

      {kind === "competitors" && section.bullets?.length ? (
        <CompetitorTable bullets={section.bullets} />
      ) : kind === "actions" && section.bullets?.length ? (
        <ol className="space-y-2">
          {section.bullets.map((b, i) => (
            <li key={i} className="flex gap-3 rounded-xl bg-neutral-950/50 p-3 text-sm text-neutral-300">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white text-xs font-black text-neutral-950">
                {i + 1}
              </span>
              {b}
            </li>
          ))}
        </ol>
      ) : section.bullets?.length ? (
        <ul className={`space-y-1.5 ${section.body ? "mt-3" : ""} text-sm text-neutral-300`}>
          {section.bullets.map((b, i) => (
            <li key={i} className="flex gap-2">
              <span className={`mt-2 h-1 w-1 shrink-0 rounded-full ${kind === "provenance" ? "bg-neutral-600" : "bg-neutral-500"}`} aria-hidden />
              <span className={kind === "provenance" ? "text-neutral-500" : ""}>{b}</span>
            </li>
          ))}
        </ul>
      ) : null}

      {section.subsections?.map((sub) => (
        <details key={sub.heading} open className="group mt-3 border-t border-neutral-800 pt-3">
          <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-semibold text-neutral-200">
            {sub.heading}
            <span className="text-neutral-600 transition-transform group-open:rotate-90" aria-hidden>›</span>
          </summary>
          <ul className="mt-2 space-y-1.5 text-sm text-neutral-300">
            {sub.bullets.map((b, i) => (
              <li key={i} className="flex gap-2">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-neutral-500" aria-hidden />
                {b}
              </li>
            ))}
          </ul>
        </details>
      ))}
    </section>
  );
}

/** Premium report renderer (works in Server or Client Components). */
export function ReportView({ report }: { report: FounderReport }) {
  // The opportunity section is folded into the executive summary when scored.
  const bodySections = report.sections.filter(
    (s) => !(s.kind === "opportunity" && report.score !== undefined)
  );

  return (
    <article className="space-y-5">
      <header className="space-y-1">
        <h1 className="text-2xl font-black">{report.title}</h1>
        <p className="text-sm text-neutral-400">{report.subtitle}</p>
      </header>

      <ExecutiveSummary report={report} />

      {bodySections.map((section) => (
        <SectionCard key={section.heading} section={section} />
      ))}
    </article>
  );
}
