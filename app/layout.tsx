import "./globals.css";
import type { Metadata, Viewport } from "next";
import { getSiteUrl } from "@/lib/env";
import { FaqDialog } from "@/components/FaqDialog";

const siteUrl = getSiteUrl();

export const viewport: Viewport = {
  themeColor: "#070707",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Teckro — AI startup validation",
    template: "%s · Teckro",
  },
  description:
    "Validate your startup before you build. AI competitor intelligence, demand signals, pricing analysis, live web signals with sources, and a decision-ready founder report.",
  openGraph: {
    title: "Teckro — AI startup validation",
    description:
      "Turn a raw idea into a decision-ready report: competitors, complaints, landing copy, MVP roadmap, pricing strategy, and launch plan.",
    url: siteUrl,
    siteName: "Teckro",
    type: "website",
  },
};

const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem('teckro-theme');var dark=t?t==='dark':!window.matchMedia('(prefers-color-scheme: light)').matches;var e=document.documentElement;e.classList.add('dark');e.classList.toggle('light',!dark);}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className="min-h-screen bg-ink font-sans text-neutral-100 antialiased">
        {children}
        <FaqDialog />
      </body>
    </html>
  );
}
