"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail } from "lucide-react";
import { createBrowserSupabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/form";
import { Alert } from "@/components/ui/Alert";
import { cn } from "@/lib/utils";

type Mode = "signin" | "signup";

export function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/dashboard";

  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function reset() {
    setError(null);
    setNotice(null);
  }

  async function handlePasswordSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    reset();
    try {
      const supabase = createBrowserSupabase();
      if (mode === "signin") {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;
        router.push(redirectTo);
        router.refresh();
      } else {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
        });
        if (signUpError) throw signUpError;
        setNotice("Account created. Check your email to confirm, then sign in.");
        setMode("signin");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleMagicLink() {
    if (!email) {
      setError("Enter your email address first.");
      return;
    }
    setLoading(true);
    reset();
    try {
      const supabase = createBrowserSupabase();
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?redirectTo=${encodeURIComponent(redirectTo)}`,
        },
      });
      if (otpError) throw otpError;
      setNotice("Magic link sent — check your inbox to finish signing in.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send the magic link.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full">
      <div
        className="mb-6 grid grid-cols-2 gap-1 rounded-full border border-neutral-800 bg-neutral-900/60 p-1"
        role="tablist"
        aria-label="Authentication mode"
      >
        {(["signin", "signup"] as Mode[]).map((m) => (
          <button
            key={m}
            type="button"
            role="tab"
            aria-selected={mode === m}
            onClick={() => {
              setMode(m);
              reset();
            }}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-semibold transition",
              mode === m ? "bg-white text-neutral-950" : "text-neutral-400 hover:text-white"
            )}
          >
            {m === "signin" ? "Sign in" : "Create account"}
          </button>
        ))}
      </div>

      {notice && (
        <Alert tone="success" className="mb-4">
          {notice}
        </Alert>
      )}
      {error && (
        <Alert tone="error" className="mb-4">
          {error}
        </Alert>
      )}

      <form onSubmit={handlePasswordSubmit} className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
          />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete={mode === "signin" ? "current-password" : "new-password"}
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 8 characters"
          />
        </div>
        <Button type="submit" className="w-full" loading={loading}>
          {mode === "signin" ? "Sign in" : "Create account"}
        </Button>
      </form>

      <div className="my-5 flex items-center gap-3 text-xs uppercase tracking-widest text-neutral-600">
        <span className="h-px flex-1 bg-neutral-800" />
        or
        <span className="h-px flex-1 bg-neutral-800" />
      </div>

      <Button
        type="button"
        variant="secondary"
        className="w-full"
        onClick={handleMagicLink}
        disabled={loading}
      >
        <Mail className="h-4 w-4" aria-hidden />
        Email me a magic link
      </Button>
    </div>
  );
}
