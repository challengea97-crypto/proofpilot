import { requireUser, getProfile } from "@/lib/auth";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { SignOutButton } from "@/components/app/SignOutButton";
import { planLabel } from "@/lib/pricing";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Settings",
};

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1 border-b border-neutral-800 py-4 last:border-0 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-sm text-neutral-400">{label}</span>
      <span className="text-sm font-medium text-neutral-100">{children}</span>
    </div>
  );
}

export default async function SettingsPage() {
  const user = await requireUser();
  const profile = await getProfile(user);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black sm:text-3xl">Settings</h1>
        <p className="mt-1 text-neutral-400">Manage your account and plan.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>Your Teckro identity.</CardDescription>
        </CardHeader>
        <div>
          <Row label="Email">{user.email ?? "—"}</Row>
          <Row label="Plan">
            <Badge tone={profile?.plan && profile.plan !== "free" ? "accent" : "neutral"}>
              {planLabel(profile?.plan)}
            </Badge>
          </Row>
          <Row label="Member since">{profile ? formatDate(profile.created_at) : "—"}</Row>
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Billing</CardTitle>
          <CardDescription>Upgrade, downgrade and manage payment methods.</CardDescription>
        </CardHeader>
        <p className="text-sm text-neutral-400">
          Subscription management opens in the Billing area once billing is enabled for your
          account.
          {/* TODO(Phase 5): link to /dashboard/billing (Stripe customer portal). */}
        </p>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Session</CardTitle>
        </CardHeader>
        <div className="max-w-xs">
          <SignOutButton className="border border-neutral-800" />
        </div>
      </Card>
    </div>
  );
}
