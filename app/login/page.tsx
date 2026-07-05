import { Suspense } from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { getOptionalUser } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/env";
import { AuthForm } from "@/components/auth/AuthForm";
import { SetupNotice } from "@/components/SetupNotice";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Sign in",
};

export default async function LoginPage() {
  const configured = isSupabaseConfigured();
  if (configured) {
    const user = await getOptionalUser();
    if (user) redirect("/dashboard");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-ink bg-grid px-6 py-16">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-8 flex items-center justify-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-neutral-950">
            <ShieldCheck size={22} />
          </span>
          <span className="text-xl font-black">ProofPilot</span>
        </Link>

        <div className="rounded-3xl border border-neutral-800/80 bg-neutral-950/70 p-6 shadow-glow backdrop-blur sm:p-8">
          <h1 className="text-center text-2xl font-black">Welcome</h1>
          <p className="mt-1 text-center text-sm text-neutral-400">
            Sign in to run evidence-linked startup validation.
          </p>

          <div className="mt-6">
            {configured ? (
              <Suspense fallback={<div className="h-72" />}>
                <AuthForm />
              </Suspense>
            ) : (
              <SetupNotice
                title="Authentication not configured"
                description="Sign-in needs Supabase. Add these environment variables, then redeploy:"
                vars={["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY"]}
              />
            )}
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-neutral-500">
          <Link href="/" className="hover:text-neutral-300">
            ← Back to home
          </Link>
        </p>
      </div>
    </main>
  );
}
