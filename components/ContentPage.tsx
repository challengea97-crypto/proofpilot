import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

/** Shared shell for marketing/legal content pages (Nav + prose + Footer). */
export function ContentPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated?: string;
  children: React.ReactNode;
}) {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-grid opacity-60" aria-hidden />
      <div
        className="pointer-events-none absolute -left-32 top-32 -z-10 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl animate-aurora"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-40 bottom-24 -z-10 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl animate-aurora [animation-delay:-11s]"
        aria-hidden
      />
      <Nav />
      <section className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-4xl font-black sm:text-5xl">{title}</h1>
        {updated && <p className="mt-3 text-sm text-neutral-500">Last updated {updated}</p>}
        <div className="mt-8 space-y-5 leading-7 text-neutral-300 [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-white [&_li_a]:text-white [&_li_a]:underline [&_p_a]:text-white [&_p_a]:underline [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-6">
          {children}
        </div>
      </section>
      <Footer />
    </main>
  );
}
