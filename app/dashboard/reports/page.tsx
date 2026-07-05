import Link from "next/link";
import { FileText } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { listReports } from "@/lib/data/reports";
import { EmptyState } from "@/components/ui/EmptyState";
import { timeAgo, truncate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Reports",
};

export default async function ReportsPage() {
  const user = await requireUser();
  let reports: Awaited<ReturnType<typeof listReports>> = [];
  try {
    reports = await listReports(user.id);
  } catch {
    reports = [];
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black sm:text-3xl">Reports</h1>
        <p className="mt-1 text-neutral-400">Saved founder reports, ready to export or share.</p>
      </div>

      {reports.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No saved reports yet"
          description="Open a project, build its founder report, and click Save report to keep it here."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {reports.map((report) => (
            <Link
              key={report.id}
              href={`/dashboard/reports/${report.id}`}
              className="group flex flex-col rounded-3xl border border-neutral-800/80 bg-neutral-950/60 p-5 transition hover:border-neutral-700 hover:bg-neutral-900/60"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-neutral-900 text-neutral-300">
                <FileText className="h-5 w-5" aria-hidden />
              </div>
              <h2 className="font-bold text-white">{truncate(report.title, 70)}</h2>
              <p className="mt-3 text-xs text-neutral-600">Saved {timeAgo(report.created_at)}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
