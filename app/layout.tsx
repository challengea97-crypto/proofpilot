import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ProofPilot",
  description: "Evidence-linked AI startup validation platform."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
