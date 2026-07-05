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

/** AI is powered by Groq (OpenAI-compatible API). */
export function isAIConfigured(): boolean {
  return Boolean(process.env.GROQ_API_KEY);
}

export function getGroqKey(): string {
  const key = process.env.GROQ_API_KEY;
  if (!key) {
    throw new Error("AI is temporarily unavailable. (GROQ_API_KEY is not set on the server.)");
  }
  return key;
}

/** Groq model used for AI features; overridable via GROQ_MODEL. */
export function getGroqModel(): string {
  return process.env.GROQ_MODEL || "llama-3.3-70b-versatile";
}

/** Absolute base URL of the deployment, used for Stripe redirects and links. */
export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
}

/** Admin allowlist (comma-separated emails in ADMIN_EMAILS). */
export function getAdminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return getAdminEmails().includes(email.toLowerCase());
}
