"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { createServerSupabase } from "@/lib/supabase/server";
import { getProject } from "@/lib/data/projects";
import { isAnthropicConfigured, getAnthropicModel } from "@/lib/env";
import { runResearch } from "@/lib/ai/research";
import type { ResearchResult } from "@/lib/ai/research-schema";
import type { Json } from "@/lib/supabase/types";

export type ResearchActionState = { error?: string; ok?: boolean };

/** Run Live AI Research for a project and persist the result. */
export async function runResearchAction(projectId: string): Promise<ResearchActionState> {
  const user = await requireUser();

  if (!isAnthropicConfigured()) {
    return { error: "AI research is not configured. Set ANTHROPIC_API_KEY (see docs/SETUP.md)." };
  }

  const project = await getProject(user.id, projectId);
  if (!project) return { error: "Project not found." };

  let result: ResearchResult;
  try {
    result = await runResearch({
      idea: project.idea,
      audience: project.audience ?? "",
      problem: project.problem ?? "",
    });
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Research failed. Please try again." };
  }

  const supabase = await createServerSupabase();
  const { error } = await supabase.from("research_runs").insert({
    user_id: user.id,
    project_id: projectId,
    model: getAnthropicModel(),
    result: result as unknown as Json,
  });
  if (error) return { error: error.message };

  revalidatePath(`/dashboard/projects/${projectId}`);
  return { ok: true };
}
