import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

export const metadata = {
  title: "FAQ",
  description: "Answers to common questions about Teckro — AI startup validation.",
};

const FAQS: { q: string; a: string }[] = [
  {
    q: "What is Teckro?",
    a: "Teckro is an AI startup-validation platform. Describe an idea and it produces live research (opportunity score, verdict, competitors, demand, complaints, risks), six analysis modules (Web Signals, SWOT, Strategy, MVP, Pricing, Landing), and assembles everything into an evidence-directional founder report you can export and share.",
  },
  {
    q: "Is the AI real, or is this a demo?",
    a: "It's real. Every research run and analysis is generated live by a large AI model and validated before it's saved to your project. There is no mock or placeholder output anywhere in the product.",
  },
  {
    q: "How does validation work?",
    a: "Create a project with your idea, audience and problem. Run Live AI Research for an opportunity score, verdict and competitor map, then generate the SWOT, Strategy, MVP, Pricing and Landing modules and a live Web Signals scan. Finally, assemble a founder report and export or share it.",
  },
  {
    q: "What does the opportunity score mean?",
    a: "A calibrated 0–100 estimate of how promising the idea looks based on the analysis: 80+ is rare and exceptional, 60–79 is promising with real risks, 40–59 means a crowded market or weak wedge, and below 40 signals structural problems. The verdict badge translates the score into plain language.",
  },
  {
    q: "What is the verdict?",
    a: "A plain-language read on your score: “Promising — worth pursuing”, “Possible — sharpen the wedge”, or “High risk — rethink the angle”. It's deterministic from the score, so it can't sugar-coat.",
  },
  {
    q: "Can I re-run research as my idea evolves?",
    a: "Yes — every run is saved, and the Research tab shows your score history over time so you can see whether sharpening the idea moved the number.",
  },
  {
    q: "What are the analysis modules?",
    a: "Six one-click modules per project: Web Signals (live web scan with sources), SWOT, AI Strategy (positioning, USP, go-to-market, 30-day launch plan), MVP Planner (must-haves, out-of-scope, milestones), Pricing (model, tiers, willingness-to-pay), and Landing Page (headlines, structure, CTA).",
  },
  {
    q: "Where does the AI's web data come from?",
    a: "The Web Signals module runs a live web search at generation time and lists the source URLs it used, so you can check every claim. Other modules are model-reasoned and clearly framed as directional hypotheses to validate.",
  },
  {
    q: "How accurate is it?",
    a: "Teckro is honest about this: output is evidence-directional, not gospel. It's designed to get you from a blank page to a defensible, testable plan in minutes — the next actions it gives you are how you turn hypotheses into proof with real customers.",
  },
  {
    q: "What's in the founder report?",
    a: "Your brief, the opportunity assessment, competitor map, demand signals, incumbent complaints, differentiators, risks, every generated module (including SWOT and Web Signals with sources), and recommended next actions — assembled automatically from your latest runs.",
  },
  {
    q: "Can I export reports?",
    a: "Yes — download any report as Markdown, or use Print / Save as PDF for a clean, print-styled document. Your data is yours.",
  },
  {
    q: "Can I share a report with someone who doesn't have an account?",
    a: "On paid plans, yes: create a private read-only link (teckro.app/r/…) that anyone can open. You can revoke it anytime with one click.",
  },
  {
    q: "Can I work with my team?",
    a: "On the Consultant plan you can invite collaborators to any project by email from the Team tab. They get read access to the research, analyses, watchlist and report; only the owner can run AI or make changes.",
  },
  {
    q: "What is the watchlist and monitoring?",
    a: "On Radar and above, each project has a watchlist of competitors and pages. A scheduled job checks watched URLs daily and sends you an in-app notification when something changes.",
  },
  {
    q: "How do notifications work?",
    a: "Teckro has a built-in notification inbox with an unread badge — you're notified when research completes, analyses finish, reports are saved, and when a watched page changes.",
  },
  {
    q: "What does the free plan include?",
    a: "Up to 3 projects with full Live AI Research, all six analysis modules, founder reports and exports. Paid plans add unlimited projects, share links, watchlist monitoring and team sharing — the full comparison table is on the Pricing page.",
  },
  {
    q: "How does billing work? Can I cancel anytime?",
    a: "Payments run through Stripe — we never see or store your card details. Founder Report is a one-time purchase; Radar and Consultant are monthly subscriptions you can manage or cancel anytime from Billing via the secure Stripe customer portal.",
  },
  {
    q: "Are my ideas kept private?",
    a: "Yes. Every project, report and analysis is protected by database row-level security — each account can only read its own data (verified with automated multi-user security tests). Shared content is visible only to people you explicitly invite or send a link to.",
  },
  {
    q: "Who owns what I create?",
    a: "You do. Your ideas, projects and reports are yours — export them anytime, delete them anytime.",
  },
  {
    q: "Can I install Teckro like an app?",
    a: "Yes — Teckro is an installable web app (PWA). In Chrome or Edge choose “Install Teckro” from the browser menu; on iOS Safari use Share → Add to Home Screen.",
  },
  {
    q: "I forgot my password — what do I do?",
    a: "Click “Forgot password?” on the sign-in page and we'll email you a secure link to set a new one.",
  },
  {
    q: "How fast is it?",
    a: "Research and each module typically complete in seconds to about a minute — you'll hear a soft chime when a run finishes (you can turn that off in Settings).",
  },
  {
    q: "How do I get started?",
    a: "Sign up free, create your first project (there's a one-click example if you want to just try it), and run Live AI Research. It takes about a minute to your first report.",
  },
];

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
