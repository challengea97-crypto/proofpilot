"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { createServerSupabase } from "@/lib/supabase/server";

export type ShareActionState = { error?: string };

/** Enable or disable a public read-only share link for a report. */
export async function setReportShareAction(
  reportId: string,
  enable: boolean
): Promise<ShareActionState> {
  const user = await requireUser();
  const supabase = await createServerSupabase();

  const share_token = enable ? randomUUID().replace(/-/g, "") : null;
  const { error } = await supabase
    .from("reports")
    .update({ share_token })
    .eq("user_id", user.id)
    .eq("id", reportId);

  if (error) return { error: error.message };

  revalidatePath(`/dashboard/reports/${reportId}`);
  return {};
}
