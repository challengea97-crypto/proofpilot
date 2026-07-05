import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { getReport } from "@/lib/data/reports";
import { ReportView } from "@/components/reports/ReportView";
import { PrintButton } from "@/components/reports/PrintButton";
import type { FounderReport } from "@/lib/reports/build";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Report",
};

function asReport(content: unknown): FounderReport | null {
  if (
    content &&
    typeof content === "object" &&
    !Array.isArray(content) &&
    "title" in content &&
    "sections" in content &&
    Array.isArray((content as { sections: unknown }).sections)
  ) {
    return content as unknown as FounderReport;
  }
  return null;
}

export default async function SavedReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireUser();
  const row = await getReport(user.id, id);
  if (!row) notFound();

  const report = asReport(row.content);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 no-print">
        <Link
          href="/dashboard/reports"
          className="inline-flex items-center gap-1 text-sm text-neutral-400 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          All reports
        </Link>
        {report && <PrintButton />}
      </div>

      {report ? (
        <div className="print-doc rounded-3xl border border-neutral-800/80 bg-neutral-950/60 p-6 shadow-glow sm:p-8">
          <ReportView report={report} />
        </div>
      ) : (
        <p className="text-neutral-400">This report could not be displayed.</p>
      )}
    </div>
  );
}
