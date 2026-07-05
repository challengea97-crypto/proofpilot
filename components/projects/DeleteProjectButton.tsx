"use client";

import { Trash2 } from "lucide-react";
import { deleteProjectAction } from "@/app/dashboard/projects/actions";
import { Button } from "@/components/ui/Button";

export function DeleteProjectButton({ id }: { id: string }) {
  return (
    <form
      action={deleteProjectAction}
      onSubmit={(event) => {
        if (!window.confirm("Delete this project? This cannot be undone.")) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <Button type="submit" variant="danger" size="sm">
        <Trash2 className="h-4 w-4" aria-hidden />
        Delete
      </Button>
    </form>
  );
}
