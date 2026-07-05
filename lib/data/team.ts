import { createServerSupabase } from "@/lib/supabase/server";
import type { ProjectMemberRow } from "@/lib/supabase/types";

/** Members of a project (RLS: owners see all, members see their own row). */
export async function listMembers(projectId: string): Promise<ProjectMemberRow[]> {
  try {
    const supabase = await createServerSupabase();
    const { data, error } = await supabase
      .from("project_members")
      .select("*")
      .eq("project_id", projectId)
      .order("created_at", { ascending: true });
    if (error) throw new Error(error.message);
    return data ?? [];
  } catch {
    return [];
  }
}
