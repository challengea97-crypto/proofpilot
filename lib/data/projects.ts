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

/** Projects the user created in the current calendar month (for plan quotas). */
export async function countProjectsThisMonth(userId: string): Promise<number> {
  try {
    const now = new Date();
    const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)).toISOString();
    const supabase = await createServerSupabase();
    const { count, error } = await supabase
      .from("projects")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .gte("created_at", monthStart);
    if (error) throw new Error(error.message);
    return count ?? 0;
  } catch {
    return 0;
  }
}
