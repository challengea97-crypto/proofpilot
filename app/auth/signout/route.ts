import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";

/** Signs the user out and returns them to the login page. */
export async function POST(request: Request) {
  const { origin } = new URL(request.url);

  if (isSupabaseConfigured()) {
    const supabase = await createServerSupabase();
    await supabase.auth.signOut();
  }

  // 303 so the browser issues a GET to the login page after the POST.
  return NextResponse.redirect(`${origin}/login`, { status: 303 });
}
