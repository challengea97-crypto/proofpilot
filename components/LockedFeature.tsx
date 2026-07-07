import Link from "next/link";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/Button";

/** Shown in place of a feature's controls when the user's plan doesn't include it. */
export function LockedFeature({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-neutral-800 bg-neutral-900/40 px-6 py-10 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-900 text-neutral-300">
        <Lock className="h-5 w-5" aria-hidden />
      </span>
      <h3 className="text-lg font-bold text-white">{title}</h3>
      <p className="max-w-sm text-sm text-neutral-400">{description}</p>
      <Link href="/dashboard/billing" className="mt-1">
        <Button>Upgrade in Billing</Button>
      </Link>
    </div>
  );
}
