import { KeyRound } from "lucide-react";

/**
 * Shown wherever a feature needs environment configuration that isn't present
 * yet (e.g. Supabase or Stripe keys). Renders the exact variables to set — no
 * fake data, no silent failure.
 */
export function SetupNotice({
  title = "Configuration needed",
  description,
  vars,
}: {
  title?: string;
  description: string;
  vars: string[];
}) {
  return (
    <div className="rounded-3xl border border-neutral-800 bg-neutral-950/70 p-6 text-left">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-900 text-neutral-300">
        <KeyRound className="h-6 w-6" aria-hidden />
      </div>
      <h2 className="text-lg font-bold text-white">{title}</h2>
      <p className="mt-2 text-sm text-neutral-400">{description}</p>
      <ul className="mt-4 space-y-1.5">
        {vars.map((v) => (
          <li
            key={v}
            className="rounded-lg bg-neutral-900 px-3 py-2 font-mono text-xs text-neutral-300"
          >
            {v}
          </li>
        ))}
      </ul>
      <p className="mt-4 text-sm text-neutral-500">
        Add these in Netlify → <span className="text-neutral-300">Site configuration → Environment variables</span>,
        then redeploy. Full instructions are in <span className="text-neutral-300">docs/SETUP.md</span>.
      </p>
    </div>
  );
}
