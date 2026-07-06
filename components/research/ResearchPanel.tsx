"use client";

import { useState, useTransition } from "react";
import { Sparkles, Gauge, Target, Users, MessagesSquare, Lightbulb, AlertTriangle, ListChecks } from "lucide-react";
import { runResearchAction } from "@/app/dashboard/projects/[id]/research-actions";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { Badge } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/Spinner";
import { playChime } from "@/lib/sound";
import { timeAgo } from "@/lib/utils";
import type { ResearchResult, Competitor } from "@/lib/ai/research-schema";

const CATEGORY_TONE: Record<Competitor["category"], "accent" | "warning" | "neutral"> = {
  direct: "warning",
  indirect: "neutral",
  substitute: "accent",
};

export type ResearchHistoryEntry = { score: number; createdAt: string };

/** Deterministic verdict derived from the opportunity score. */
function verdictFor(score: number): { label: string; tone: "accent" | "warning" | "danger" } {
  if (score >= 70) return { label: "Promising — worth pursuing", tone: "accent" };
  if (score >= 50) return { label: "Possible — sharpen the wedge", tone: "warning" };
  return { label: "High risk — rethink the angle", tone: "danger" };
}

function List({ icon: Icon, title, items }: { icon: typeof Users; title: string; items: string[] }) {
  if (items.length === 0) return null;
  return (
    <div>
      <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-neutral-300">
        <Icon className="h-4 w-4" aria-hidden />
        {title}
      </div>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item} className="rounded-xl bg-neutral-900/60 px-3 py-2 text-sm text-neutral-300">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ResearchResultView({ result }: { result: ResearchResult }) {
  const verdict = verdictFor(result.opportunityScore);
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4">
        <span className="text-sm text-neutral-400">Verdict</span>
        <Badge tone={verdict.tone}>{verdict.label}</Badge>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4">
          <div className="mb-2 flex items-center gap-2 text-neutral-400">
            <Gauge className="h-4 w-4" aria-hidden />
            <span className="text-sm">Opportunity</span>
          </div>
          <p className="text-2xl font-black">{result.opportunityScore}/100</p>
        </div>
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4">
          <div className="mb-2 flex items-center gap-2 text-neutral-400">
            <Target className="h-4 w-4" aria-hidden />
            <span className="text-sm">Confidence</span>
          </div>
          <p className="text-2xl font-black">{result.confidence}%</p>
        </div>
      </div>

      <p className="text-sm leading-6 text-neutral-300">{result.summary}</p>

      {result.competitors.length > 0 && (
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-neutral-300">
            <Users className="h-4 w-4" aria-hidden />
            Competitors
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {result.competitors.map((c) => (
              <div key={c.name} className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-bold text-white">{c.name}</p>
                  <Badge tone={CATEGORY_TONE[c.category]}>{c.category}</Badge>
                </div>
                <p className="mt-2 text-sm text-neutral-400">{c.positioning}</p>
                <p className="mt-1 text-xs text-neutral-500">Pricing: {c.pricingSignal}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <List icon={Target} title="Demand signals" items={result.demandSignals} />
        <List icon={MessagesSquare} title="Incumbent complaints" items={result.reviewComplaints} />
        <List icon={Lightbulb} title="Differentiators" items={result.differentiators} />
        <List icon={AlertTriangle} title="Risks" items={result.risks} />
      </div>

      <List icon={ListChecks} title="Recommended next actions" items={result.nextActions} />
    </div>
  );
}

export function ResearchPanel({
  projectId,
  latest,
  history = [],
  configured,
  canEdit = true,
}: {
  projectId: string;
  latest: ResearchResult | null;
  history?: ResearchHistoryEntry[];
  configured: boolean;
  canEdit?: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function run() {
    if (pending) return; // guard against double-clicks
    setError(null);
    startTransition(async () => {
      const res = await runResearchAction(projectId);
      if (res.error) setError(res.error);
      else playChime();
    });
  }

  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold">Live AI Research</h2>
            <Badge tone="neutral">AI inference</Badge>
          </div>
          <p className="text-sm text-neutral-400">
            Directional analysis — hypotheses to validate, not facts. For web-sourced data, see the
            Web Signals tab.
          </p>
        </div>
        {canEdit ? (
          <Button onClick={run} loading={pending} disabled={!configured}>
            <Sparkles className="h-4 w-4" aria-hidden />
            {latest ? "Re-run analysis" : "Run research"}
          </Button>
        ) : (
          <span className="text-sm text-neutral-500">View only — the owner runs research</span>
        )}
      </div>

      <div className="mt-5">
        {!configured && (
          <Alert tone="info" title="AI temporarily unavailable">
            Live AI Research will be back shortly — please try again in a moment.
          </Alert>
        )}
        {error && (
          <Alert tone="error" className="mb-4">
            {error}
          </Alert>
        )}
        {pending && (
          <div className="space-y-2 py-4">
            <div className="flex items-center gap-2">
              <Spinner />
              <span className="text-sm text-neutral-300">
                Running two-pass analysis — typically 10–30 seconds…
              </span>
            </div>
            <p className="pl-7 text-xs text-neutral-500">
              Drafting the report, then a second pass sharpens every recommendation.
            </p>
          </div>
        )}
        {!pending && latest && <ResearchResultView result={latest} />}
        {!pending && !latest && configured && !error && (
          <p className="text-sm text-neutral-500">No research run yet. Click “Run research”.</p>
        )}

        {!pending && history.length > 1 && (
          <div className="mt-6">
            <p className="mb-2 text-sm font-semibold text-neutral-300">Run history</p>
            <div className="no-scrollbar flex gap-2 overflow-x-auto">
              {history.map((run, i) => (
                <span
                  key={`${run.createdAt}-${i}`}
                  className="whitespace-nowrap rounded-full border border-neutral-800 bg-neutral-900/60 px-3 py-1.5 text-xs text-neutral-400"
                >
                  <span className="font-bold text-white">{run.score}</span>/100 ·{" "}
                  {timeAgo(run.createdAt)}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
