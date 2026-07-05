import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  /*
   * Only the authenticated app area needs session refresh + protection.
   * Marketing pages skip the auth round-trip entirely (much faster nav);
   * the browser client and /auth/callback keep tokens fresh elsewhere.
   */
  matcher: ["/dashboard/:path*"],
};
