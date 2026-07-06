import Link from "next/link";
import {
  FolderKanban,
  Plus,
  Sparkles,
  FileText,
  ArrowRight,
  Rocket,
} from "lucide-react";
import { requireUser, getProfile } from "@/lib/auth";
import { listVisibleProjects } from "@/lib/data/projects";
import { listReports } from "@/lib/data/reports";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { planLabel } from "@/lib/pricing";
import { planRank, FREE_PROJECT_LIMIT } from "@/lib/plan";
import { timeAgo, truncate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Overview",
};

function Stat({
  label,
  value,
  hint,
  icon,
}: {
  label: string;
  value: React.ReactNode;
  hint?: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-neutral-800/80 bg-neutral-950/60 p-5">
      <div className="mb-3 flex items-center justify-between text-neutral-400">
        <span className="text-sm">{label}</span>
        {icon}
      </div>
      <div className="text-2xl font-black text-white">{value}</div>
      {hint && <p className="mt-1 text-xs text-neutral-500">{hint}</p>}
    </div>
  );
}

export default async function DashboardOverview() {
  const user = await requireUser();
  const [visible, profile, reports] = await Promise.all([
    listVisibleProjects(),
    getProfile(user),
    listReports(user.id).catch(() => []),
  ]);
  const own = visible.filter((p) => p.user_id === user.id);
  const recentProjects = visible.slice(0, 4);
  const recentReports = reports.slice(0, 3);
  const isFree = planRank(profile?.plan) < 1;
  const latest = own[0] ?? visible[0];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black sm:text-3xl">Overview</h1>
          <p className="mt-1 text-neutral-400">Welcome back — pick up your validation work.</p>
        </div>
        <Link href="/dashboard/projects">
          <Button>
            <Plus className="h-4 w-4" aria-hidden />
            New project
          </Button>
        </Link>
      </div>

      {/* Clear next action */}
      <div className="flex flex-col gap-4 rounded-3xl border border-neutral-800/80 bg-gradient-to-br from-neutral-900/80 to-neutral-950/60 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-neutral-950">
            <Rocket className="h-5 w-5" aria-hidden />
          </span>
          <div>
            <h2 className="font-bold text-white">
              {latest ? `Continue validating “${truncate(latest.name, 40)}”` : "Start your first validation"}
            </h2>
            <p className="mt-1 text-sm text-neutral-400">
              {latest
                ? "Open the project to run research, generate analyses, or build the report."
                : "Create a project — there's a one-click example idea if you want to just try it."}
            </p>
          </div>
        </div>
        <Link href={latest ? `/dashboard/projects/${latest.id}` : "/dashboard/projects"}>
          <Button variant="secondary">
            {latest ? "Open project" : "Create project"}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Stat
          label="Projects"
          value={isFree ? `${own.length} / ${FREE_PROJECT_LIMIT}` : own.length}
          hint={isFree ? "Free plan limit — upgrade for unlimited" : undefined}
          icon={<FolderKanban className="h-5 w-5" aria-hidden />}
        />
        <Stat
          label="Reports"
          value={reports.length}
          icon={<FileText className="h-5 w-5" aria-hidden />}
        />
        <Stat
          label="Plan"
          value={
            <Badge tone={profile?.plan && profile.plan !== "free" ? "accent" : "neutral"}>
              {planLabel(profile?.plan)}
            </Badge>
          }
          hint={isFree ? undefined : "Manage in Billing"}
          icon={<Sparkles className="h-5 w-5" aria-hidden />}
        />
      </div>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">Recent projects</h2>
          {visible.length > 0 && (
            <Link
              href="/dashboard/projects"
              className="inline-flex items-center gap-1 text-sm text-neutral-400 hover:text-white"
            >
              View all <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          )}
        </div>

        {recentProjects.length === 0 ? (
          <EmptyState
            icon={FolderKanban}
            title="No projects yet"
            description="Create your first project to start validating an idea with competitor, demand and pricing evidence."
            action={
              <Link href="/dashboard/projects">
                <Button>
                  <Plus className="h-4 w-4" aria-hidden />
                  Create a project
                </Button>
              </Link>
            }
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {recentProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </section>

      {recentReports.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Recent reports</h2>
            <Link
              href="/dashboard/reports"
              className="inline-flex items-center gap-1 text-sm text-neutral-400 hover:text-white"
            >
              View all <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
          <ul className="space-y-2">
            {recentReports.map((report) => (
              <li key={report.id}>
                <Link
                  href={`/dashboard/reports/${report.id}`}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-neutral-800 bg-neutral-950/50 px-4 py-3 transition hover:border-neutral-700 hover:bg-neutral-900/60"
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <FileText className="h-4 w-4 shrink-0 text-neutral-500" aria-hidden />
                    <span className="truncate font-medium text-white">
                      {truncate(report.title, 70)}
                    </span>
                  </span>
                  <span className="shrink-0 text-xs text-neutral-600">
                    {timeAgo(report.created_at)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
