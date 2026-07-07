import Link from "next/link";
import { Sparkles, Clock } from "lucide-react";
import { isTrialActive, isTrialExpired, trialDaysLeft, type PlanProfile } from "@/lib/plan";

/** Inline banner communicating trial state. Renders nothing for paid accounts. */
export function TrialBanner({ profile }: { profile: PlanProfile }) {
  if (isTrialActive(profile)) {
    const days = trialDaysLeft(profile);
    return (
      <div className="flex flex-col gap-2 rounded-2xl border border-emerald-500/25 bg-emerald-500/[0.06] px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
        <span className="flex items-center gap-2 text-emerald-200">
          <Sparkles className="h-4 w-4 shrink-0" aria-hidden />
          You&apos;re on a free trial of Radar — <strong>{days} day{days === 1 ? "" : "s"} left</strong>.
        </span>
        <Link
          href="/dashboard/billing"
          className="shrink-0 font-semibold text-white underline underline-offset-2 hover:text-emerald-200"
        >
          Choose a plan →
        </Link>
      </div>
    );
  }

  if (isTrialExpired(profile)) {
    return (
      <div className="flex flex-col gap-2 rounded-2xl border border-amber-500/25 bg-amber-500/[0.06] px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
        <span className="flex items-center gap-2 text-amber-200">
          <Clock className="h-4 w-4 shrink-0" aria-hidden />
          Your free trial has ended — you&apos;re on the Free plan now.
        </span>
        <Link
          href="/dashboard/billing"
          className="shrink-0 font-semibold text-white underline underline-offset-2 hover:text-amber-200"
        >
          Upgrade to unlock Radar →
        </Link>
      </div>
    );
  }

  return null;
}
