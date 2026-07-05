"use server";

import { z } from "zod";
import { createServerSupabase } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";

const schema = z.object({
  name: z.string().trim().min(1, "Your name is required").max(120),
  email: z.string().trim().email("Enter a valid email").max(200),
  message: z.string().trim().min(5, "Add a short message").max(4000),
});

export type ContactState = {
  error?: string;
  ok?: boolean;
  fieldErrors?: Partial<Record<"name" | "email" | "message", string>>;
};

export async function submitContactAction(
  _prev: ContactState,
  formData: FormData
): Promise<ContactState> {
  const parsed = schema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    const fieldErrors: ContactState["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof NonNullable<ContactState["fieldErrors"]>;
      if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { error: "Please fix the fields below.", fieldErrors };
  }

  if (!isSupabaseConfigured()) {
    return { error: "Messaging is temporarily unavailable. Please try again later." };
  }

  const supabase = await createServerSupabase();
  const { error } = await supabase.from("contact_messages").insert({
    name: parsed.data.name,
    email: parsed.data.email,
    message: parsed.data.message,
  });
  if (error) return { error: error.message };

  return { ok: true };
}
