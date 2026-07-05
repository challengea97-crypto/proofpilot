import { createServerSupabase } from "@/lib/supabase/server";
import type { ProjectRow } from "@/lib/supabase/types";

/**
 * All projects the user can see (their own + ones shared with them), newest
 * first. Row Level Security scopes the result; no user filter needed.
 */
export async function listVisibleProjects(): Promise<ProjectRow[]> {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}

/** A single project owned by the user, or `null`. Use for MUTATIONS. */
export async function getProject(userId: string, id: string): Promise<ProjectRow | null> {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", userId)
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data ?? null;
}

/** A project visible to the user (owned OR shared), or `null`. Use for READS. */
export async function getVisibleProject(id: string): Promise<ProjectRow | null> {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data ?? null;
}

/** Count of a user's projects (used on the dashboard overview). */
export async function countProjects(userId: string): Promise<number> {
  const supabase = await createServerSupabase();
  const { count, error } = await supabase
    .from("projects")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  if (error) throw new Error(error.message);
  return count ?? 0;
}
