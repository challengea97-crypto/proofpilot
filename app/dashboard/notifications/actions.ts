"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { createServerSupabase } from "@/lib/supabase/server";

export async function markAllReadAction(): Promise<void> {
  const user = await requireUser();
  try {
    const supabase = await createServerSupabase();
    await supabase
      .from("notifications")
      .update({ read: true })
      .eq("user_id", user.id)
      .eq("read", false);
  } catch {
    // ignore
  }
  // Refresh the layout too so the sidebar unread badge updates.
  revalidatePath("/dashboard", "layout");
}
