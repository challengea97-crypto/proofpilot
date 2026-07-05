import { createServerSupabase } from "@/lib/supabase/server";
import type { ResearchRunRow } from "@/lib/supabase/types";

/** Most recent research run for a project owned by the user, or null. */
export async function getLatestResearch(
  userId: string,
  projectId: string
): Promise<ResearchRunRow | null> {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("research_runs")
    .select("*")
    .eq("user_id", userId)
    .eq("project_id", projectId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data ?? null;
}
