import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

export const metadata = {
  title: "FAQ",
  description: "Answers to common questions about Teckro — AI startup validation.",
};

const FAQS: { q: string; a: string }[] = [
  {
    q: "What is Teckro?",
    a: "Teckro is an AI startup-validation platform. Describe an idea and it produces live research (competitors, demand, complaints, risks), plus strategy, MVP, pricing and landing analyses, all assembled into an evidence-directional founder report you can export and share.",
  },
  {
    q: "Is the AI real, or is this a demo?",
    a: "It's real. Every research run and analysis is generated live by an AI model and validated before it's saved to your project. There is no mock or placeholder output.",
  },
  {
    q: "How does validation work?",
    a: "Create a project with your idea, audience and problem. Run Live AI Research for an opportunity score and competitor map, then generate the Strategy, MVP, Pricing and Landing modules. Finally, assemble a founder report and export or share it.",
  },
  {
    q: "Is there a free plan?",
    a: "Yes. You can start free and create projects. Paid plans unlock the one-time Founder Report, the Radar monitoring subscription, and the Consultant plan for client-ready work.",
  },
  {
    q: "Can I export my reports?",
    a: "Every founder report can be downloaded as Markdown, printed or saved as a PDF from your browser, and shared via a read-only public link you control.",
  },
  {
    q: "What is Radar / monitoring?",
    a: "Radar keeps a per-project watchlist of competitors and pages. A scheduled job checks them for changes and sends you an in-app notification when something moves.",
  },
  {
    q: "Are my ideas kept private?",
    a: "Yes. Every project, report and analysis is scoped to your account with database row-level security — only you can read your data. Shared reports are visible only to people you send the private link to.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. Manage or cancel your subscription anytime from Billing, which opens the secure Stripe customer portal.",
  },
  {
    q: "How do I get started?",
    a: "Sign up free, create your first project, and run Live AI Research. It takes about a minute to your first report.",
  },
];

export default function FAQPage() {
  return (
    <main className="min-h-screen">
      <Nav />
      <section className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-4xl font-black sm:text-5xl">Frequently asked questions</h1>
        <p className="mt-4 text-lg text-neutral-400">Everything you need to know about Teckro.</p>

        <div className="mt-10 space-y-3">
          {FAQS.map((faq) => (
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
      </section>
      <Footer />
    </main>
  );
}
