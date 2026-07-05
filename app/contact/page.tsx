import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { ContactForm } from "@/components/contact/ContactForm";

export const metadata = {
  title: "Contact",
  description: "Get in touch with the Teckro team.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen">
      <Nav />
      <section className="mx-auto max-w-2xl px-6 py-16">
        <h1 className="text-4xl font-black sm:text-5xl">Get in touch</h1>
        <p className="mt-4 text-lg text-neutral-400">
          Questions, feedback, or partnership ideas? Send us a note.
        </p>
        <div className="mt-10 rounded-3xl border border-neutral-800/80 bg-neutral-950/60 p-6 shadow-glow sm:p-8">
          <ContactForm />
        </div>
      </section>
      <Footer />
    </main>
  );
}
