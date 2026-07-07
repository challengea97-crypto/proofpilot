"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  LayoutDashboard,
  FolderKanban,
  Plus,
  FileText,
  Bell,
  CreditCard,
  Settings,
  type LucideIcon,
} from "lucide-react";

type Item = { label: string; href: string; icon: LucideIcon; keywords?: string };

const ITEMS: Item[] = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard, keywords: "home dashboard" },
  { label: "Projects", href: "/dashboard/projects", icon: FolderKanban },
  { label: "New project", href: "/dashboard/projects", icon: Plus, keywords: "create add idea" },
  { label: "Reports", href: "/dashboard/reports", icon: FileText },
  { label: "Notifications", href: "/dashboard/notifications", icon: Bell, keywords: "alerts" },
  { label: "Billing", href: "/dashboard/billing", icon: CreditCard, keywords: "plan upgrade subscription" },
  { label: "Settings", href: "/dashboard/settings", icon: Settings, keywords: "account profile theme" },
];

/** ⌘K / Ctrl-K command menu for fast navigation across the app. */
export function CommandMenu() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    }
    function onOpen() {
      setOpen(true);
    }
    window.addEventListener("keydown", onKey);
    window.addEventListener("open-command-menu", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("open-command-menu", onOpen);
    };
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ITEMS;
    return ITEMS.filter((i) => `${i.label} ${i.keywords ?? ""}`.toLowerCase().includes(q));
  }, [query]);

  useEffect(() => setActive(0), [query, open]);

  function run(item: Item) {
    setOpen(false);
    setQuery("");
    router.push(item.href);
  }

  if (!open) return null;

  return (
    <div
      className="no-print fixed inset-0 z-[60] flex items-start justify-center bg-black/60 p-4 pt-[15vh] backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Command menu"
      onClick={() => setOpen(false)}
    >
      <div
        className="w-full max-w-lg overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-950 shadow-glow"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-neutral-800 px-4">
          <Search className="h-4 w-4 shrink-0 text-neutral-500" aria-hidden />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setActive((a) => Math.min(a + 1, results.length - 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setActive((a) => Math.max(a - 1, 0));
              } else if (e.key === "Enter" && results[active]) {
                e.preventDefault();
                run(results[active]);
              }
            }}
            placeholder="Jump to…"
            aria-label="Search commands"
            className="w-full bg-transparent py-3.5 text-sm text-white placeholder:text-neutral-500 focus:outline-none"
          />
          <kbd className="shrink-0 rounded border border-neutral-700 px-1.5 py-0.5 text-[10px] text-neutral-500">
            ESC
          </kbd>
        </div>
        <ul className="max-h-72 overflow-y-auto p-2">
          {results.length === 0 ? (
            <li className="px-3 py-6 text-center text-sm text-neutral-500">No results</li>
          ) : (
            results.map((item, i) => {
              const Icon = item.icon;
              return (
                <li key={item.label}>
                  <button
                    type="button"
                    onClick={() => run(item)}
                    onMouseEnter={() => setActive(i)}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition ${
                      i === active ? "bg-neutral-900 text-white" : "text-neutral-300"
                    }`}
                  >
                    <Icon className="h-4 w-4 text-neutral-500" aria-hidden />
                    {item.label}
                  </button>
                </li>
              );
            })
          )}
        </ul>
      </div>
    </div>
  );
}
