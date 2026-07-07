/** Plan entitlements. Enforced in server actions AND shown on /pricing + /billing. */

/** New accounts get a free trial of the cheapest paid plan — no card required. */
export const TRIAL_DAYS = 5;
export const TRIAL_PLAN = "radar"; // cheapest paid plan; trial unlocks its features

const RANK: Record<string, number> = {
  free: 0,
  radar: 1,
  consultant: 2,
  founderReport: 3,
};

export function planRank(plan: string | null | undefined): number {
  return RANK[plan ?? "free"] ?? 0;
}

/** Projects a plan may create per calendar month (Infinity = unlimited). */
export function projectLimit(plan: string | null | undefined): number {
  switch (plan) {
    case "radar":
      return 10;
    case "consultant":
      return 30;
    case "founderReport":
      return Infinity;
    default:
      return 3; // free
  }
}
/** Kept for display fallbacks. */
export const FREE_PROJECT_LIMIT = 3;

/** Minimal shape needed to compute entitlements (a profile row or subset). */
export type PlanProfile = { plan?: string | null; trial_ends_at?: string | null } | null | undefined;

/** True while the free trial is still running (and no paid plan is active). */
export function isTrialActive(profile: PlanProfile): boolean {
  if (!profile) return false;
  if (planRank(profile.plan) >= 1) return false; // already paid — no trial needed
  if (!profile.trial_ends_at) return false;
  return new Date(profile.trial_ends_at).getTime() > Date.now();
}

/** Whole days remaining in the trial (0 once expired). */
export function trialDaysLeft(profile: PlanProfile): number {
  if (!profile?.trial_ends_at) return 0;
  const ms = new Date(profile.trial_ends_at).getTime() - Date.now();
  return ms <= 0 ? 0 : Math.ceil(ms / (24 * 60 * 60 * 1000));
}

/** Whether the account ever had a trial and it has now lapsed (still on free). */
export function isTrialExpired(profile: PlanProfile): boolean {
  if (!profile) return false;
  if (planRank(profile.plan) >= 1) return false;
  return Boolean(profile.trial_ends_at) && new Date(profile.trial_ends_at!).getTime() <= Date.now();
}

/**
 * The plan whose entitlements the account actually has right now: a paid plan
 * if one is active, otherwise the trial plan during the trial window, otherwise
 * `free`. All feature checks below should be fed this value.
 */
export function effectivePlan(profile: PlanProfile): string {
  const plan = profile?.plan ?? "free";
  if (planRank(plan) >= 1) return plan;
  return isTrialActive(profile) ? TRIAL_PLAN : "free";
}

export function isPaid(plan: string | null | undefined): boolean {
  return planRank(plan) >= 1;
}

// ---- Feature gates (fed the EFFECTIVE plan) --------------------------------

/** MVP, Pricing and Landing modules — Radar and above. */
export function canUseBuildModules(plan: string | null | undefined): boolean {
  return planRank(plan) >= 1;
}

/** Web Signals (live web search) — Consultant and above. */
export function canUseWebSignals(plan: string | null | undefined): boolean {
  return planRank(plan) >= 2;
}

/** Watchlists + monitoring — Consultant and above. */
export function canUseWatchlists(plan: string | null | undefined): boolean {
  return planRank(plan) >= 2;
}

/** Team sharing (inviting collaborators) — Consultant and above. */
export function canUseTeam(plan: string | null | undefined): boolean {
  return planRank(plan) >= 2;
}

/** Saving / exporting / sharing the Founder Report — Founder Report plan only. */
export function canUseFounderReport(plan: string | null | undefined): boolean {
  return planRank(plan) >= 3;
}

/** Public share links accompany the Founder Report — Founder Report plan only. */
export function canShareReports(plan: string | null | undefined): boolean {
  return planRank(plan) >= 3;
}

/**
 * Whether a given analysis module may run on this plan.
 * SWOT + Strategy are free; MVP/Pricing/Landing need Radar; Web Signals needs
 * Consultant. (Live AI Research is always available and gated separately.)
 */
export function canRunAnalysis(kind: string, plan: string | null | undefined): boolean {
  if (kind === "swot" || kind === "strategy") return true;
  if (kind === "signals") return canUseWebSignals(plan);
  return canUseBuildModules(plan); // mvp, pricing, landing
}
