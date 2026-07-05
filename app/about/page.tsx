import Link from "next/link";
import { ContentPage } from "@/components/ContentPage";
import { buttonVariants } from "@/components/ui/Button";

export const metadata = {
  title: "About",
  description: "Why Teckro exists: validate startups with evidence before building.",
};

export default function AboutPage() {
  return (
    <ContentPage title="Validate before you build.">
      <h2>Our mission</h2>
      <p>
        Most startups fail not because the team couldn&apos;t build, but because they built the
        wrong thing. Founders spend months on an idea before ever checking whether the market,
        the competition, or the pricing actually work. Teckro exists to flip that order — to make
        rigorous validation the first step, not an afterthought.
      </p>

      <h2>What Teckro does</h2>
      <p>
        You describe an idea. Teckro runs live AI research — competitors, demand signals, common
        complaints about incumbents, risks — and turns it into an opportunity score. From there it
        builds a go-to-market strategy, a scoped MVP plan, a pricing recommendation and a landing
        page blueprint, then assembles everything into a founder report you can export and share.
      </p>

      <h2>Evidence-directional, by design</h2>
      <p>
        We&apos;re honest about what AI can and can&apos;t do. Teckro&apos;s output is
        <em> directional</em> — sharp, specific hypotheses to validate with real customers, not
        guarantees. It gets you to a defensible plan in minutes instead of weeks, so you can spend
        your time testing the things that matter.
      </p>

      <div className="pt-4">
        <Link href="/dashboard" className={buttonVariants({ size: "lg" })}>
          Run a free reality check
        </Link>
      </div>
    </ContentPage>
  );
}
