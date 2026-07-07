/** Plan entitlements. Enforced in server actions AND shown on /pricing + /billing. */

export const FREE_PROJECT_LIMIT = 3;

/** New accounts get a free trial of the cheapest paid plan — no card required. */
export const TRIAL_DAYS = 5;
export const TRIAL_PLAN = "radar"; // cheapest paid plan; trial unlocks its features

const RANK: Record<string, number> = {
  free: 0,
  founderReport: 1,
  radar: 2,
  consultant: 3,
};

export function planRank(plan: string | null | undefined): number {
  return RANK[plan ?? "free"] ?? 0;
}

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

/** Any paid plan (Founder Report and above). */
export function isPaid(plan: string | null | undefined): boolean {
  return planRank(plan) >= 1;
}

/** Public share links require a paid plan (Founder Report+) or an active trial. */
export function canShareReports(plan: string | null | undefined): boolean {
  return planRank(plan) >= 1;
}

/** Watchlists + monitoring require Radar or above. */
export function canUseWatchlists(plan: string | null | undefined): boolean {
  return planRank(plan) >= 2;
}

/** Team sharing (inviting collaborators) requires the Consultant plan. */
export function canUseTeam(plan: string | null | undefined): boolean {
  return planRank(plan) >= 3;
}
