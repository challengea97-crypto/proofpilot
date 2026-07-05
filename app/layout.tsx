import "./globals.css";
import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/env";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "ProofPilot — Evidence-linked startup validation",
    template: "%s · ProofPilot",
  },
  description:
    "Validate your startup before you build. Competitor intelligence, demand and review signals, pricing analysis, and an evidence-linked founder report.",
  openGraph: {
    title: "ProofPilot — Evidence-linked startup validation",
    description:
      "Turn a raw idea into a source-aware report: competitors, complaints, landing copy, MVP roadmap, pricing strategy, and launch plan.",
    url: siteUrl,
    siteName: "ProofPilot",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-ink font-sans text-neutral-100 antialiased">{children}</body>
    </html>
  );
}
