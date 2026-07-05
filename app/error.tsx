"use client";

import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/Button";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-ink px-6 text-center">
      <h1 className="text-3xl font-black">Something went wrong</h1>
      <p className="mt-3 max-w-md text-neutral-400">
        An unexpected error occurred. You can try again, or head back home.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button onClick={reset}>Try again</Button>
        <Link href="/" className={buttonVariants({ variant: "secondary" })}>
          Home
        </Link>
      </div>
    </main>
  );
}
