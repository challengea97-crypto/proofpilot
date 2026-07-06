"use server";

import { z } from "zod";
import { createServerSupabase, createServiceSupabase } from "@/lib/supabase/server";
import { isSupabaseConfigured, getAdminEmails } from "@/lib/env";

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

/** Notify admin accounts (ADMIN_EMAILS) in-app about a new message. Best-effort. */
async function notifyAdmins(name: string, email: string): Promise<void> {
  try {
    const adminEmails = getAdminEmails();
    if (adminEmails.length === 0 || !process.env.SUPABASE_SERVICE_ROLE_KEY) return;
    const service = createServiceSupabase();
    const { data: admins } = await service
      .from("profiles")
      .select("id, email")
      .in("email", adminEmails);
    for (const admin of admins ?? []) {
      await service.from("notifications").insert({
        user_id: admin.id,
        title: "New contact message",
        body: `${name} (${email}) sent a message. View it in Supabase → contact_messages.`,
      });
    }
  } catch {
    // Never fail the submission because notification delivery hiccuped.
  }
}

export async function submitContactAction(
  _prev: ContactState,
  formData: FormData
): Promise<ContactState> {
  // Honeypot: bots fill every field. Real users never see this one.
  if (String(formData.get("website") ?? "").trim() !== "") {
    return { ok: true }; // pretend success; drop silently
  }

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

  await notifyAdmins(parsed.data.name, parsed.data.email);

  return { ok: true };
}
