"use client";

import { useState, useTransition } from "react";
import { Sparkles } from "lucide-react";
import { runAnalysisAction } from "@/app/dashboard/projects/[id]/analysis-actions";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { Badge } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/Spinner";
import { LockedFeature } from "@/components/LockedFeature";
import { playChime } from "@/lib/sound";
import { ANALYSIS_CONFIG, type AnalysisKind, type AnalysisResult } from "@/lib/ai/analysis-kinds";

function AnalysisResultView({ result }: { result: AnalysisResult }) {
  return (
    <div className="space-y-5">
      <p className="text-base font-semibold text-white">{result.headline}</p>
      <div className="grid gap-4 md:grid-cols-2">
        {result.sections.map((section) => (
          <div
            key={section.title}
            className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4"
          >
            <p className="mb-2 text-sm font-bold text-neutral-200">{section.title}</p>
            {section.items.length === 0 ? (
              <p className="text-sm text-neutral-600">None found.</p>
            ) : (
              <ul className="space-y-1.5">
                {section.items.map((item) => (
                  <li key={item} className="flex gap-2 text-sm text-neutral-400">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-neutral-600" aria-hidden />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function AnalysisPanel({
  projectId,
  kind,
  title,
  description,
  latest,
  configured,
  canEdit = true,
  locked = false,
}: {
  projectId: string;
  kind: AnalysisKind;
  title: string;
  description: string;
  latest: AnalysisResult | null;
  configured: boolean;
  canEdit?: boolean;
  locked?: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function run() {
    if (pending) return; // guard against double-clicks
    setError(null);
    startTransition(async () => {
      const res = await runAnalysisAction(projectId, kind);
      if (res.error) setError(res.error);
      else playChime();
    });
  }

  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold">{title}</h2>
            {ANALYSIS_CONFIG[kind].sourced ? (
              <Badge tone="accent">Live web · sources included</Badge>
            ) : (
              <Badge tone="neutral">AI inference</Badge>
            )}
          </div>
          <p className="text-sm text-neutral-400">{description}</p>
        </div>
        {!locked &&
          (canEdit ? (
            <Button onClick={run} loading={pending} disabled={!configured}>
              <Sparkles className="h-4 w-4" aria-hidden />
              {latest ? "Re-generate" : "Generate"}
            </Button>
          ) : (
            <span className="text-sm text-neutral-500">View only — the owner generates this</span>
          ))}
      </div>

      {locked ? (
        <LockedFeature
          title={`${title} isn't in your plan`}
          description={`Upgrade to unlock the ${title} module for your projects.`}
        />
      ) : (
        <>
          {!configured && (
            <Alert tone="info" title="AI temporarily unavailable">
              This module will be back shortly — please try again in a moment.
            </Alert>
          )}
          {error && <Alert tone="error">{error}</Alert>}
          {pending && (
            <div className="flex items-center gap-2 py-4">
              <Spinner />
              <span className="text-sm text-neutral-300">Generating — typically 10–30 seconds…</span>
            </div>
          )}
          {!pending && latest && <AnalysisResultView result={latest} />}
          {!pending && !latest && configured && !error && (
            <p className="text-sm text-neutral-500">Not generated yet. Click “Generate”.</p>
          )}
        </>
      )}
    </section>
  );
}
