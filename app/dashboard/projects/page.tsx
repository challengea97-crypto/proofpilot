import { requireUser } from "@/lib/auth";
import { listVisibleProjects } from "@/lib/data/projects";
import { NewProjectForm } from "@/components/projects/NewProjectForm";
import { ProjectsExplorer } from "@/components/projects/ProjectsExplorer";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Projects",
};

export default async function ProjectsPage() {
  const user = await requireUser();
  const visible = await listVisibleProjects();
  const projects = visible.filter((p) => p.user_id === user.id);
  const shared = visible.filter((p) => p.user_id !== user.id);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black sm:text-3xl">Projects</h1>
        <p className="mt-1 text-neutral-400">
          Each project is one idea you&apos;re validating with evidence.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_minmax(320px,360px)]">
        <section className="order-2 space-y-8 lg:order-1">
          <ProjectsExplorer projects={projects} />

          {shared.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold">Shared with you</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {shared.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </div>
          )}
        </section>

        <aside className="order-1 lg:order-2">
          <Card className="lg:sticky lg:top-8">
            <CardHeader>
              <CardTitle>New project</CardTitle>
              <CardDescription>Describe the idea you want to validate.</CardDescription>
            </CardHeader>
            <NewProjectForm />
          </Card>
        </aside>
      </div>
    </div>
  );
}
