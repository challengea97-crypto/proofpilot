import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { PricingCards } from "@/components/PricingCards";
import { PricingComparison } from "@/components/PricingComparison";

export default function PricingPage() {
  return (
    <main className="min-h-screen">
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
