"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Download, Save, Lock } from "lucide-react";
import { saveReportAction } from "@/app/dashboard/projects/[id]/report-actions";
import { reportToMarkdown, reportSlug, reportIsEnriched, type FounderReport } from "@/lib/reports/build";
import { ReportView } from "@/components/reports/ReportView";
import { Button, buttonVariants } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";

export function ReportPanel({
  projectId,
  report,
  canEdit = true,
  canSave = true,
}: {
  projectId: string;
  report: FounderReport;
  canEdit?: boolean;
  canSave?: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function save() {
    setError(null);
    startTransition(async () => {
      const res = await saveReportAction(projectId);
      // On success the action redirects; only errors return here.
      if (res?.error) setError(res.error);
    });
  }

  function downloadMarkdown() {
    const blob = new Blob([reportToMarkdown(report)], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${reportSlug(report)}.md`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold">Founder report</h2>
          <p className="text-sm text-neutral-400">Assembled from your research and analyses.</p>
        </div>
        <div className="flex gap-2">
          {canSave ? (
            <>
              <Button variant="secondary" onClick={downloadMarkdown}>
                <Download className="h-4 w-4" aria-hidden />
                Markdown
              </Button>
              {canEdit && (
                <Button onClick={save} loading={pending}>
                  <Save className="h-4 w-4" aria-hidden />
                  Save report
                </Button>
              )}
            </>
          ) : (
            <Link
              href="/dashboard/billing"
              className={buttonVariants({ variant: "secondary", size: "md" })}
            >
              <Lock className="h-4 w-4" aria-hidden />
              Upgrade to export &amp; share
            </Link>
          )}
        </div>
      </div>

      {!reportIsEnriched(report) && (
        <Alert tone="info">
          Run Research and the analysis modules to enrich this report — right now it only contains
          the project overview.
        </Alert>
      )}
      {error && <Alert tone="error">{error}</Alert>}

      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-5">
        <ReportView report={report} />
      </div>
    </div>
  );
}
