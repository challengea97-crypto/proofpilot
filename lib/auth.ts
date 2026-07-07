import { cache } from "react";
import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createServerSupabase } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import { TRIAL_DAYS } from "@/lib/plan";
import type { ProfileRow } from "@/lib/supabase/types";

/**
 * Returns the signed-in user, or `null` when there is no session (or when
 * Supabase isn't configured yet). Never throws.
 *
 * Wrapped in React cache() so layout + page + actions share ONE auth
 * round-trip per request instead of each making their own.
 */
export const getOptionalUser = cache(async (): Promise<User | null> => {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});

/** Require a signed-in user; redirect to `/login` otherwise. */
export async function requireUser(): Promise<User> {
  const user = await getOptionalUser();
  if (!user) redirect("/login");
  return user;
}

/**
 * Fetch the profile row for a user, creating it on first access so downstream
 * code can always rely on a profile existing. Returns `null` only when
 * Supabase is unconfigured. cache(): one profile query per request.
 */
export const getProfile = cache(async (user: User): Promise<ProfileRow | null> => {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createServerSupabase();

  const { data: existing } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (existing) return existing;

  // Lazily create the profile on first sign-in, starting the 5-day free trial
  // of the cheapest paid plan. upsert tolerates a concurrent create.
  const trialEndsAt = new Date(Date.now() + TRIAL_DAYS * 24 * 60 * 60 * 1000).toISOString();
  let { data: created } = await supabase
    .from("profiles")
    .upsert(
      { id: user.id, email: user.email ?? null, trial_ends_at: trialEndsAt },
      { onConflict: "id" }
    )
    .select("*")
    .maybeSingle();

  // Resilience: if the trial_ends_at column hasn't been migrated yet, still
  // create the profile so sign-in never breaks (they just start on free).
  if (!created) {
    ({ data: created } = await supabase
      .from("profiles")
      .upsert({ id: user.id, email: user.email ?? null }, { onConflict: "id" })
      .select("*")
      .maybeSingle());
  }

  return created ?? null;
});
