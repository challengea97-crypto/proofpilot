import Link from "next/link";
import { buttonVariants } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-ink bg-grid px-6 text-center">
      <p className="text-sm font-bold uppercase tracking-[0.3em] text-neutral-500">404</p>
      <h1 className="mt-4 text-4xl font-black">Page not found</h1>
      <p className="mt-3 max-w-md text-neutral-400">
        The page you&apos;re looking for doesn&apos;t exist or has moved.
      </p>
      <Link href="/" className={`${buttonVariants()} mt-8`}>
        Back to home
      </Link>
    </main>
  );
}
