import Link from "next/link";
import { ShieldCheck } from "lucide-react";

/** Centered branded card used by the auth pages. */
export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-ink bg-grid px-6 py-16">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-8 flex items-center justify-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-neutral-950">
            <ShieldCheck size={22} />
          </span>
          <span className="text-xl font-black">Teckro</span>
        </Link>
        <div className="rounded-3xl border border-neutral-800/80 bg-neutral-950/70 p-6 shadow-glow backdrop-blur sm:p-8">
          <h1 className="text-center text-2xl font-black">{title}</h1>
          {subtitle && <p className="mt-1 text-center text-sm text-neutral-400">{subtitle}</p>}
          <div className="mt-6">{children}</div>
        </div>
      </div>
    </main>
  );
}
