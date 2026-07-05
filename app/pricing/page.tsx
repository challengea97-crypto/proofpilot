import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { PricingCards } from "@/components/PricingCards";
import { PricingComparison } from "@/components/PricingComparison";

export default function PricingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-grid opacity-60" aria-hidden />
      <div
        className="pointer-events-none absolute -left-32 top-24 -z-10 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl animate-aurora"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-40 top-80 -z-10 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl animate-aurora [animation-delay:-9s]"
        aria-hidden
      />
      <Nav />
      <section className="mx-auto max-w-7xl px-6 py-12">
        <h1 className="text-5xl font-black">Pricing</h1>
        <p className="mt-4 max-w-2xl text-neutral-300">
          Start free, pay only when you need a serious report or recurring monitoring.
        </p>
        <div className="mt-8">
          <PricingCards />
        </div>
        <PricingComparison />
      </section>
      <Footer />
    </main>
  );
}
