import { requireUser, getProfile } from "@/lib/auth";
import { isStripeConfigured } from "@/lib/env";
import { planLabel } from "@/lib/pricing";
import { effectivePlan, isTrialActive, trialDaysLeft } from "@/lib/plan";
import { PricingCards } from "@/components/PricingCards";
import { PricingComparison } from "@/components/PricingComparison";
import { ManageSubscriptionButton } from "@/components/billing/ManageSubscriptionButton";
import { TrialBanner } from "@/components/billing/TrialBanner";
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
  const trial = isTrialActive(profile);
  const effective = effectivePlan(profile);
  const hasCustomer = Boolean(profile?.stripe_customer_id);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black sm:text-3xl">Billing</h1>
        <p className="mt-1 text-neutral-400">Manage your plan and payment method.</p>
      </div>

      <TrialBanner profile={profile} />

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Current plan</CardTitle>
            <Badge tone={effective !== "free" ? "accent" : "neutral"}>
              {trial ? `${planLabel(effective)} · trial` : planLabel(effective)}
            </Badge>
          </div>
          <CardDescription>
            {trial
              ? `Your 5-day free trial gives you full Radar features — ${trialDaysLeft(profile)} day${trialDaysLeft(profile) === 1 ? "" : "s"} left. Choose a plan below to keep them.`
              : effective !== "free"
                ? "Thanks for supporting Teckro. Manage or change your plan any time."
                : "You're on the free plan. Start a plan below to unlock more."}
          </CardDescription>
        </CardHeader>
        {hasCustomer && <ManageSubscriptionButton />}
      </Card>

      <div>
        <h2 className="mb-4 text-lg font-bold">Plans</h2>
        {!stripeReady && (
          <p className="mb-4 rounded-xl border border-neutral-800 bg-neutral-950/60 px-4 py-3 text-sm text-neutral-400">
            Checkout activates once Stripe keys are configured. The buttons below are wired and
            ready — see <span className="font-mono text-xs">docs/SETUP.md</span>.
          </p>
        )}
        <PricingCards currentPlan={effective} isTrial={trial} hasCustomer={hasCustomer} />
      </div>

      <PricingComparison />
    </div>
  );
}
