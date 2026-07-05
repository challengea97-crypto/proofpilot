import { ShieldCheck } from "lucide-react";

/** Branded splash shown during route transitions outside the dashboard. */
export default function RootLoading() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-ink bg-grid">
      <div className="relative">
        <div
          className="absolute -inset-8 rounded-full bg-emerald-500/10 blur-2xl animate-aurora"
          aria-hidden
        />
        <span className="relative flex h-16 w-16 animate-pulse items-center justify-center rounded-3xl bg-white text-neutral-950">
          <ShieldCheck size={32} />
        </span>
      </div>
      <p className="mt-6 text-lg font-black">Teckro</p>
      <p className="mt-1 text-sm text-neutral-500">Proof before build…</p>
    </main>
  );
}
