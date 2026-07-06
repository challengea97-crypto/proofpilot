import Link from "next/link";
import { ShieldCheck } from "lucide-react";

const COLUMNS: { title: string; links: [string, string][] }[] = [
  {
    title: "Product",
    links: [
      ["Pricing", "/pricing"],
      ["FAQ", "/faq"],
      ["Open app", "/dashboard"],
      ["Sign in", "/login"],
    ],
  },
  {
    title: "Company",
    links: [
      ["About", "/about"],
      ["Contact", "/contact"],
    ],
  },
  {
    title: "Legal",
    links: [
      ["Terms", "/terms"],
      ["Privacy", "/privacy"],
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-neutral-800">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-neutral-950">
                <ShieldCheck size={18} />
              </span>
              <span className="text-lg font-black">Teckro</span>
            </Link>
            <p className="mt-3 max-w-xs text-sm text-neutral-500">
              AI startup validation. Proof before build.
            </p>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="text-sm font-bold text-neutral-300">{col.title}</p>
              <ul className="mt-3 space-y-2">
                {col.links.map(([label, href]) => (
                  <li key={href}>
                    <Link href={href} className="text-sm text-neutral-500 transition hover:text-white">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-neutral-800 pt-6 text-sm text-neutral-600 sm:flex-row">
          <p>© {new Date().getFullYear()} Teckro. All rights reserved.</p>
          <p>Built for founders who validate before they build.</p>
        </div>
      </div>
    </footer>
  );
}
