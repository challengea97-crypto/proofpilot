import { Check, Minus } from "lucide-react";

const PLANS = ["Free", "Founder Report", "Radar", "Consultant"];

type Cell = boolean | string;

const ROWS: { feature: string; cells: [Cell, Cell, Cell, Cell] }[] = [
  { feature: "Projects", cells: ["3", "Unlimited", "Unlimited", "Unlimited"] },
  { feature: "Live AI Research", cells: [true, true, true, true] },
  { feature: "SWOT · Strategy · MVP · Pricing · Landing", cells: [true, true, true, true] },
  { feature: "Founder report + Markdown / PDF export", cells: [true, true, true, true] },
  { feature: "Saved reports", cells: [true, true, true, true] },
  { feature: "Public share links", cells: [false, true, true, true] },
  { feature: "Watchlists", cells: [false, false, true, true] },
  { feature: "Scheduled monitoring & alerts", cells: [false, false, true, true] },
  { feature: "Client-ready workspaces", cells: [false, false, false, true] },
  { feature: "Priority support", cells: [false, false, false, true] },
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
        <table className="w-full min-w-[680px] border-collapse text-left">
          <thead>
            <tr className="border-b border-neutral-800 bg-neutral-950/60">
              <th scope="col" className="p-4 text-sm font-bold text-neutral-300">
                Feature
              </th>
              {PLANS.map((plan) => (
                <th key={plan} scope="col" className="p-4 text-center text-sm font-bold text-white">
                  {plan}
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
        Founder Report is a one-time purchase; Radar and Consultant are monthly subscriptions.
      </p>
    </div>
  );
}
