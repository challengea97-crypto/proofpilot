import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { AuthArtwork } from "@/components/auth/AuthArtwork";

/** Two-column auth layout: branded artwork panel (lg+) on the left, form on the right. */
export function AuthSplit({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-ink lg:grid lg:grid-cols-2">
      <aside className="relative hidden border-r border-neutral-800 bg-neutral-950 lg:block">
        <AuthArtwork />
      </aside>

      <div className="flex min-h-screen flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <Link href="/" className="mb-8 flex items-center justify-center gap-3 lg:hidden">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-neutral-950">
              <ShieldCheck size={22} />
            </span>
            <span className="text-xl font-black">Teckro</span>
          </Link>

          <h1 className="text-center text-2xl font-black lg:text-left">{title}</h1>
          {subtitle && (
            <p className="mt-1 text-center text-sm text-neutral-400 lg:text-left">{subtitle}</p>
          )}

          <div className="mt-6">{children}</div>

          <p className="mt-6 text-center text-sm text-neutral-500 lg:text-left">
            <Link href="/" className="hover:text-neutral-300">
              ← Back to home
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
