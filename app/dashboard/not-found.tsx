import Link from "next/link";
import { buttonVariants } from "@/components/ui/Button";

export default function DashboardNotFound() {
  return (
    <div className="rounded-3xl border border-neutral-800 bg-neutral-950/40 px-6 py-16 text-center">
      <p className="text-sm font-bold uppercase tracking-[0.3em] text-neutral-500">404</p>
      <h2 className="mt-3 text-2xl font-black">Not found</h2>
      <p className="mt-2 text-neutral-400">
        This item doesn&apos;t exist, or you don&apos;t have access to it.
      </p>
      <Link
        href="/dashboard"
        className={`${buttonVariants({ variant: "secondary" })} mt-6`}
      >
        Back to dashboard
      </Link>
    </div>
  );
}
