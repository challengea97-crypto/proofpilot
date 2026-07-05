import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ProjectRow } from "@/lib/supabase/types";
import { timeAgo, truncate } from "@/lib/utils";

export function ProjectCard({ project }: { project: ProjectRow }) {
  return (
    <Link
      href={`/dashboard/projects/${project.id}`}
      className="group flex flex-col rounded-3xl border border-neutral-800/80 bg-neutral-950/60 p-5 transition hover:border-neutral-700 hover:bg-neutral-900/60"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-bold text-white">{truncate(project.name, 60)}</h3>
        <ArrowUpRight
          className="h-5 w-5 shrink-0 text-neutral-600 transition group-hover:text-white"
          aria-hidden
        />
      </div>
      <p className="mt-2 line-clamp-3 text-sm text-neutral-400">{truncate(project.idea, 160)}</p>
      <p className="mt-4 text-xs text-neutral-600">Created {timeAgo(project.created_at)}</p>
    </Link>
  );
}
