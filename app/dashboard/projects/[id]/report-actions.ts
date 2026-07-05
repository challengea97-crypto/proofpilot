"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { createServerSupabase } from "@/lib/supabase/server";
import { getProject } from "@/lib/data/projects";
import { getLatestResearch } from "@/lib/data/research";
import { getLatestAnalyses } from "@/lib/data/analyses";
import { ResearchResultSchema, type ResearchResult } from "@/lib/ai/research-schema";
import { buildFounderReport } from "@/lib/reports/build";
import type { Json } from "@/lib/supabase/types";

export type SaveReportState = { error?: string };

/** Build a founder report from the latest data and persist it. */
export async function saveReportAction(projectId: string): Promise<SaveReportState> {
  const user = await requireUser();
  const project = await getProject(user.id, projectId);
  if (!project) return { error: "Project not found." };

  let research: ResearchResult | null = null;
  try {
    const run = await getLatestResearch(user.id, projectId);
    const parsed = run ? ResearchResultSchema.safeParse(run.result) : null;
    research = parsed && parsed.success ? parsed.data : null;
  } catch {
    research = null;
  }
  const analyses = await getLatestAnalyses(user.id, projectId);

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

  revalidatePath("/dashboard/reports");
  redirect(`/dashboard/reports/${data.id}`);
}
