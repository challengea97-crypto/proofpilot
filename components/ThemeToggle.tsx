"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

/** Light/dark toggle. Persists to localStorage; the no-flash script in the
 *  root layout applies the saved/system theme before first paint. */
export function ThemeToggle({ className }: { className?: string }) {
  const [light, setLight] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setLight(document.documentElement.classList.contains("light"));
    setMounted(true);
  }, []);

  function toggle() {
    const next = !light;
    setLight(next);
    document.documentElement.classList.toggle("light", next);
    try {
      localStorage.setItem("teckro-theme", next ? "light" : "dark");
    } catch {
      // ignore storage failures (private mode)
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={light ? "Switch to dark mode" : "Switch to light mode"}
      title={light ? "Switch to dark mode" : "Switch to light mode"}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-full text-neutral-300 transition hover:bg-neutral-900 hover:text-white",
        className
      )}
    >
      {/* Render nothing theme-specific until mounted to avoid hydration mismatch. */}
      {mounted && light ? (
        <Moon className="h-5 w-5" aria-hidden />
      ) : (
        <Sun className="h-5 w-5" aria-hidden />
      )}
    </button>
  );
}
