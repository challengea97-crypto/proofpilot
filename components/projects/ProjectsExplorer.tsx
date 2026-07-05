"use client";

import { useState } from "react";
import { Search, FolderKanban } from "lucide-react";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/form";
import type { ProjectRow } from "@/lib/supabase/types";

/** Client-side searchable project list. */
export function ProjectsExplorer({ projects }: { projects: ProjectRow[] }) {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const filtered = q
    ? projects.filter((p) => `${p.name} ${p.idea}`.toLowerCase().includes(q))
    : projects;

  return (
    <div className="space-y-4">
      {projects.length > 3 && (
        <div className="relative max-w-sm">
          <Search
            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500"
            aria-hidden
          />
          <Input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects…"
            aria-label="Search projects"
            className="pl-11"
          />
        </div>
      )}

      {filtered.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title={q ? "No matches" : "No projects yet"}
          description={
            q
              ? `Nothing matches “${query}”.`
              : "Use the form to create your first project."
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
