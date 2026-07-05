"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { createProjectAction, type ProjectFormState } from "@/app/dashboard/projects/actions";
import { Input, Textarea, Label, FieldError } from "@/components/ui/form";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";

const initialState: ProjectFormState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" loading={pending}>
      Create project
    </Button>
  );
}

export function NewProjectForm() {
  const [state, formAction] = useActionState(createProjectAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      {state.error && <Alert tone="error">{state.error}</Alert>}

      <div>
        <Label htmlFor="name">Project name</Label>
        <Input id="name" name="name" required placeholder="e.g. ProofPilot" maxLength={120} />
        <FieldError>{state.fieldErrors?.name}</FieldError>
      </div>

      <div>
        <Label htmlFor="idea">Idea</Label>
        <Textarea
          id="idea"
          name="idea"
          required
          placeholder="What are you building, and for whom?"
        />
        <FieldError>{state.fieldErrors?.idea}</FieldError>
      </div>

      <div>
        <Label htmlFor="audience">Target audience (optional)</Label>
        <Input id="audience" name="audience" placeholder="e.g. solo founders and small teams" />
        <FieldError>{state.fieldErrors?.audience}</FieldError>
      </div>

      <div>
        <Label htmlFor="problem">Problem it solves (optional)</Label>
        <Textarea
          id="problem"
          name="problem"
          placeholder="What painful problem does this remove?"
        />
        <FieldError>{state.fieldErrors?.problem}</FieldError>
      </div>

      <SubmitButton />
    </form>
  );
}
