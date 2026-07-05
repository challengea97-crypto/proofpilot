import { createServerSupabase } from "@/lib/supabase/server";

/**
 * Create an in-app notification for a user. Non-fatal: never throws, so callers
 * (server actions) don't fail if the notifications table isn't migrated yet.
 */
export async function insertNotification(
  userId: string,
  input: { projectId?: string | null; title: string; body?: string | null; url?: string | null }
): Promise<void> {
  try {
    const supabase = await createServerSupabase();
    await supabase.from("notifications").insert({
      user_id: userId,
      project_id: input.projectId ?? null,
      title: input.title,
      body: input.body ?? null,
      url: input.url ?? null,
    });
  } catch {
    // Notifications are a convenience; never block the primary action.
  }
}
