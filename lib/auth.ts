import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createServerSupabase } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import type { ProfileRow } from "@/lib/supabase/types";

/**
 * Returns the signed-in user, or `null` when there is no session (or when
 * Supabase isn't configured yet). Never throws.
 */
export async function getOptionalUser(): Promise<User | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/** Require a signed-in user; redirect to `/login` otherwise. */
export async function requireUser(): Promise<User> {
  const user = await getOptionalUser();
  if (!user) redirect("/login");
  return user;
}

/**
 * Fetch the profile row for a user, creating it on first access so downstream
 * code can always rely on a profile existing. Returns `null` only when
 * Supabase is unconfigured.
 */
export async function getProfile(user: User): Promise<ProfileRow | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createServerSupabase();

  const { data: existing } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (existing) return existing;

  // Lazily create the profile on first sign-in.
  const { data: created } = await supabase
    .from("profiles")
    .insert({ id: user.id, email: user.email ?? null })
    .select("*")
    .maybeSingle();

  return created ?? null;
}
