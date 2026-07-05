import { isSupabaseConfigured } from "@/lib/env";
import { requireUser, getProfile } from "@/lib/auth";
import { countUnread } from "@/lib/data/notifications";
import { AppShell } from "@/components/app/AppShell";
import { SetupNotice } from "@/components/SetupNotice";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  if (!isSupabaseConfigured()) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-ink px-6 py-16">
        <div className="w-full max-w-lg">
          <SetupNotice
            title="Dashboard not configured"
            description="The app area needs Supabase for authentication and data. Add these environment variables, then redeploy:"
            vars={[
              "NEXT_PUBLIC_SUPABASE_URL",
              "NEXT_PUBLIC_SUPABASE_ANON_KEY",
              "SUPABASE_SERVICE_ROLE_KEY",
            ]}
          />
        </div>
      </main>
    );
  }

  const user = await requireUser();
  const [profile, unreadCount] = await Promise.all([getProfile(user), countUnread(user.id)]);

  return (
    <AppShell
      userEmail={user.email ?? ""}
      plan={profile?.plan ?? "free"}
      unreadCount={unreadCount}
    >
      {children}
    </AppShell>
  );
}
