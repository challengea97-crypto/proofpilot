import { createServerSupabase } from "@/lib/supabase/server";
import { ResearchResultSchema } from "@/lib/ai/research-schema";
import type { ResearchRunRow } from "@/lib/supabase/types";

export type ResearchScoreEntry = { score: number; createdAt: string };

/** Most recent research run for a visible project, or null (RLS scopes access). */
export async function getLatestResearch(projectId: string): Promise<ResearchRunRow | null> {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("research_runs")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data ?? null;
}

/** Score history (newest first) for the run-history strip. Resilient: [] on any failure. */
export async function listResearchScores(
  projectId: string,
  limit = 10
): Promise<ResearchScoreEntry[]> {
  try {
    const supabase = await createServerSupabase();
    const { data, error } = await supabase
      .from("research_runs")
      .select("result, created_at")
      .eq("project_id", projectId)
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) throw new Error(error.message);

    return (data ?? []).flatMap((row) => {
      const parsed = ResearchResultSchema.safeParse(row.result);
      return parsed.success
        ? [{ score: parsed.data.opportunityScore, createdAt: row.created_at }]
        : [];
    });
  } catch {
    return [];
  }
}
