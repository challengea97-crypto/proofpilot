"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { PLANS, PLAN_LABELS, type PlanKey } from "@/lib/pricing";
import { planRank, TRIAL_PLAN } from "@/lib/plan";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { cn } from "@/lib/utils";

type Action = "checkout" | "portal" | "signup" | "none";
type Cta = { label: string; action: Action; variant: "primary" | "secondary" };

export type PricingCardsProps = {
  /** The account's EFFECTIVE plan. Omitted for the public (logged-out) grid. */
  currentPlan?: string;
  isTrial?: boolean;
  hasCustomer?: boolean;
};

function ctaFor(planKey: PlanKey, props: PricingCardsProps): Cta {
  const { currentPlan, isTrial, hasCustomer } = props;

  // Public (logged-out) grid.
  if (!currentPlan) {
    return planKey === TRIAL_PLAN
      ? { label: "Start 5-day free trial", action: "signup", variant: "primary" }
      : { label: `Get ${PLAN_LABELS[planKey]}`, action: "checkout", variant: "secondary" };
  }

  // Founder Report is a one-time purchase — always available, never a tier move.
  if (planKey === "founderReport") {
    return { label: "Buy Founder Report", action: "checkout", variant: "secondary" };
  }

  // Trial users convert their trial plan.
  if (isTrial && planKey === TRIAL_PLAN) {
    return { label: "Continue on Radar", action: "checkout", variant: "primary" };
  }
  if (planKey === currentPlan) {
    return { label: "Current plan", action: "none", variant: "secondary" };
  }
  if (planRank(planKey) > planRank(currentPlan)) {
    // Changing an existing subscription must go through the portal.
    return {
      label: `Upgrade to ${PLAN_LABELS[planKey]}`,
      action: hasCustomer ? "portal" : "checkout",
      variant: "primary",
    };
  }
  return { label: `Downgrade to ${PLAN_LABELS[planKey]}`, action: "portal", variant: "secondary" };
}

export function PricingCards(props: PricingCardsProps) {
  const [loading, setLoading] = useState<PlanKey | null>(null);
  const [error, setError] = useState("");

  async function go(cta: Cta, plan: PlanKey) {
    if (cta.action === "none") return;
    if (cta.action === "signup") {
      window.location.href = "/login?redirectTo=/dashboard";
      return;
    }
    setLoading(plan);
    setError("");
    try {
      if (cta.action === "portal") {
        const r = await fetch("/api/stripe/portal", { method: "POST" });
        const d = await r.json();
        if (!r.ok) throw new Error(d.error || "Could not open the billing portal.");
        window.location.href = d.url;
        return;
      }
      const r = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const d = await r.json();
      if (!r.ok) {
        if (d.requiresAuth) {
          window.location.href = "/login?redirectTo=/dashboard/billing";
          return;
        }
        throw new Error(d.error || "Checkout failed.");
      }
      window.location.href = d.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-5 md:grid-cols-3">
        {PLANS.map((plan) => {
          const featured = plan.key === "radar";
          const isCurrent = props.currentPlan === plan.key && !props.isTrial;
          const cta = ctaFor(plan.key, props);
          return (
            <article
              key={plan.key}
              className={cn(
                "relative flex flex-col rounded-3xl border p-6 transition",
                isCurrent
                  ? "border-emerald-500/40 bg-emerald-500/[0.04]"
                  : featured
                    ? "border-white/20 bg-neutral-900/70 shadow-glow"
                    : "border-neutral-800/80 bg-neutral-950/60"
              )}
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-neutral-500">
                  {plan.cadence}
                </p>
                {isCurrent ? (
                  <span className="rounded-full bg-emerald-400 px-2.5 py-0.5 text-xs font-bold text-neutral-950">
                    Current
                  </span>
                ) : featured ? (
                  <span className="rounded-full bg-white px-2.5 py-0.5 text-xs font-bold text-neutral-950">
                    {props.currentPlan ? "Popular" : "Free trial"}
                  </span>
                ) : null}
              </div>
              <h3 className="mt-3 text-2xl font-black">{plan.name}</h3>
              <p className="mt-2 text-4xl font-black">
                {plan.price}
                <span className="text-base font-medium text-neutral-500">
                  {plan.cadence === "monthly" ? "/mo" : ""}
                </span>
              </p>
              <p className="mt-4 min-h-16 text-sm text-neutral-400">{plan.description}</p>
              <Button
                onClick={() => go(cta, plan.key)}
                loading={loading === plan.key}
                disabled={cta.action === "none"}
                variant={cta.variant}
                className="mt-6 w-full"
              >
                {loading === plan.key ? "Opening…" : cta.label}
              </Button>
              {featured && !props.currentPlan && (
                <p className="mt-2 flex items-center justify-center gap-1 text-xs text-neutral-500">
                  <Check className="h-3 w-3" aria-hidden /> No credit card required
                </p>
              )}
            </article>
          );
        })}
      </div>
      {error && <Alert tone="error">{error}</Alert>}
    </div>
  );
}
