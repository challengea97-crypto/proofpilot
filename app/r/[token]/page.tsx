import Link from "next/link";
import { notFound } from "next/navigation";
import { getReportByShareToken } from "@/lib/data/reports";
import { parseFounderReport } from "@/lib/reports/build";
import { ReportView } from "@/components/reports/ReportView";
import { PrintButton } from "@/components/reports/PrintButton";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Shared report",
  robots: { index: false, follow: false },
};

export default async function SharedReportPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const row = await getReportByShareToken(token);
  if (!row || !row.share_token) notFound();

  const report = parseFounderReport(row.content);
  if (!report) notFound();

  return (
    <main className="mx-auto min-h-screen max-w-3xl px-6 py-12">
      <div className="mb-6 flex items-center justify-between no-print">
        <Link href="/" className="text-lg font-black">
          Teckro
        </Link>
        <PrintButton />
      </div>

      <div className="print-doc rounded-3xl border border-neutral-800/80 bg-neutral-950/60 p-6 shadow-glow sm:p-8">
        <ReportView report={report} />
      </div>

      <p className="mt-6 text-center text-xs text-neutral-600 no-print">
        Shared via <Link href="/" className="hover:text-neutral-300">Teckro</Link>
      </p>
    </main>
  );
}
