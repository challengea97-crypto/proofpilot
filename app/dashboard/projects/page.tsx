import { FolderKanban } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { listProjects } from "@/lib/data/projects";
import { NewProjectForm } from "@/components/projects/NewProjectForm";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Projects",
};

export default async function ProjectsPage() {
  const user = await requireUser();
  const projects = await listProjects(user.id);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black sm:text-3xl">Projects</h1>
        <p className="mt-1 text-neutral-400">
          Each project is one idea you&apos;re validating with evidence.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_minmax(320px,360px)]">
        <section className="order-2 space-y-4 lg:order-1">
          {projects.length === 0 ? (
            <EmptyState
              icon={FolderKanban}
              title="No projects yet"
              description="Use the form to create your first project. You can add as many ideas as you like."
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
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
