import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export function Nav() {
  return (
    <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
      <Link href="/" className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-neutral-950">
          <ShieldCheck size={22} />
        </span>
        <span>
          <span className="block text-xl font-black">ProofPilot</span>
          <span className="block text-xs text-neutral-400">Proof before build</span>
        </span>
      </Link>
      <div className="flex items-center gap-3">
        <Link href="/pricing" className="btn-secondary">Pricing</Link>
        <Link href="/dashboard" className="btn-primary">Open app</Link>
      </div>
    </nav>
  );
}
