"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireUser, getProfile } from "@/lib/auth";
import { createServerSupabase } from "@/lib/supabase/server";
import { countProjects } from "@/lib/data/projects";
import { planRank, FREE_PROJECT_LIMIT } from "@/lib/plan";

const projectSchema = z.object({
  name: z.string().trim().min(1, "Project name is required").max(120, "Keep the name under 120 characters"),
  idea: z.string().trim().min(10, "Describe your idea in a little more detail").max(4000),
  audience: z.string().trim().max(2000).optional().or(z.literal("")),
  problem: z.string().trim().max(4000).optional().or(z.literal("")),
});

export type ProjectFormState = {
  error?: string;
  fieldErrors?: Partial<Record<"name" | "idea" | "audience" | "problem", string>>;
};

/** Create a project owned by the current user, then open it. */
export async function createProjectAction(
  _prevState: ProjectFormState,
  formData: FormData
): Promise<ProjectFormState> {
  const user = await requireUser();

  const parsed = projectSchema.safeParse({
    name: formData.get("name"),
    idea: formData.get("idea"),
    audience: formData.get("audience"),
    problem: formData.get("problem"),
  });

  if (!parsed.success) {
    const fieldErrors: ProjectFormState["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof NonNullable<ProjectFormState["fieldErrors"]>;
      if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { error: "Please fix the highlighted fields.", fieldErrors };
  }

  // Free plan is capped; paid plans are unlimited.
  const [profile, existingCount] = await Promise.all([getProfile(user), countProjects(user.id)]);
  if (planRank(profile?.plan) < 1 && existingCount >= FREE_PROJECT_LIMIT) {
    return {
      error: `The free plan is limited to ${FREE_PROJECT_LIMIT} projects. Upgrade in Billing to add more.`,
    };
  }

  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("projects")
    .insert({
      user_id: user.id,
      name: parsed.data.name,
      idea: parsed.data.idea,
      audience: parsed.data.audience || null,
      problem: parsed.data.problem || null,
    })
    .select("id")
    .single();

  if (error || !data) {
    return { error: error?.message ?? "Could not create the project. Please try again." };
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/projects");
  redirect(`/dashboard/projects/${data.id}`);
}

/** Delete a project owned by the current user. */
export async function deleteProjectAction(formData: FormData): Promise<void> {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const supabase = await createServerSupabase();
  const { error } = await supabase.from("projects").delete().eq("user_id", user.id).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/projects");
  redirect("/dashboard/projects");
}
