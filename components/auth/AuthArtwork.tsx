import { ShieldCheck, Search, Target, FileText } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const POINTS: [LucideIcon, string][] = [
  [Search, "Live competitor & demand research"],
  [Target, "Honest opportunity scoring"],
  [FileText, "Founder-ready reports in minutes"],
];

function Radar() {
  return (
    <svg
      viewBox="0 0 220 220"
      className="h-56 w-56 xl:h-64 xl:w-64"
      role="img"
      aria-label="Competitor radar illustration"
    >
      <defs>
        <radialGradient id="teckro-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(52,211,153,0.35)" />
          <stop offset="100%" stopColor="rgba(52,211,153,0)" />
        </radialGradient>
        <linearGradient id="teckro-sweep" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(52,211,153,0)" />
          <stop offset="100%" stopColor="rgba(52,211,153,0.55)" />
        </linearGradient>
      </defs>
      <circle cx="110" cy="110" r="100" fill="url(#teckro-glow)" />
      {[100, 72, 44, 20].map((r) => (
        <circle key={r} cx="110" cy="110" r={r} fill="none" stroke="rgba(255,255,255,0.12)" />
      ))}
      <line x1="10" y1="110" x2="210" y2="110" stroke="rgba(255,255,255,0.08)" />
      <line x1="110" y1="10" x2="110" y2="210" stroke="rgba(255,255,255,0.08)" />
      <g>
        <path d="M110 110 L110 10 A100 100 0 0 1 195 60 Z" fill="url(#teckro-sweep)" opacity="0.65" />
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 110 110"
          to="360 110 110"
          dur="6s"
          repeatCount="indefinite"
        />
      </g>
      {[
        [150, 70],
        [80, 60],
        [142, 150],
        [70, 138],
        [112, 46],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="4" fill="#34d399" />
      ))}
      <circle cx="110" cy="110" r="5" fill="#ffffff" />
    </svg>
  );
}

/** Branded left panel for the split auth layout. */
export function AuthArtwork() {
  return (
    <div className="relative flex h-full flex-col justify-between overflow-hidden p-10 xl:p-14">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_15%,rgba(52,211,153,0.16),transparent_45%),radial-gradient(circle_at_80%_85%,rgba(99,102,241,0.16),transparent_45%)]"
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-40" aria-hidden />

      <div className="relative flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-neutral-950">
          <ShieldCheck size={22} />
        </span>
        <span className="text-xl font-black">Teckro</span>
      </div>

      <div className="relative flex flex-1 items-center justify-center py-10">
        <Radar />
      </div>

      <div className="relative">
        <h2 className="text-3xl font-black leading-tight">See the whole field before you build.</h2>
        <ul className="mt-6 space-y-3 text-sm text-neutral-300">
          {POINTS.map(([Icon, text]) => (
            <li key={text} className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/10">
                <Icon className="h-4 w-4" aria-hidden />
              </span>
              {text}
            </li>
          ))}
        </ul>
        <p className="mt-8 text-sm text-neutral-500">Proof before build.</p>
      </div>
    </div>
  );
}
