"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { UserPlus, Trash2, Users } from "lucide-react";
import {
  addMemberAction,
  removeMemberAction,
  type TeamActionState,
} from "@/app/dashboard/projects/[id]/team-actions";
import { Input, Label } from "@/components/ui/form";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { EmptyState } from "@/components/ui/EmptyState";
import { timeAgo } from "@/lib/utils";
import type { ProjectMemberRow } from "@/lib/supabase/types";

const initialState: TeamActionState = {};

function InviteButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" loading={pending} className="sm:mb-0.5">
      <UserPlus className="h-4 w-4" aria-hidden />
      Invite
    </Button>
  );
}

export function TeamPanel({
  projectId,
  members,
  isOwner,
}: {
  projectId: string;
  members: ProjectMemberRow[];
  isOwner: boolean;
}) {
  const action = addMemberAction.bind(null, projectId);
  const [state, formAction] = useActionState(action, initialState);

  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-lg font-bold">Team</h2>
        <p className="text-sm text-neutral-400">
          {isOwner
            ? "Invite collaborators by email. They get read access to this project — research, analyses, watchlist and the report."
            : "This project was shared with you. You can view everything; only the owner can run analyses or make changes."}
        </p>
      </div>

      {isOwner && (
        <>
          <form action={formAction} className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
            <div>
              <Label htmlFor="member-email">Teammate&apos;s email</Label>
              <Input
                id="member-email"
                name="email"
                type="email"
                required
                placeholder="teammate@company.com"
                maxLength={200}
              />
            </div>
            <InviteButton />
          </form>
          {state.error && <Alert tone="error">{state.error}</Alert>}
          {state.ok && (
            <Alert tone="success">
              Invited. When they sign in to Teckro with that email, this project appears under
              “Shared with you”.
            </Alert>
          )}
        </>
      )}

      {members.length === 0 ? (
        isOwner ? (
          <EmptyState
            icon={Users}
            title="No teammates yet"
            description="Invite someone by email to give them read access to this project."
          />
        ) : null
      ) : (
        <ul className="space-y-2">
          {members.map((member) => (
            <li
              key={member.id}
              className="flex items-center justify-between gap-3 rounded-2xl border border-neutral-800 bg-neutral-900/60 px-4 py-3"
            >
              <div className="min-w-0">
                <p className="truncate font-medium text-white">{member.member_email}</p>
                <p className="text-xs text-neutral-500">
                  Viewer · added {timeAgo(member.created_at)}
                </p>
              </div>
              {isOwner && (
                <form action={removeMemberAction}>
                  <input type="hidden" name="id" value={member.id} />
                  <input type="hidden" name="projectId" value={projectId} />
                  <button
                    type="submit"
                    aria-label={`Remove ${member.member_email}`}
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
    </section>
  );
}
