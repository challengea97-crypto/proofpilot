"use client";

import { useState } from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Wand2 } from "lucide-react";
import { createProjectAction, type ProjectFormState } from "@/app/dashboard/projects/actions";
import { Input, Textarea, Label, FieldError } from "@/components/ui/form";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";

const initialState: ProjectFormState = {};

const EXAMPLE = {
  name: "PetPal",
  idea: "A mobile app that connects pet owners with vetted local pet sitters for same-day bookings.",
  audience: "urban pet owners aged 25-45",
  problem: "Finding a trustworthy pet sitter at short notice is stressful and slow.",
};

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
  const [fields, setFields] = useState({ name: "", idea: "", audience: "", problem: "" });

  const set = (key: keyof typeof fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFields((f) => ({ ...f, [key]: e.target.value }));

  return (
    <form action={formAction} className="space-y-4">
      {state.error && <Alert tone="error">{state.error}</Alert>}

      <div>
        <Label htmlFor="name">Project name</Label>
        <Input
          id="name"
          name="name"
          required
          placeholder="e.g. Teckro"
          maxLength={120}
          value={fields.name}
          onChange={set("name")}
        />
        <FieldError>{state.fieldErrors?.name}</FieldError>
      </div>

      <div>
        <Label htmlFor="idea">Idea</Label>
        <Textarea
          id="idea"
          name="idea"
          required
          placeholder="What are you building, and for whom?"
          value={fields.idea}
          onChange={set("idea")}
        />
        <FieldError>{state.fieldErrors?.idea}</FieldError>
      </div>

      <div>
        <Label htmlFor="audience">Target audience (optional)</Label>
        <Input
          id="audience"
          name="audience"
          placeholder="e.g. solo founders and small teams"
          value={fields.audience}
          onChange={set("audience")}
        />
        <FieldError>{state.fieldErrors?.audience}</FieldError>
      </div>

      <div>
        <Label htmlFor="problem">Problem it solves (optional)</Label>
        <Textarea
          id="problem"
          name="problem"
          placeholder="What painful problem does this remove?"
          value={fields.problem}
          onChange={set("problem")}
        />
        <FieldError>{state.fieldErrors?.problem}</FieldError>
      </div>

      <SubmitButton />

      <button
        type="button"
        onClick={() => setFields(EXAMPLE)}
        className="mx-auto flex items-center gap-1.5 text-sm text-neutral-500 transition hover:text-white"
      >
        <Wand2 className="h-4 w-4" aria-hidden />
        Fill with an example idea
      </button>
    </form>
  );
}
