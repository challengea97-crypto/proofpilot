"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  FileText,
  CreditCard,
  Bell,
  Settings,
  ShieldCheck,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { SignOutButton } from "@/components/app/SignOutButton";
import { planLabel } from "@/lib/pricing";

type NavItem = {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
};

const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/projects", label: "Projects", icon: FolderKanban },
  { href: "/dashboard/reports", label: "Reports", icon: FileText },
  { href: "/dashboard/notifications", label: "Notifications", icon: Bell },
  { href: "/dashboard/billing", label: "Billing", icon: CreditCard },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

function isActive(pathname: string, item: NavItem): boolean {
  if (item.exact) return pathname === item.href;
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

export function AppShell({
  userEmail,
  plan,
  unreadCount = 0,
  children,
}: {
  userEmail: string;
  plan: string;
  unreadCount?: number;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const nav = (
    <nav className="space-y-1" aria-label="Primary">
      {NAV_ITEMS.map((item) => {
        const active = isActive(pathname, item);
        const Icon = item.icon;
        const showBadge = item.href === "/dashboard/notifications" && unreadCount > 0;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center justify-between gap-3 rounded-2xl px-4 py-2.5 text-sm font-medium transition",
              active
                ? "bg-white text-neutral-950"
                : "text-neutral-400 hover:bg-neutral-900 hover:text-white"
            )}
          >
            <span className="flex items-center gap-3">
              <Icon className="h-5 w-5" aria-hidden />
              {item.label}
            </span>
            {showBadge && (
              <span className="rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );

  const brand = (
    <Link href="/dashboard" className="flex items-center gap-3 px-2" onClick={() => setOpen(false)}>
      <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-neutral-950">
        <ShieldCheck size={20} />
      </span>
      <span>
        <span className="block text-lg font-black leading-none">Teckro</span>
        <span className="mt-1 block text-xs text-neutral-500">Proof before build</span>
      </span>
    </Link>
  );

  const accountFooter = (
    <div className="border-t border-neutral-800 p-3">
      <div className="flex items-center justify-between gap-2 px-2 py-2">
        <span className="truncate text-xs text-neutral-500" title={userEmail}>
          {userEmail || "Signed in"}
        </span>
        <Badge tone={plan === "free" ? "neutral" : "accent"}>{planLabel(plan)}</Badge>
      </div>
      <SignOutButton />
    </div>
  );

  return (
    <div className="min-h-screen bg-ink lg:grid lg:grid-cols-[264px_1fr]">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen flex-col border-r border-neutral-800 bg-neutral-950/40 lg:flex no-print">
        <div className="p-4">{brand}</div>
        <div className="flex-1 overflow-y-auto px-3 py-2">{nav}</div>
        {accountFooter}
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 flex w-72 flex-col border-r border-neutral-800 bg-neutral-950">
            <div className="flex items-center justify-between p-4">
              {brand}
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="rounded-full p-2 text-neutral-400 hover:bg-neutral-900 hover:text-white"
              >
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-3 py-2">{nav}</div>
            {accountFooter}
          </div>
        </div>
      )}

      {/* Main column */}
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-neutral-800 bg-ink/80 px-4 py-3 backdrop-blur lg:hidden no-print">
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setOpen(true)}
            className="rounded-full p-2 text-neutral-300 hover:bg-neutral-900 hover:text-white"
          >
            <Menu className="h-5 w-5" aria-hidden />
          </button>
          <span className="text-base font-black">Teckro</span>
        </header>

        <main className="mx-auto w-full max-w-6xl flex-1 animate-fade-in px-4 py-8 sm:px-6 lg:px-10">
          {children}
        </main>
      </div>
    </div>
  );
}
