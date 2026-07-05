import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

/** Sign-out control backed by a POST form so it works without client JS. */
export function SignOutButton({ className }: { className?: string }) {
  return (
    <form action="/auth/signout" method="post">
      <button
        type="submit"
        className={cn(
          "flex w-full items-center gap-3 rounded-2xl px-4 py-2.5 text-sm font-medium text-neutral-400 transition hover:bg-neutral-900 hover:text-white",
          className
        )}
      >
        <LogOut className="h-5 w-5" aria-hidden />
        Sign out
      </button>
    </form>
  );
}
