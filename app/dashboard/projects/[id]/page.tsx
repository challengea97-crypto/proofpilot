import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { getProject } from "@/lib/data/projects";
import { getLatestResearch, listResearchScores } from "@/lib/data/research";
import { getLatestAnalyses } from "@/lib/data/analyses";
import { listWatchItems } from "@/lib/data/watchlist";
import { isAIConfigured } from "@/lib/env";
import { ResearchResultSchema, type ResearchResult } from "@/lib/ai/research-schema";
import { buildFounderReport } from "@/lib/reports/build";
import { ProjectWorkspace } from "@/components/projects/ProjectWorkspace";
import { DeleteProjectButton } from "@/components/projects/DeleteProjectButton";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Project",
};

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireUser();
  const project = await getProject(user.id, id);
  if (!project) notFound();

  const configured = isAIConfigured();

  // Latest AI research (resilient if the research_runs table isn't migrated yet).
  let research: ResearchResult | null = null;
  try {
    const run = await getLatestResearch(user.id, project.id);
    const parsed = run ? ResearchResultSchema.safeParse(run.result) : null;
    research = parsed && parsed.success ? parsed.data : null;
  } catch {
    research = null;
  }

  const [analyses, watchItems, researchHistory] = await Promise.all([
    getLatestAnalyses(user.id, project.id),
    listWatchItems(user.id, project.id),
    listResearchScores(user.id, project.id),
  ]);
  const report = buildFounderReport(
    { name: project.name, idea: project.idea, audience: project.audience, problem: project.problem },
    research,
    analyses
  );

  return (
    <div className="space-y-8">
      <Link
        href="/dashboard/projects"
        className="inline-flex items-center gap-1 text-sm text-neutral-400 hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        All projects
      </Link>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-black sm:text-3xl">{project.name}</h1>
          <p className="mt-1 text-sm text-neutral-500">Created {formatDate(project.created_at)}</p>
        </div>
        <DeleteProjectButton id={project.id} />
      </div>

      <ProjectWorkspace
        project={project}
        research={research}
        researchHistory={researchHistory}
        analyses={analyses}
        report={report}
        watchItems={watchItems}
        configured={configured}
      />
    </div>
  );
}
