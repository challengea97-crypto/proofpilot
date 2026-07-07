/** Branded radar splash shown during route transitions. Pure SVG/SMIL — no JS. */
export default function RootLoading() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-ink bg-grid">
      <div className="relative">
        <div className="absolute -inset-10 rounded-full bg-emerald-500/10 blur-3xl" aria-hidden />
        <svg
          viewBox="0 0 220 220"
          className="relative h-40 w-40"
          role="img"
          aria-label="Loading"
        >
          <defs>
            <radialGradient id="load-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(52,211,153,0.25)" />
              <stop offset="100%" stopColor="rgba(52,211,153,0)" />
            </radialGradient>
            <linearGradient id="load-sweep" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="rgba(52,211,153,0)" />
              <stop offset="100%" stopColor="rgba(52,211,153,0.6)" />
            </linearGradient>
          </defs>
          <circle cx="110" cy="110" r="100" fill="url(#load-glow)" />
          {[100, 74, 48, 24].map((r) => (
            <circle key={r} cx="110" cy="110" r={r} fill="none" stroke="rgba(255,255,255,0.12)" />
          ))}
          <line x1="10" y1="110" x2="210" y2="110" stroke="rgba(255,255,255,0.08)" />
          <line x1="110" y1="10" x2="110" y2="210" stroke="rgba(255,255,255,0.08)" />
          <g>
            <path d="M110 110 L110 10 A100 100 0 0 1 200 65 Z" fill="url(#load-sweep)" opacity="0.7" />
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 110 110"
              to="360 110 110"
              dur="1.6s"
              repeatCount="indefinite"
            />
          </g>
          <circle cx="110" cy="110" r="4" fill="#ffffff" />
        </svg>
      </div>
      <p className="mt-6 text-lg font-black">Teckro</p>
      <p className="mt-1 text-sm text-neutral-500">Scanning the market…</p>
    </main>
  );
}
