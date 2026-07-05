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
    <main className="min-h-screen">
      <Nav />
      <section className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-4xl font-black sm:text-5xl">{title}</h1>
        {updated && <p className="mt-3 text-sm text-neutral-500">Last updated {updated}</p>}
        <div className="mt-8 space-y-5 leading-7 text-neutral-300 [&_a]:text-white [&_a]:underline [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-white [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-6">
          {children}
        </div>
      </section>
      <Footer />
    </main>
  );
}
