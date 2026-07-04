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
