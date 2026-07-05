import { createServerSupabase, createServiceSupabase } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import type { ReportRow } from "@/lib/supabase/types";

/** All saved reports for a user, newest first. */
export async function listReports(userId: string): Promise<ReportRow[]> {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("reports")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}

/** Count of a user's saved reports. Resilient to an un-migrated table. */
export async function countReports(userId: string): Promise<number> {
  try {
    const supabase = await createServerSupabase();
    const { count, error } = await supabase
      .from("reports")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);
    if (error) throw new Error(error.message);
    return count ?? 0;
  } catch {
    return 0;
  }
}

/** A single saved report owned by the user, or null. */
export async function getReport(userId: string, id: string): Promise<ReportRow | null> {
  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("reports")
    .select("*")
    .eq("user_id", userId)
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data ?? null;
}

/**
 * Look up a publicly-shared report by its token. Uses the service-role client so
 * only the exact token matches (no RLS policy that could leak all shared reports).
 */
export async function getReportByShareToken(token: string): Promise<ReportRow | null> {
  if (!token || !isSupabaseConfigured() || !process.env.SUPABASE_SERVICE_ROLE_KEY) return null;
  try {
    const supabase = createServiceSupabase();
    const { data, error } = await supabase
      .from("reports")
      .select("*")
      .eq("share_token", token)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data ?? null;
  } catch {
    return null;
  }
}
