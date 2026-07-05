import { createServerSupabase } from "@/lib/supabase/server";
import type { WatchlistItemRow } from "@/lib/supabase/types";

/** Watchlist items for a project. Resilient to an un-migrated table. */
export async function listWatchItems(
  userId: string,
  projectId: string
): Promise<WatchlistItemRow[]> {
  try {
    const supabase = await createServerSupabase();
    const { data, error } = await supabase
      .from("watchlist_items")
      .select("*")
      .eq("user_id", userId)
      .eq("project_id", projectId)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  } catch {
    return [];
  }
}
