import { createServerSupabase } from "@/lib/supabase/server";
import {
  ANALYSIS_KINDS,
  AnalysisResultSchema,
  isAnalysisKind,
  type AnalysisKind,
  type AnalysisResult,
} from "@/lib/ai/analysis-kinds";

export type LatestAnalyses = Record<AnalysisKind, AnalysisResult | null>;

function emptyLatest(): LatestAnalyses {
  return ANALYSIS_KINDS.reduce((acc, kind) => {
    acc[kind] = null;
    return acc;
  }, {} as LatestAnalyses);
}

/** Latest analysis of each kind for a visible project (RLS scopes access). */
export async function getLatestAnalyses(projectId: string): Promise<LatestAnalyses> {
  const latest = emptyLatest();
  try {
    const supabase = await createServerSupabase();
    const { data, error } = await supabase
      .from("analyses")
      .select("*")
      .eq("project_id", projectId)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);

    for (const row of data ?? []) {
      if (!isAnalysisKind(row.kind) || latest[row.kind] !== null) continue;
      const parsed = AnalysisResultSchema.safeParse(row.result);
      if (parsed.success) latest[row.kind] = parsed.data;
    }
  } catch {
    return emptyLatest();
  }
  return latest;
}
