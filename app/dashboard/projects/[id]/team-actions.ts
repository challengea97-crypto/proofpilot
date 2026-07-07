"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUser, getProfile } from "@/lib/auth";
import { createServerSupabase } from "@/lib/supabase/server";
import { getProject } from "@/lib/data/projects";
import { canUseTeam, effectivePlan } from "@/lib/plan";

const emailSchema = z.string().trim().toLowerCase().email("Enter a valid email").max(200);

export type TeamActionState = { error?: string; ok?: boolean };

/** Invite a collaborator (viewer) to a project by email. Owner + Consultant plan only. */
export async function addMemberAction(
  projectId: string,
  _prev: TeamActionState,
  formData: FormData
): Promise<TeamActionState> {
  const user = await requireUser();

  const parsed = emailSchema.safeParse(formData.get("email"));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Enter a valid email." };
  }
  const email = parsed.data;

  if (email === (user.email ?? "").toLowerCase()) {
    return { error: "That's your own email — you already have access." };
  }

  const profile = await getProfile(user);
  if (!canUseTeam(effectivePlan(profile))) {
    return { error: "Team sharing is on the Consultant plan — upgrade in Billing." };
  }

  const project = await getProject(user.id, projectId);
  if (!project) return { error: "Only the project owner can invite teammates." };

  const supabase = await createServerSupabase();
  const { error } = await supabase.from("project_members").insert({
    project_id: projectId,
    owner_id: user.id,
    member_email: email,
  });
  if (error) {
    if (error.code === "23505") return { error: "That email is already on this project." };
    return { error: error.message };
  }

  revalidatePath(`/dashboard/projects/${projectId}`);
  return { ok: true };
}

/** Remove a collaborator. Owner only (enforced by RLS + owner_id filter). */
export async function removeMemberAction(formData: FormData): Promise<void> {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");
  const projectId = String(formData.get("projectId") ?? "");
  if (!id) return;

  const supabase = await createServerSupabase();
  await supabase.from("project_members").delete().eq("id", id).eq("owner_id", user.id);
  if (projectId) revalidatePath(`/dashboard/projects/${projectId}`);
}
