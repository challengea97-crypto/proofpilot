/** Plan entitlements. These are enforced in server actions AND shown on /pricing. */

export const FREE_PROJECT_LIMIT = 3;

const RANK: Record<string, number> = {
  free: 0,
  founderReport: 1,
  radar: 2,
  consultant: 3,
};

export function planRank(plan: string | null | undefined): number {
  return RANK[plan ?? "free"] ?? 0;
}

/** Any paid plan (Founder Report and above). */
export function isPaid(plan: string | null | undefined): boolean {
  return planRank(plan) >= 1;
}

/** Public share links require a paid plan (Founder Report+). */
export function canShareReports(plan: string | null | undefined): boolean {
  return planRank(plan) >= 1;
}

/** Watchlists + monitoring require Radar or above. */
export function canUseWatchlists(plan: string | null | undefined): boolean {
  return planRank(plan) >= 2;
}
