import Link from "next/link";
import { XCircle } from "lucide-react";
import { buttonVariants } from "@/components/ui/Button";

export const metadata = {
  title: "Checkout cancelled",
};

export default function CancelPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-ink bg-grid px-6">
      <section className="w-full max-w-lg rounded-3xl border border-neutral-800/80 bg-neutral-950/70 p-8 text-center shadow-glow backdrop-blur">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-800 text-neutral-300">
          <XCircle className="h-7 w-7" aria-hidden />
        </div>
        <h1 className="text-3xl font-black">Checkout cancelled</h1>
        <p className="mt-3 text-neutral-300">No payment was taken.</p>
        <Link href="/pricing" className={`${buttonVariants()} mt-6`}>
          Back to pricing
        </Link>
      </section>
    </main>
  );
}
