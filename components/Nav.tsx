"use client";

import { useState } from "react";
import Link from "next/link";
import { ShieldCheck, Menu, X } from "lucide-react";
import { buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const LINKS: [string, string][] = [
  ["Features", "/features"],
  ["Pricing", "/pricing"],
  ["About", "/about"],
  ["Contact", "/contact"],
];

export function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-800/60 bg-ink/70 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4" aria-label="Main">
        <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-neutral-950">
            <ShieldCheck size={20} />
          </span>
          <span className="text-xl font-black leading-none">Teckro</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {LINKS.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className="rounded-full px-3 py-2 text-sm font-medium text-neutral-300 transition hover:bg-neutral-900 hover:text-white"
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <Link href="/login" className={buttonVariants({ variant: "secondary", size: "sm" })}>
            Sign in
          </Link>
          <Link href="/dashboard" className={buttonVariants({ variant: "primary", size: "sm" })}>
            Open app
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
          className="rounded-full p-2 text-neutral-300 transition hover:bg-neutral-900 hover:text-white md:hidden"
        >
          {open ? <X className="h-6 w-6" aria-hidden /> : <Menu className="h-6 w-6" aria-hidden />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-neutral-800 bg-ink md:hidden">
          <div className="mx-auto max-w-7xl space-y-1 px-6 py-4">
            {LINKS.map(([label, href]) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="block rounded-xl px-3 py-2.5 text-sm font-medium text-neutral-300 transition hover:bg-neutral-900 hover:text-white"
              >
                {label}
              </Link>
            ))}
            <div className="flex gap-2 pt-3">
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className={cn(buttonVariants({ variant: "secondary", size: "sm" }), "flex-1 justify-center")}
              >
                Sign in
              </Link>
              <Link
                href="/dashboard"
                onClick={() => setOpen(false)}
                className={cn(buttonVariants({ variant: "primary", size: "sm" }), "flex-1 justify-center")}
              >
                Open app
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
