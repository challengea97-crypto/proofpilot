"use client";

import { PLANS, type PlanKey } from "@/lib/pricing";
import { useState } from "react";

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
        body: JSON.stringify({ plan })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Checkout failed");

      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed");
    } finally {
      setLoading(null);
    }
  }

  return (
    <section className="grid gap-5 md:grid-cols-3">
      {PLANS.map((plan) => (
        <article key={plan.key} className="card">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-neutral-500">{plan.cadence}</p>
          <h3 className="mt-3 text-2xl font-black">{plan.name}</h3>
          <p className="mt-2 text-4xl font-black">{plan.price}</p>
          <p className="mt-4 min-h-20 text-neutral-300">{plan.description}</p>
          <button
            onClick={() => checkout(plan.key)}
            disabled={loading === plan.key}
            className="mt-6 w-full btn-primary disabled:opacity-60"
          >
            {loading === plan.key ? "Opening checkout..." : "Buy now"}
          </button>
        </article>
      ))}
      {error && <p className="md:col-span-3 rounded-2xl border border-red-900 bg-red-950/40 p-4 text-red-200">{error}</p>}
    </section>
  );
}
