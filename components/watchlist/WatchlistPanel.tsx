"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Plus, Trash2, ExternalLink, Bell } from "lucide-react";
import {
  addWatchItemAction,
  deleteWatchItemAction,
  type WatchFormState,
} from "@/app/dashboard/projects/[id]/watchlist-actions";
import { Input, Label, FieldError } from "@/components/ui/form";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { EmptyState } from "@/components/ui/EmptyState";
import type { WatchlistItemRow } from "@/lib/supabase/types";

const initialState: WatchFormState = {};

function AddButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" loading={pending} className="sm:mb-0.5">
      <Plus className="h-4 w-4" aria-hidden />
      Add
    </Button>
  );
}

export function WatchlistPanel({
  projectId,
  items,
  canEdit = true,
}: {
  projectId: string;
  items: WatchlistItemRow[];
  canEdit?: boolean;
}) {
  const action = addWatchItemAction.bind(null, projectId);
  const [state, formAction] = useActionState(action, initialState);

  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-lg font-bold">Watchlist</h2>
        <p className="text-sm text-neutral-400">
          Track competitors, keywords and pages you want to keep an eye on.
        </p>
      </div>

      {canEdit && (
        <>
          <form action={formAction} className="grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
            <div>
              <Label htmlFor="label">Label</Label>
              <Input id="label" name="label" required placeholder="e.g. Competitor X" maxLength={200} />
              <FieldError>{state.fieldErrors?.label}</FieldError>
            </div>
            <div>
              <Label htmlFor="url">URL (optional)</Label>
              <Input id="url" name="url" type="url" placeholder="https://…" />
              <FieldError>{state.fieldErrors?.url}</FieldError>
            </div>
            <AddButton />
          </form>

          {state.error && <Alert tone="error">{state.error}</Alert>}
        </>
      )}

      {items.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="Nothing on the watchlist"
          description="Add competitors or pages you want to keep an eye on."
        />
      ) : (
        <ul className="space-y-2">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between gap-3 rounded-2xl border border-neutral-800 bg-neutral-900/60 px-4 py-3"
            >
              <div className="min-w-0">
                <p className="truncate font-medium text-white">{item.label}</p>
                {item.url && (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex max-w-full items-center gap-1 truncate text-xs text-neutral-400 hover:text-white"
                  >
                    <span className="truncate">{item.url}</span>
                    <ExternalLink className="h-3 w-3 shrink-0" aria-hidden />
                  </a>
                )}
              </div>
              {canEdit && (
                <form action={deleteWatchItemAction}>
                  <input type="hidden" name="id" value={item.id} />
                  <input type="hidden" name="projectId" value={projectId} />
                  <button
                    type="submit"
                    aria-label={`Remove ${item.label}`}
                    className="rounded-full p-2 text-neutral-500 transition hover:bg-neutral-800 hover:text-red-300"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden />
                  </button>
                </form>
              )}
            </li>
          ))}
        </ul>
      )}

      <p className="text-xs text-neutral-600">
        Automated change-monitoring and alerts run on a schedule once background jobs are enabled
        (see docs/SETUP.md).
      </p>
    </section>
  );
}
