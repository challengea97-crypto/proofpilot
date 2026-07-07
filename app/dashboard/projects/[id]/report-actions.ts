"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser, getProfile } from "@/lib/auth";
import { createServerSupabase } from "@/lib/supabase/server";
import { getProject } from "@/lib/data/projects";
import { getLatestResearch } from "@/lib/data/research";
import { getLatestAnalyses } from "@/lib/data/analyses";
import { ResearchResultSchema, type ResearchResult } from "@/lib/ai/research-schema";
import { buildFounderReport } from "@/lib/reports/build";
import { effectivePlan, canUseFounderReport } from "@/lib/plan";
import { insertNotification } from "@/lib/notifications";
import type { Json } from "@/lib/supabase/types";

export type SaveReportState = { error?: string };

/** Build a founder report from the latest data and persist it. */
export async function saveReportAction(projectId: string): Promise<SaveReportState> {
  const user = await requireUser();
  const project = await getProject(user.id, projectId);
  if (!project) return { error: "Project not found." };

  // Saving/exporting the Founder Report is the Founder Report plan feature.
  const profile = await getProfile(user);
  if (!canUseFounderReport(effectivePlan(profile))) {
    return { error: "Saving the Founder Report needs the Founder Report plan — upgrade in Billing." };
  }

  let research: ResearchResult | null = null;
  try {
    const run = await getLatestResearch(projectId);
    const parsed = run ? ResearchResultSchema.safeParse(run.result) : null;
    research = parsed && parsed.success ? parsed.data : null;
  } catch {
    research = null;
  }
  const analyses = await getLatestAnalyses(projectId);

  const report = buildFounderReport(
    {
      name: project.name,
      idea: project.idea,
      audience: project.audience,
      problem: project.problem,
    },
    research,
    analyses
  );

  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("reports")
    .insert({
      user_id: user.id,
      project_id: projectId,
      title: report.title,
      content: report as unknown as Json,
    })
    .select("id")
    .single();

  if (error || !data) {
    return { error: error?.message ?? "Could not save the report. Please try again." };
  }

  await insertNotification(user.id, {
    projectId,
    title: "Report saved",
    body: `“${report.title}” is ready to view and export.`,
    url: `/dashboard/reports/${data.id}`,
  });

  revalidatePath("/dashboard/reports");
  redirect(`/dashboard/reports/${data.id}`);
}
