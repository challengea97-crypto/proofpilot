import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { FAQ_CATEGORIES } from "@/lib/faq";

export const metadata = {
  title: "FAQ",
  description: "Answers to common questions about Teckro — AI startup validation.",
};

export default function FAQPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-grid opacity-60" aria-hidden />
      <div
        className="pointer-events-none absolute -right-32 top-40 -z-10 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl animate-aurora"
        aria-hidden
      />
      <Nav />
      <section className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-4xl font-black sm:text-5xl">Frequently asked questions</h1>
        <p className="mt-4 text-lg text-neutral-400">
          Everything you need to know about Teckro. Tip: tap the{" "}
          <span className="font-semibold text-white">?</span> button any time to search.
        </p>

        {FAQ_CATEGORIES.map((cat) => (
          <div key={cat.category} className="mt-10">
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-neutral-500">
              {cat.category}
            </h2>
            <div className="mt-4 space-y-3">
              {cat.items.map((faq) => (
                <details
                  key={faq.q}
                  className="group rounded-2xl border border-neutral-800 bg-neutral-950/50 p-5 transition hover:border-neutral-700"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-white">
                    {faq.q}
                    <span
                      className="text-2xl leading-none text-neutral-500 transition-transform group-open:rotate-45"
                      aria-hidden
                    >
                      +
                    </span>
                  </summary>
                  <p className="mt-3 leading-7 text-neutral-400">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        ))}
      </section>
      <Footer />
    </main>
  );
}
