import { requireUser, getProfile } from "@/lib/auth";
import { isStripeConfigured } from "@/lib/env";
import { planLabel } from "@/lib/pricing";
import { PricingCards } from "@/components/PricingCards";
import { ManageSubscriptionButton } from "@/components/billing/ManageSubscriptionButton";
import { SetupNotice } from "@/components/SetupNotice";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Billing",
};

export default async function BillingPage() {
  const user = await requireUser();
  const profile = await getProfile(user);
  const stripeReady = isStripeConfigured();
  const plan = profile?.plan ?? "free";
  const hasCustomer = Boolean(profile?.stripe_customer_id);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black sm:text-3xl">Billing</h1>
        <p className="mt-1 text-neutral-400">Manage your plan and payment method.</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Current plan</CardTitle>
            <Badge tone={plan !== "free" ? "accent" : "neutral"}>{planLabel(plan)}</Badge>
          </div>
          <CardDescription>
            {plan !== "free"
              ? "Thanks for supporting Teckro. Manage or cancel any time."
              : "You're on the free plan. Upgrade below when you're ready."}
          </CardDescription>
        </CardHeader>
        {hasCustomer && <ManageSubscriptionButton />}
      </Card>

      <div>
        <h2 className="mb-4 text-lg font-bold">Plans</h2>
        {stripeReady ? (
          <PricingCards />
        ) : (
          <SetupNotice
            title="Billing not configured"
            description="Add these environment variables to enable checkout, then redeploy:"
            vars={[
              "STRIPE_SECRET_KEY",
              "STRIPE_WEBHOOK_SECRET",
              "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
            ]}
          />
        )}
      </div>
    </div>
  );
}
