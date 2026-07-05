import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { buttonVariants } from "@/components/ui/Button";

export function Nav() {
  return (
    <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
      <Link href="/" className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-neutral-950">
          <ShieldCheck size={22} />
        </span>
        <span>
          <span className="block text-xl font-black leading-none">Teckro</span>
          <span className="mt-1 block text-xs text-neutral-400">Proof before build</span>
        </span>
      </Link>
      <div className="flex items-center gap-2 sm:gap-3">
        <Link
          href="/pricing"
          className={`${buttonVariants({ variant: "ghost", size: "sm" })} hidden sm:inline-flex`}
        >
          Pricing
        </Link>
        <Link href="/login" className={buttonVariants({ variant: "secondary", size: "sm" })}>
          Sign in
        </Link>
        <Link href="/dashboard" className={buttonVariants({ variant: "primary", size: "sm" })}>
          Open app
        </Link>
      </div>
    </nav>
  );
}
