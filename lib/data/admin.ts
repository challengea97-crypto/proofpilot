import { createServiceSupabase } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";

export type AdminStats = {
  users: number;
  projects: number;
  reports: number;
  researchRuns: number;
  analyses: number;
};

/** Platform-wide counts (service role). Returns null if not configured. */
export async function getAdminStats(): Promise<AdminStats | null> {
  if (!isSupabaseConfigured() || !process.env.SUPABASE_SERVICE_ROLE_KEY) return null;
  try {
    const supabase = createServiceSupabase();
    const [users, projects, reports, researchRuns, analyses] = await Promise.all([
      supabase.from("profiles").select("*", { count: "exact", head: true }),
      supabase.from("projects").select("*", { count: "exact", head: true }),
      supabase.from("reports").select("*", { count: "exact", head: true }),
      supabase.from("research_runs").select("*", { count: "exact", head: true }),
      supabase.from("analyses").select("*", { count: "exact", head: true }),
    ]);
    return {
      users: users.count ?? 0,
      projects: projects.count ?? 0,
      reports: reports.count ?? 0,
      researchRuns: researchRuns.count ?? 0,
      analyses: analyses.count ?? 0,
    };
  } catch {
    return null;
  }
}
