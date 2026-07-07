"use server";

import { revalidatePath } from "next/cache";
import { requireUser, getProfile } from "@/lib/auth";
import { createServerSupabase } from "@/lib/supabase/server";
import { getProject } from "@/lib/data/projects";
import { isAIConfigured, getGroqModel } from "@/lib/env";
import { runAnalysis } from "@/lib/ai/analysis";
import { isAnalysisKind, ANALYSIS_CONFIG, type AnalysisResult } from "@/lib/ai/analysis-kinds";
import { effectivePlan, canRunAnalysis } from "@/lib/plan";
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

  // Plan gate: this module may not be included in the user's plan.
  const profile = await getProfile(user);
  if (!canRunAnalysis(kind, effectivePlan(profile))) {
    return {
      error: `${ANALYSIS_CONFIG[kind].title} isn't included in your plan — upgrade in Billing to unlock it.`,
    };
  }

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

  // Store the exact input brief and timestamp alongside the result for audit;
  // readers parse with a schema that ignores the underscore-prefixed keys.
  const stored = {
    ...result,
    _brief: { idea: project.idea, audience: project.audience, problem: project.problem },
    _generatedAt: new Date().toISOString(),
  };

  const supabase = await createServerSupabase();
  const { error } = await supabase.from("analyses").insert({
    user_id: user.id,
    project_id: projectId,
    kind,
    model: getGroqModel(),
    result: stored as unknown as Json,
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
