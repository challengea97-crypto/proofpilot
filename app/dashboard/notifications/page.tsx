import Link from "next/link";
import { Bell } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { listNotifications } from "@/lib/data/notifications";
import { EmptyState } from "@/components/ui/EmptyState";
import { MarkAllReadButton } from "@/components/notifications/MarkAllReadButton";
import { cn, timeAgo } from "@/lib/utils";
import type { NotificationRow } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Notifications",
};

function NotificationItem({ notification }: { notification: NotificationRow }) {
  const inner = (
    <div
      className={cn(
        "rounded-2xl border p-4 transition",
        notification.read
          ? "border-neutral-800 bg-neutral-950/40"
          : "border-neutral-700 bg-neutral-900/60"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-medium text-white">{notification.title}</p>
          {notification.body && (
            <p className="mt-1 text-sm text-neutral-400">{notification.body}</p>
          )}
        </div>
        {!notification.read && (
          <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-white" aria-label="Unread" />
        )}
      </div>
      <p className="mt-2 text-xs text-neutral-600">{timeAgo(notification.created_at)}</p>
    </div>
  );

  return notification.url ? (
    <Link href={notification.url} className="block">
      {inner}
    </Link>
  ) : (
    inner
  );
}

export default async function NotificationsPage() {
  const user = await requireUser();
  const notifications = await listNotifications(user.id);
  const hasUnread = notifications.some((n) => !n.read);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black sm:text-3xl">Notifications</h1>
          <p className="mt-1 text-neutral-400">Updates about your research, reports and watchlist.</p>
        </div>
        {hasUnread && <MarkAllReadButton />}
      </div>

      {notifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No notifications yet"
          description="Run research, generate a report, or add a watchlist item — updates show up here."
        />
      ) : (
        <ul className="space-y-2">
          {notifications.map((notification) => (
            <li key={notification.id}>
              <NotificationItem notification={notification} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
