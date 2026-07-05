"use client";

import { markAllReadAction } from "@/app/dashboard/notifications/actions";
import { Button } from "@/components/ui/Button";

export function MarkAllReadButton() {
  return (
    <form action={markAllReadAction}>
      <Button type="submit" variant="secondary" size="sm">
        Mark all read
      </Button>
    </form>
  );
}
