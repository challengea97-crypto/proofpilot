import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { getReport } from "@/lib/data/reports";
import { parseFounderReport } from "@/lib/reports/build";
import { ReportView } from "@/components/reports/ReportView";
import { PrintButton } from "@/components/reports/PrintButton";
import { ShareControls } from "@/components/reports/ShareControls";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Report",
};

export default async function SavedReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireUser();
  const row = await getReport(user.id, id);
  if (!row) notFound();

  const report = parseFounderReport(row.content);

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
        <>
          <Card className="no-print">
            <CardHeader>
              <CardTitle>Share</CardTitle>
            </CardHeader>
            <ShareControls reportId={row.id} shareToken={row.share_token} />
          </Card>

          <div className="print-doc rounded-3xl border border-neutral-800/80 bg-neutral-950/60 p-6 shadow-glow sm:p-8">
            <ReportView report={report} />
          </div>
        </>
      ) : (
        <p className="text-neutral-400">This report could not be displayed.</p>
      )}
    </div>
  );
}
