import Link from "next/link";

export default function CancelPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <section className="card max-w-xl text-center">
        <h1 className="text-4xl font-black">Checkout cancelled</h1>
        <p className="mt-4 text-neutral-300">No payment was taken.</p>
        <Link href="/pricing" className="btn-primary mt-6 inline-block">Back to pricing</Link>
      </section>
    </main>
  );
}
