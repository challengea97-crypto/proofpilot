"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { submitContactAction, type ContactState } from "@/app/contact/actions";
import { Input, Textarea, Label, FieldError } from "@/components/ui/form";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";

const initialState: ContactState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" loading={pending}>
      Send message
    </Button>
  );
}

export function ContactForm() {
  const [state, formAction] = useActionState(submitContactAction, initialState);

  if (state.ok) {
    return (
      <Alert tone="success" title="Message sent">
        Thanks — we&apos;ll get back to you soon.
      </Alert>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      {state.error && <Alert tone="error">{state.error}</Alert>}
      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" required maxLength={120} />
        <FieldError>{state.fieldErrors?.name}</FieldError>
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" autoComplete="email" required maxLength={200} />
        <FieldError>{state.fieldErrors?.email}</FieldError>
      </div>
      <div>
        <Label htmlFor="message">Message</Label>
        <Textarea id="message" name="message" required maxLength={4000} />
        <FieldError>{state.fieldErrors?.message}</FieldError>
      </div>
      <SubmitButton />
    </form>
  );
}
