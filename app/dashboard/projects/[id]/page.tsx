import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Gauge, Target, ListChecks, Users, AlertCircle } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { getProject } from "@/lib/data/projects";
import { generateLocalReport } from "@/lib/report";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Alert } from "@/components/ui/Alert";
import { DeleteProjectButton } from "@/components/projects/DeleteProjectButton";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Project",
};

function Field({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500">{label}</p>
      <p className="mt-1 whitespace-pre-wrap text-neutral-200">
        {value?.trim() ? value : <span className="text-neutral-600">Not provided</span>}
      </p>
    </div>
  );
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireUser();
  const project = await getProject(user.id, id);
  if (!project) notFound();

  // Fast, deterministic local heuristic — clearly labelled as non-AI. Phase 2
  // adds the evidence-backed Live AI Research panel in this same view.
  const snapshot = generateLocalReport({
    idea: project.idea,
    audience: project.audience ?? "",
    problem: project.problem ?? "",
  });

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/dashboard/projects"
          className="inline-flex items-center gap-1 text-sm text-neutral-400 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          All projects
        </Link>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-black sm:text-3xl">{project.name}</h1>
          <p className="mt-1 text-sm text-neutral-500">Created {formatDate(project.created_at)}</p>
        </div>
        <DeleteProjectButton id={project.id} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>Research brief</CardTitle>
            <CardDescription>The inputs that drive validation for this project.</CardDescription>
          </CardHeader>
          <div className="space-y-5">
            <Field label="Idea" value={project.idea} />
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="flex items-start gap-2">
                <Users className="mt-0.5 h-4 w-4 text-neutral-500" aria-hidden />
                <Field label="Audience" value={project.audience} />
              </div>
              <div className="flex items-start gap-2">
                <AlertCircle className="mt-0.5 h-4 w-4 text-neutral-500" aria-hidden />
                <Field label="Problem" value={project.problem} />
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Heuristic snapshot</CardTitle>
              <Badge tone="neutral">Local · non-AI</Badge>
            </div>
            <CardDescription>
              A fast local estimate. Run Live AI Research (coming to this view) for evidence-linked
              analysis.
            </CardDescription>
          </CardHeader>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4">
              <div className="mb-2 flex items-center gap-2 text-neutral-400">
                <Gauge className="h-4 w-4" aria-hidden />
                <span className="text-sm">Score</span>
              </div>
              <p className="text-2xl font-black">{snapshot.score}/100</p>
            </div>
            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4">
              <div className="mb-2 flex items-center gap-2 text-neutral-400">
                <Target className="h-4 w-4" aria-hidden />
                <span className="text-sm">Confidence</span>
              </div>
              <p className="text-2xl font-black">{snapshot.confidence}%</p>
            </div>
          </div>

          <p className="mt-4 text-sm leading-6 text-neutral-300">{snapshot.summary}</p>

          <div className="mt-4">
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-neutral-300">
              <ListChecks className="h-4 w-4" aria-hidden />
              Suggested next actions
            </div>
            <ul className="space-y-2">
              {snapshot.nextActions.map((action) => (
                <li
                  key={action}
                  className="rounded-xl bg-neutral-900/60 px-3 py-2 text-sm text-neutral-300"
                >
                  {action}
                </li>
              ))}
            </ul>
          </div>
        </Card>
      </div>

      <Alert tone="info" title="Live AI Research attaches here">
        Evidence-backed competitors, demand signals, review mining and pricing analysis will run
        against this brief once the research engine is enabled.
      </Alert>
    </div>
  );
}
