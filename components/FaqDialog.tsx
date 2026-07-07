"use client";

import { useMemo, useState } from "react";
import { HelpCircle, X, Search } from "lucide-react";
import { FAQ_CATEGORIES, ALL_FAQS } from "@/lib/faq";

/** Floating help button + searchable FAQ modal, available on every page. */
export function FaqDialog() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<string>("All");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    let items =
      cat === "All" ? ALL_FAQS : FAQ_CATEGORIES.find((c) => c.category === cat)?.items ?? [];
    if (q) items = items.filter((it) => `${it.q} ${it.a}`.toLowerCase().includes(q));
    return items;
  }, [query, cat]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open help and FAQ"
        className="no-print fixed bottom-5 right-5 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-white text-neutral-950 shadow-glow transition hover:scale-105"
      >
        <HelpCircle className="h-6 w-6" aria-hidden />
      </button>

      {open && (
        <div
          className="no-print fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label="Frequently asked questions"
          onClick={() => setOpen(false)}
        >
          <div
            className="flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl border border-neutral-800 bg-neutral-950 sm:rounded-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-neutral-800 p-5">
              <h2 className="text-lg font-black">How can we help?</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="rounded-full p-2 text-neutral-400 transition hover:bg-neutral-900 hover:text-white"
              >
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>

            <div className="space-y-3 border-b border-neutral-800 p-5">
              <div className="relative">
                <Search
                  className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500"
                  aria-hidden
                />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search questions…"
                  aria-label="Search FAQ"
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-900 py-2.5 pl-11 pr-4 text-sm text-white placeholder:text-neutral-500 focus:border-neutral-600 focus:outline-none"
                />
              </div>
              <div className="no-scrollbar flex gap-2 overflow-x-auto">
                {["All", ...FAQ_CATEGORIES.map((c) => c.category)].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCat(c)}
                    className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                      cat === c ? "bg-white text-neutral-950" : "bg-neutral-900 text-neutral-400 hover:text-white"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              {results.length === 0 ? (
                <p className="py-10 text-center text-sm text-neutral-500">
                  No questions match “{query}”.
                </p>
              ) : (
                <div className="space-y-2">
                  {results.map((it) => (
                    <details
                      key={it.q}
                      className="group rounded-2xl border border-neutral-800 bg-neutral-900/50 p-4"
                    >
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-semibold text-white">
                        {it.q}
                        <span
                          className="text-lg leading-none text-neutral-500 transition-transform group-open:rotate-45"
                          aria-hidden
                        >
                          +
                        </span>
                      </summary>
                      <p className="mt-2 text-sm leading-6 text-neutral-400">{it.a}</p>
                    </details>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
