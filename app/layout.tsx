import "./globals.css";
import type { Metadata, Viewport } from "next";
import { getSiteUrl } from "@/lib/env";

const siteUrl = getSiteUrl();

export const viewport: Viewport = {
  themeColor: "#070707",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Teckro — Evidence-linked startup validation",
    template: "%s · Teckro",
  },
  description:
    "Validate your startup before you build. Competitor intelligence, demand and review signals, pricing analysis, and an evidence-linked founder report.",
  openGraph: {
    title: "Teckro — Evidence-linked startup validation",
    description:
      "Turn a raw idea into a source-aware report: competitors, complaints, landing copy, MVP roadmap, pricing strategy, and launch plan.",
    url: siteUrl,
    siteName: "Teckro",
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
