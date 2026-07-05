import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getOptionalUser } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/env";
import { AuthForm } from "@/components/auth/AuthForm";
import { AuthSplit } from "@/components/auth/AuthSplit";
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
    <AuthSplit title="Welcome back" subtitle="Sign in to run evidence-linked validation.">
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
    </AuthSplit>
  );
}
