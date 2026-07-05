"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { createServerSupabase } from "@/lib/supabase/server";

const schema = z.object({
  label: z.string().trim().min(1, "Add a label").max(200),
  url: z.string().trim().url("Enter a valid URL").max(500).optional().or(z.literal("")),
  note: z.string().trim().max(500).optional().or(z.literal("")),
});

export type WatchFormState = {
  error?: string;
  fieldErrors?: Partial<Record<"label" | "url" | "note", string>>;
};

export async function addWatchItemAction(
  projectId: string,
  _prevState: WatchFormState,
  formData: FormData
): Promise<WatchFormState> {
  const user = await requireUser();

  const parsed = schema.safeParse({
    label: formData.get("label"),
    url: formData.get("url"),
    note: formData.get("note"),
  });

  if (!parsed.success) {
    const fieldErrors: WatchFormState["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof NonNullable<WatchFormState["fieldErrors"]>;
      if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { error: "Please fix the highlighted fields.", fieldErrors };
  }

  const supabase = await createServerSupabase();
  const { error } = await supabase.from("watchlist_items").insert({
    user_id: user.id,
    project_id: projectId,
    label: parsed.data.label,
    url: parsed.data.url || null,
    note: parsed.data.note || null,
  });
  if (error) return { error: error.message };

  revalidatePath(`/dashboard/projects/${projectId}`);
  return {};
}

export async function deleteWatchItemAction(formData: FormData): Promise<void> {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");
  const projectId = String(formData.get("projectId") ?? "");
  if (!id) return;

  const supabase = await createServerSupabase();
  await supabase.from("watchlist_items").delete().eq("user_id", user.id).eq("id", id);
  if (projectId) revalidatePath(`/dashboard/projects/${projectId}`);
}
