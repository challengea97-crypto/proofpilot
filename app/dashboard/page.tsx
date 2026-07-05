import Link from "next/link";
import { FolderKanban, Plus, Sparkles, FileText, ArrowRight } from "lucide-react";
import { requireUser, getProfile } from "@/lib/auth";
import { listProjects } from "@/lib/data/projects";
import { countReports } from "@/lib/data/reports";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { planLabel } from "@/lib/pricing";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Overview",
};

function Stat({
  label,
  value,
  icon,
}: {
  label: string;
  value: React.ReactNode;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-neutral-800/80 bg-neutral-950/60 p-5">
      <div className="mb-3 flex items-center justify-between text-neutral-400">
        <span className="text-sm">{label}</span>
        {icon}
      </div>
      <div className="text-2xl font-black text-white">{value}</div>
    </div>
  );
}

export default async function DashboardOverview() {
  const user = await requireUser();
  const [projects, profile, reportCount] = await Promise.all([
    listProjects(user.id),
    getProfile(user),
    countReports(user.id),
  ]);
  const recent = projects.slice(0, 4);

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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Stat
          label="Projects"
          value={projects.length}
          icon={<FolderKanban className="h-5 w-5" aria-hidden />}
        />
        <Stat
          label="Reports"
          value={reportCount}
          icon={<FileText className="h-5 w-5" aria-hidden />}
        />
        <Stat
          label="Plan"
          value={<Badge tone={profile?.plan && profile.plan !== "free" ? "accent" : "neutral"}>{planLabel(profile?.plan)}</Badge>}
          icon={<Sparkles className="h-5 w-5" aria-hidden />}
        />
      </div>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">Recent projects</h2>
          {projects.length > 0 && (
            <Link
              href="/dashboard/projects"
              className="inline-flex items-center gap-1 text-sm text-neutral-400 hover:text-white"
            >
              View all <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          )}
        </div>

        {recent.length === 0 ? (
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
            {recent.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
