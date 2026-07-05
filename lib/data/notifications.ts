import { createServerSupabase } from "@/lib/supabase/server";
import type { NotificationRow } from "@/lib/supabase/types";

/** Recent notifications for a user. Resilient to an un-migrated table. */
export async function listNotifications(userId: string, limit = 50): Promise<NotificationRow[]> {
  try {
    const supabase = await createServerSupabase();
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) throw new Error(error.message);
    return data ?? [];
  } catch {
    return [];
  }
}

/** Count of unread notifications. Resilient to an un-migrated table. */
export async function countUnread(userId: string): Promise<number> {
  try {
    const supabase = await createServerSupabase();
    const { count, error } = await supabase
      .from("notifications")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("read", false);
    if (error) throw new Error(error.message);
    return count ?? 0;
  } catch {
    return 0;
  }
}
