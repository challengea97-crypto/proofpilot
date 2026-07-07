import { Check, Minus } from "lucide-react";

const PLAN_COLS = [
  { name: "Free", price: "A$0" },
  { name: "Radar", price: "A$25/mo" },
  { name: "Consultant", price: "A$60/mo" },
  { name: "Founder Report", price: "A$99/mo" },
];

type Cell = boolean | string;

const ROWS: { feature: string; cells: [Cell, Cell, Cell, Cell] }[] = [
  { feature: "Projects / month", cells: ["3", "10", "30", "Unlimited"] },
  { feature: "Live AI Research", cells: [true, true, true, true] },
  { feature: "SWOT", cells: [true, true, true, true] },
  { feature: "Strategy", cells: [true, true, true, true] },
  { feature: "MVP Planner", cells: [false, true, true, true] },
  { feature: "Pricing analysis", cells: [false, true, true, true] },
  { feature: "Landing analysis", cells: [false, true, true, true] },
  { feature: "Web Signals (live web + sources)", cells: [false, false, true, true] },
  { feature: "Watchlists + monitoring", cells: [false, false, true, true] },
  { feature: "Team sharing", cells: [false, false, true, true] },
  { feature: "Founder Report (export + share)", cells: [false, false, false, true] },
];

function CellView({ value }: { value: Cell }) {
  if (value === true) {
    return <Check className="mx-auto h-5 w-5 text-emerald-400" aria-label="Included" />;
  }
  if (value === false) {
    return <Minus className="mx-auto h-4 w-4 text-neutral-700" aria-label="Not included" />;
  }
  return <span className="text-sm font-semibold text-white">{value}</span>;
}

export function PricingComparison() {
  return (
    <div className="mt-16">
      <h2 className="text-2xl font-black sm:text-3xl">Compare plans</h2>
      <div className="mt-6 overflow-x-auto rounded-3xl border border-neutral-800">
        <table className="w-full min-w-[720px] border-collapse text-left">
          <thead>
            <tr className="border-b border-neutral-800 bg-neutral-950/60">
              <th scope="col" className="p-4 text-sm font-bold text-neutral-300">
                Feature
              </th>
              {PLAN_COLS.map((plan) => (
                <th key={plan.name} scope="col" className="p-4 text-center">
                  <div className="text-sm font-bold text-white">{plan.name}</div>
                  <div className="text-xs font-medium text-neutral-500">{plan.price}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row, i) => (
              <tr key={row.feature} className={i % 2 === 1 ? "bg-neutral-950/30" : undefined}>
                <th scope="row" className="p-4 text-left text-sm font-medium text-neutral-300">
                  {row.feature}
                </th>
                {row.cells.map((cell, j) => (
                  <td key={j} className="p-4 text-center align-middle">
                    <CellView value={cell} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-neutral-600">
        Every account starts with a 5-day free trial of Radar — no credit card required. All paid
        plans are monthly and cancel anytime.
      </p>
    </div>
  );
}
