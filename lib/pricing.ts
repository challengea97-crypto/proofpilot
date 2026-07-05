export const PRICE_IDS = {
  founderReport: "price_1TpSjcDuOK9gZri6Ve4G7wdZ",
  radar: "price_1TpSk5DuOK9gZri677WpGg6b",
  consultant: "price_1TpSlCDuOK9gZri6b6VYhVqC"
} as const;

export type PlanKey = keyof typeof PRICE_IDS;

export const PLANS = [
  {
    key: "founderReport",
    name: "Founder Report",
    price: "A$19",
    cadence: "one-time",
    description: "Full validation report, competitor matrix, landing copy, and MVP plan."
  },
  {
    key: "radar",
    name: "Radar",
    price: "A$9",
    cadence: "monthly",
    description: "Saved research, competitor watchlists, and monitoring workflow."
  },
  {
    key: "consultant",
    name: "Consultant",
    price: "A$79",
    cadence: "monthly",
    description: "Client-ready reports, unlimited projects, exports, and workspaces."
  }
] as const;

/** Human-readable labels for every plan tier (including the default `free`). */
export const PLAN_LABELS: Record<string, string> = {
  free: "Free",
  founderReport: "Founder Report",
  radar: "Radar",
  consultant: "Consultant",
};

export function planLabel(plan: string | null | undefined): string {
  return (plan && PLAN_LABELS[plan]) || "Free";
}

/** Reverse-map a Stripe price ID back to a plan key (used by the webhook). */
export function planFromPriceId(priceId: string): PlanKey | null {
  const entry = (Object.entries(PRICE_IDS) as [PlanKey, string][]).find(
    ([, id]) => id === priceId
  );
  return entry ? entry[0] : null;
}
