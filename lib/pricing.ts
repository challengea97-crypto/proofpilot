// NOTE: these Stripe price IDs are placeholders from the original project. When
// you configure Stripe, create three MONTHLY prices (A$25 / A$60 / A$99) and
// paste their price IDs here — see docs/SETUP.md.
export const PRICE_IDS = {
  radar: "price_1TpSk5DuOK9gZri677WpGg6b",
  consultant: "price_1TpSlCDuOK9gZri6b6VYhVqC",
  founderReport: "price_1TpSjcDuOK9gZri6Ve4G7wdZ",
} as const;

export type PlanKey = keyof typeof PRICE_IDS;

/** Plans shown on /pricing + /billing, cheapest paid first. */
export const PLANS = [
  {
    key: "radar",
    name: "Radar",
    price: "A$25",
    cadence: "monthly",
    projects: "10 projects / month",
    description: "Everything in Free, plus the MVP, Pricing and Landing modules.",
  },
  {
    key: "consultant",
    name: "Consultant",
    price: "A$60",
    cadence: "monthly",
    projects: "30 projects / month",
    description: "Web Signals, watchlists, monitoring and team sharing — everything except the Founder Report.",
  },
  {
    key: "founderReport",
    name: "Founder Report",
    price: "A$99",
    cadence: "monthly",
    projects: "Unlimited projects",
    description: "Every feature, including the exportable, shareable Founder Report.",
  },
] as const;

/** Human-readable labels for every plan tier (including the default `free`). */
export const PLAN_LABELS: Record<string, string> = {
  free: "Free",
  radar: "Radar",
  consultant: "Consultant",
  founderReport: "Founder Report",
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
