import { createServerSupabase } from "@/lib/supabase/server";
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
