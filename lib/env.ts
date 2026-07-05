/**
 * Centralized, typed access to environment variables.
 *
 * Every accessor throws a clear, actionable error when a required value is
 * missing, and there is a matching `is*Configured()` predicate so UI can render
 * a "setup needed" state instead of crashing. This keeps `next build` working
 * even before any secrets are set (nothing here runs at module load).
 */

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export function getSupabasePublicEnv(): { url: string; anonKey: string } {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY (see .env.example)."
    );
  }
  return { url, anonKey };
}

export function getSupabaseServiceEnv(): { url: string; serviceRoleKey: string } {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) {
    throw new Error(
      "Supabase service role is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (see .env.example)."
    );
  }
  return { url, serviceRoleKey };
}

export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

export function isAnthropicConfigured(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

export function getAnthropicApiKey(): string {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    throw new Error(
      "Live AI Research is not configured. Set ANTHROPIC_API_KEY (see docs/SETUP.md)."
    );
  }
  return key;
}

/** Model used for AI research; overridable so it can target whatever the key can access. */
export function getAnthropicModel(): string {
  return process.env.ANTHROPIC_MODEL || "claude-opus-4-8";
}

/** Absolute base URL of the deployment, used for Stripe redirects and links. */
export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
}
