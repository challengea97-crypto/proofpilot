import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/Button";

export const metadata = {
  title: "Payment successful",
};

export default function SuccessPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-ink bg-grid px-6">
      <section className="w-full max-w-lg rounded-3xl border border-neutral-800/80 bg-neutral-950/70 p-8 text-center shadow-glow backdrop-blur">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-300">
          <CheckCircle2 className="h-7 w-7" aria-hidden />
        </div>
        <h1 className="text-3xl font-black">Payment successful</h1>
        <p className="mt-3 text-neutral-300">
          Stripe confirmed your checkout. Your access updates automatically once the webhook is
          processed.
        </p>
        <Link href="/dashboard" className={`${buttonVariants()} mt-6`}>
          Go to dashboard
        </Link>
      </section>
    </main>
  );
}
