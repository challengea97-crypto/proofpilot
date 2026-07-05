"use client";

import { useState } from "react";
import { Gauge, Target, ListChecks, Users, AlertCircle } from "lucide-react";
import { generateLocalReport } from "@/lib/report";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { ResearchPanel } from "@/components/research/ResearchPanel";
import { AnalysisPanel } from "@/components/analysis/AnalysisPanel";
import { ReportPanel } from "@/components/reports/ReportPanel";
import { ANALYSIS_KINDS, ANALYSIS_CONFIG, type AnalysisKind, type AnalysisResult } from "@/lib/ai/analysis-kinds";
import type { ProjectRow } from "@/lib/supabase/types";
import type { ResearchResult } from "@/lib/ai/research-schema";
import type { FounderReport } from "@/lib/reports/build";

type TabKey = "overview" | "research" | "report" | AnalysisKind;

function Field({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">{label}</p>
      <p className="mt-1 whitespace-pre-wrap text-neutral-200">
        {value?.trim() ? value : <span className="text-neutral-600">Not provided</span>}
      </p>
    </div>
  );
}

function Overview({ project }: { project: ProjectRow }) {
  const snapshot = generateLocalReport({
    idea: project.idea,
    audience: project.audience ?? "",
    problem: project.problem ?? "",
  });

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-5">
        <div>
          <h2 className="text-lg font-bold">Research brief</h2>
          <p className="text-sm text-neutral-400">The inputs that drive validation.</p>
        </div>
        <Field label="Idea" value={project.idea} />
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="flex items-start gap-2">
            <Users className="mt-0.5 h-4 w-4 text-neutral-500" aria-hidden />
            <Field label="Audience" value={project.audience} />
          </div>
          <div className="flex items-start gap-2">
            <AlertCircle className="mt-0.5 h-4 w-4 text-neutral-500" aria-hidden />
            <Field label="Problem" value={project.problem} />
          </div>
        </div>
      </div>

      <div className="space-y-4 rounded-2xl border border-neutral-800 bg-neutral-900/40 p-5">
        <div className="flex items-center justify-between">
          <h3 className="font-bold">Heuristic snapshot</h3>
          <Badge tone="neutral">Local · non-AI</Badge>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4">
            <div className="mb-2 flex items-center gap-2 text-neutral-400">
              <Gauge className="h-4 w-4" aria-hidden />
              <span className="text-sm">Score</span>
            </div>
            <p className="text-2xl font-black">{snapshot.score}/100</p>
          </div>
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4">
            <div className="mb-2 flex items-center gap-2 text-neutral-400">
              <Target className="h-4 w-4" aria-hidden />
              <span className="text-sm">Confidence</span>
            </div>
            <p className="text-2xl font-black">{snapshot.confidence}%</p>
          </div>
        </div>
        <p className="text-sm leading-6 text-neutral-300">{snapshot.summary}</p>
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-neutral-300">
            <ListChecks className="h-4 w-4" aria-hidden />
            Next actions
          </div>
          <ul className="space-y-2">
            {snapshot.nextActions.map((action) => (
              <li key={action} className="rounded-xl bg-neutral-900/60 px-3 py-2 text-sm text-neutral-300">
                {action}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export function ProjectWorkspace({
  project,
  research,
  analyses,
  report,
  configured,
}: {
  project: ProjectRow;
  research: ResearchResult | null;
  analyses: Record<AnalysisKind, AnalysisResult | null>;
  report: FounderReport;
  configured: boolean;
}) {
  const [tab, setTab] = useState<TabKey>("overview");

  const tabs: { key: TabKey; label: string }[] = [
    { key: "overview", label: "Overview" },
    { key: "research", label: "Research" },
    ...ANALYSIS_KINDS.map((k) => ({ key: k as TabKey, label: ANALYSIS_CONFIG[k].title })),
    { key: "report", label: "Report" },
  ];

  return (
    <div className="space-y-6">
      <div
        className="no-scrollbar flex gap-2 overflow-x-auto rounded-3xl border border-neutral-800 bg-neutral-900/50 p-2"
        role="tablist"
        aria-label="Project workspace"
      >
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={tab === t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              "whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition",
              tab === t.key ? "bg-white text-neutral-950" : "text-neutral-400 hover:text-white"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="rounded-3xl border border-neutral-800/80 bg-neutral-950/60 p-6 shadow-glow">
        {tab === "overview" && <Overview project={project} />}
        {tab === "research" && (
          <ResearchPanel projectId={project.id} latest={research} configured={configured} />
        )}
        {tab === "report" && <ReportPanel projectId={project.id} report={report} />}
        {ANALYSIS_KINDS.map(
          (k) =>
            tab === k && (
              <AnalysisPanel
                key={k}
                projectId={project.id}
                kind={k}
                title={ANALYSIS_CONFIG[k].title}
                description={ANALYSIS_CONFIG[k].description}
                latest={analyses[k]}
                configured={configured}
              />
            )
        )}
      </div>
    </div>
  );
}
