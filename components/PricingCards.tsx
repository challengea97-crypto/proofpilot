"use client";

import { useState } from "react";
import { PLANS, type PlanKey } from "@/lib/pricing";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { cn } from "@/lib/utils";

export function PricingCards() {
  const [loading, setLoading] = useState<PlanKey | null>(null);
  const [error, setError] = useState("");

  async function checkout(plan: PlanKey) {
    setLoading(plan);
    setError("");
    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ plan }),
      });

      const data = await response.json();
      if (!response.ok) {
        if (data.requiresAuth) {
          window.location.href = "/login?redirectTo=/dashboard/billing";
          return;
        }
        throw new Error(data.error || "Checkout failed");
      }

      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-5 md:grid-cols-3">
        {PLANS.map((plan) => {
          const featured = plan.key === "radar";
          return (
            <article
              key={plan.key}
              className={cn(
                "flex flex-col rounded-3xl border p-6",
                featured
                  ? "border-white/20 bg-neutral-900/70 shadow-glow"
                  : "border-neutral-800/80 bg-neutral-950/60"
              )}
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-neutral-500">
                  {plan.cadence}
                </p>
                {featured && (
                  <span className="rounded-full bg-white px-2.5 py-0.5 text-xs font-bold text-neutral-950">
                    Popular
                  </span>
                )}
              </div>
              <h3 className="mt-3 text-2xl font-black">{plan.name}</h3>
              <p className="mt-2 text-4xl font-black">{plan.price}</p>
              <p className="mt-4 min-h-16 text-sm text-neutral-400">{plan.description}</p>
              <Button
                onClick={() => checkout(plan.key)}
                loading={loading === plan.key}
                variant={featured ? "primary" : "secondary"}
                className="mt-6 w-full"
              >
                {loading === plan.key ? "Opening checkout…" : "Buy now"}
              </Button>
            </article>
          );
        })}
      </div>
      {error && <Alert tone="error">{error}</Alert>}
    </div>
  );
}
