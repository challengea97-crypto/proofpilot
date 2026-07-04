import Link from "next/link";

export default function SuccessPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <section className="card max-w-xl text-center">
        <h1 className="text-4xl font-black">Payment successful</h1>
        <p className="mt-4 text-neutral-300">
          Stripe confirmed checkout. Your webhook will update access once Supabase is configured.
        </p>
        <Link href="/dashboard" className="btn-primary mt-6 inline-block">Go to dashboard</Link>
      </section>
    </main>
  );
}
