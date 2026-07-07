export type FaqItem = { q: string; a: string };
export type FaqCategory = { category: string; items: FaqItem[] };

/** Single source of truth for FAQs — used by the FAQ dialog and the /faq page. */
export const FAQ_CATEGORIES: FaqCategory[] = [
  {
    category: "Getting started",
    items: [
      {
        q: "What is Teckro?",
        a: "Teckro is an AI startup-validation platform. Describe an idea and it produces live research (opportunity score, verdict, competitors, demand, complaints, risks), analysis modules (SWOT, Strategy, MVP, Pricing, Landing, Web Signals) and a decision-ready founder report you can export and share.",
      },
      {
        q: "How does validation work?",
        a: "Create a project with your idea, audience and problem. Run Live AI Research for a score, verdict and competitor map, then generate the analysis modules your plan includes. Finally, assemble a founder report and export or share it.",
      },
      {
        q: "How do I get started?",
        a: "Sign up free — you get a 5-day free trial of Radar with no credit card. Create your first project (there's a one-click example), and run Live AI Research. It's about a minute to your first result.",
      },
      {
        q: "Is the AI real, or is this a demo?",
        a: "It's real. Every research run and analysis is generated live by a large AI model and validated before it's saved. There is no mock or placeholder output.",
      },
    ],
  },
  {
    category: "Features",
    items: [
      {
        q: "What does the opportunity score mean?",
        a: "A calibrated 0–100 estimate of how promising the idea looks: 80+ is rare/exceptional, 60–79 promising with real risks, 40–59 crowded or weak, below 40 structural problems. The verdict badge translates it into plain language.",
      },
      {
        q: "What are the analysis modules?",
        a: "Live AI Research, SWOT, Strategy, MVP Planner, Pricing, Landing, and Web Signals (a live web scan with sources). Which modules you can run depends on your plan.",
      },
      {
        q: "Where does the AI's web data come from?",
        a: "The Web Signals module runs a live web search at generation time and lists the source URLs it used. Other modules are model-reasoned and clearly framed as directional hypotheses to validate.",
      },
      {
        q: "What's in the founder report?",
        a: "An executive summary with score, confidence and verdict, a competitor table, color-coded strengths and risks, every generated module, recommended next actions, and a methodology note distinguishing AI inference from web-sourced data.",
      },
      {
        q: "Can I export and share reports?",
        a: "On the Founder Report plan you can export to Markdown, print/Save-as-PDF, and create a private, revocable read-only link anyone can open.",
      },
      {
        q: "What is Radar monitoring?",
        a: "On Consultant and above, each project has a watchlist of competitors and pages. A daily job checks them and notifies you in-app when the meaningful visible content changes.",
      },
      {
        q: "Can I work with my team?",
        a: "On Consultant and above you can invite collaborators to a project by email. They get read access to everything; only the owner can run AI or make changes.",
      },
      {
        q: "Can I install Teckro like an app?",
        a: "Yes — it's an installable web app (PWA). In Chrome/Edge choose “Install Teckro”; on iOS Safari use Share → Add to Home Screen.",
      },
    ],
  },
  {
    category: "Plans & billing",
    items: [
      {
        q: "How does the free trial work?",
        a: "When you sign up you get a 5-day free trial of Radar (our cheapest plan) with no credit card required. You get the full Radar feature set during the trial. When it ends you can choose a plan to continue; otherwise your account moves to the Free plan.",
      },
      {
        q: "Do I need a credit card to start?",
        a: "No. Starting your 5-day trial needs only an email and password. You only enter payment details (via Stripe's secure checkout) if you choose a paid plan.",
      },
      {
        q: "What's included in each plan?",
        a: "Free ($0, 3 projects/mo): Live AI Research, SWOT, Strategy. Radar ($25/mo, 10 projects/mo): adds MVP, Pricing and Landing. Consultant ($60/mo, 30 projects/mo): adds Web Signals, watchlists, monitoring and team sharing. Founder Report ($99/mo, unlimited): every feature, including the exportable, shareable Founder Report.",
      },
      {
        q: "How do project limits work?",
        a: "Each plan has a monthly project quota: Free 3, Radar 10, Consultant 30, and Founder Report unlimited. The count resets at the start of each calendar month.",
      },
      {
        q: "Can I upgrade or downgrade later?",
        a: "Yes. From Billing you can upgrade (Stripe checkout) or downgrade / change an existing subscription (Stripe's secure customer portal) at any time. You only ever have access to what your current plan includes.",
      },
      {
        q: "How does billing work? Can I cancel anytime?",
        a: "Payments run through Stripe — we never see or store your card details. All paid plans are monthly and you can cancel anytime from Billing via the Stripe customer portal.",
      },
    ],
  },
  {
    category: "Privacy & security",
    items: [
      {
        q: "Are my ideas kept private?",
        a: "Yes. Every project, report and analysis is protected by database row-level security — each account can only read its own data (verified with automated multi-user security tests). Shared content is visible only to people you explicitly invite or send a link to.",
      },
      {
        q: "Who owns what I create?",
        a: "You do. Your ideas, projects and reports are yours — export them anytime (on the Founder Report plan) and delete them anytime.",
      },
      {
        q: "Is my payment information safe?",
        a: "Yes. All payments are processed by Stripe. Teckro never sees or stores your card number.",
      },
    ],
  },
  {
    category: "Account",
    items: [
      {
        q: "I forgot my password — what do I do?",
        a: "Click “Forgot password?” on the sign-in page and we'll email you a secure link to set a new one.",
      },
      {
        q: "How fast is it?",
        a: "Research and each module typically complete in seconds to about a minute — you'll hear a soft chime when a run finishes (you can turn that off in Settings).",
      },
      {
        q: "How do I contact support?",
        a: "Use the Contact page to send us a message — it reaches the team directly.",
      },
    ],
  },
];

export const ALL_FAQS: FaqItem[] = FAQ_CATEGORIES.flatMap((c) => c.items);
