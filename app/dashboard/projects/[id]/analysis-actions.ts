"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { createServerSupabase } from "@/lib/supabase/server";
import { getProject } from "@/lib/data/projects";
import { isAIConfigured, getGroqModel } from "@/lib/env";
import { runAnalysis } from "@/lib/ai/analysis";
import { isAnalysisKind, ANALYSIS_CONFIG, type AnalysisResult } from "@/lib/ai/analysis-kinds";
import { insertNotification } from "@/lib/notifications";
import type { Json } from "@/lib/supabase/types";

export type AnalysisActionState = { error?: string; ok?: boolean };

/** Run an analysis module for a project and persist the result. */
export async function runAnalysisAction(
  projectId: string,
  kind: string
): Promise<AnalysisActionState> {
  const user = await requireUser();

  if (!isAnalysisKind(kind)) return { error: "Unknown analysis type." };
  if (!isAIConfigured()) {
    return { error: "AI is temporarily unavailable. Please try again shortly." };
  }

  const project = await getProject(user.id, projectId);
  if (!project) return { error: "Project not found." };

  let result: AnalysisResult;
  try {
    result = await runAnalysis(kind, {
      idea: project.idea,
      audience: project.audience ?? "",
      problem: project.problem ?? "",
    });
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Analysis failed. Please try again." };
  }

  const supabase = await createServerSupabase();
  const { error } = await supabase.from("analyses").insert({
    user_id: user.id,
    project_id: projectId,
    kind,
    model: getGroqModel(),
    result: result as unknown as Json,
  });
  if (error) return { error: error.message };

  await insertNotification(user.id, {
    projectId,
    title: `${ANALYSIS_CONFIG[kind].title} ready`,
    body: `Generated for “${project.name}”.`,
    url: `/dashboard/projects/${projectId}`,
  });

  revalidatePath(`/dashboard/projects/${projectId}`);
  return { ok: true };
}
