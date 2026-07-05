import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { getSupabasePublicEnv, getSupabaseServiceEnv } from "@/lib/env";
import type { Database } from "@/lib/supabase/types";

/**
 * Service-role client for trusted server-side writes (e.g. Stripe webhooks).
 * Bypasses Row Level Security — never expose this to the browser.
 */
export function createServiceSupabase() {
  const { url, serviceRoleKey } = getSupabaseServiceEnv();
  return createClient<Database>(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/**
 * Cookie-bound client for Server Components, Route Handlers and Server Actions.
 * Reads/refreshes the signed-in user's session from cookies.
 */
export async function createServerSupabase() {
  const { url, anonKey } = getSupabasePublicEnv();
  const cookieStore = await cookies();

  return createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Called from a Server Component where the cookie store is read-only.
          // Session refresh is handled by middleware, so this is safe to ignore.
        }
      },
    },
  });
}
