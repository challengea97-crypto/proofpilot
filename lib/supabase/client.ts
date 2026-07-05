import { createBrowserClient } from "@supabase/ssr";
import { getSupabasePublicEnv } from "@/lib/env";
import type { Database } from "@/lib/supabase/types";

/**
 * Supabase client for use in Client Components (runs in the browser).
 * Throws a clear error when public env vars are missing; call
 * `isSupabaseConfigured()` first if you need to branch on configuration.
 */
export function createBrowserSupabase() {
  const { url, anonKey } = getSupabasePublicEnv();
  return createBrowserClient<Database>(url, anonKey);
}
