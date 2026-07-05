import { notFound } from "next/navigation";
import { Users, FolderKanban, FileText, Sparkles, Layers } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { isAdminEmail } from "@/lib/env";
import { getAdminStats } from "@/lib/data/admin";
import { Alert } from "@/components/ui/Alert";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin",
};

function Stat({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-neutral-800/80 bg-neutral-950/60 p-5">
      <div className="mb-3 flex items-center justify-between text-neutral-400">
        <span className="text-sm">{label}</span>
        {icon}
      </div>
      <p className="text-3xl font-black text-white">{value.toLocaleString()}</p>
    </div>
  );
}

export default async function AdminPage() {
  const user = await requireUser();
  if (!isAdminEmail(user.email)) notFound();

  const stats = await getAdminStats();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black sm:text-3xl">Admin</h1>
        <p className="mt-1 text-neutral-400">Platform overview.</p>
      </div>

      {stats ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Stat label="Users" value={stats.users} icon={<Users className="h-5 w-5" aria-hidden />} />
          <Stat label="Projects" value={stats.projects} icon={<FolderKanban className="h-5 w-5" aria-hidden />} />
          <Stat label="Reports" value={stats.reports} icon={<FileText className="h-5 w-5" aria-hidden />} />
          <Stat label="Research runs" value={stats.researchRuns} icon={<Sparkles className="h-5 w-5" aria-hidden />} />
          <Stat label="Analyses" value={stats.analyses} icon={<Layers className="h-5 w-5" aria-hidden />} />
        </div>
      ) : (
        <Alert tone="info" title="Stats unavailable">
          Admin metrics need <span className="font-mono text-xs">SUPABASE_SERVICE_ROLE_KEY</span>.
        </Alert>
      )}
    </div>
  );
}
