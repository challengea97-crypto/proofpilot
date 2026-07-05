import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import { createServiceSupabase } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function hashContent(input: string): string {
  return createHash("sha256").update(input).digest("hex");
}

/**
 * Checks watchlist URLs for changes and creates notifications. Protected by a
 * shared secret (CRON_SECRET) so only the scheduled job can trigger it.
 */
export async function POST(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "CRON_SECRET is not set." }, { status: 503 });
  }
  if (request.headers.get("x-cron-secret") !== secret) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  if (!isSupabaseConfigured() || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: "Supabase service role not configured." }, { status: 503 });
  }

  const supabase = createServiceSupabase();
  const { data: items, error } = await supabase
    .from("watchlist_items")
    .select("*")
    .not("url", "is", null)
    .limit(200);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  let checked = 0;
  let changed = 0;

  for (const item of items ?? []) {
    if (!item.url) continue;
    checked += 1;
    try {
      const response = await fetch(item.url, {
        redirect: "follow",
        headers: { "user-agent": "TeckroMonitor/1.0" },
        signal: AbortSignal.timeout(10_000),
      });
      const hash = hashContent(await response.text());
      const didChange = Boolean(item.last_hash) && item.last_hash !== hash;

      await supabase
        .from("watchlist_items")
        .update({ last_hash: hash, last_checked_at: new Date().toISOString() })
        .eq("id", item.id);

      if (didChange) {
        changed += 1;
        await supabase.from("notifications").insert({
          user_id: item.user_id,
          project_id: item.project_id,
          title: "Watchlist change detected",
          body: `“${item.label}” changed since the last check.`,
          url: item.project_id ? `/dashboard/projects/${item.project_id}` : null,
        });
      }
    } catch {
      // Skip unreachable/slow URLs; try again next run.
    }
  }

  return NextResponse.json({ ok: true, checked, changed });
}
