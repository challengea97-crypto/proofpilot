import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import { createServiceSupabase } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import { assertPublicUrl } from "@/lib/url-guard";

const MAX_BODY_BYTES = 1_500_000;
const MAX_REDIRECTS = 3;

/**
 * SSRF-safe fetch: validates the URL (scheme + DNS resolves to public
 * addresses only), follows redirects manually re-validating every hop, and
 * caps how much of the body is read.
 */
async function fetchPublicText(rawUrl: string): Promise<{ status: number; text: string }> {
  let current = (await assertPublicUrl(rawUrl)).toString();

  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    const response = await fetch(current, {
      redirect: "manual",
      headers: { "user-agent": "TeckroMonitor/1.0" },
      signal: AbortSignal.timeout(10_000),
    });

    if ([301, 302, 303, 307, 308].includes(response.status)) {
      const location = response.headers.get("location");
      response.body?.cancel().catch(() => undefined);
      if (!location || hop === MAX_REDIRECTS) throw new Error("Too many redirects.");
      const next = new URL(location, current).toString();
      current = (await assertPublicUrl(next)).toString();
      continue;
    }

    if (!response.ok) {
      response.body?.cancel().catch(() => undefined);
      return { status: response.status, text: "" };
    }

    // Read at most MAX_BODY_BYTES.
    const reader = response.body?.getReader();
    if (!reader) return { status: response.status, text: "" };
    const chunks: Uint8Array[] = [];
    let received = 0;
    while (received < MAX_BODY_BYTES) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) {
        chunks.push(value);
        received += value.byteLength;
      }
    }
    await reader.cancel().catch(() => undefined);
    const text = Buffer.concat(chunks.map((c) => Buffer.from(c))).toString("utf8");
    return { status: response.status, text };
  }
  throw new Error("Too many redirects.");
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function hashContent(input: string): string {
  return createHash("sha256").update(input).digest("hex");
}

/**
 * Reduce an HTML document to comparable text so trivial markup churn (nonces,
 * CSRF tokens, asset hashes, attribute reordering) doesn't trigger false
 * change alerts — only meaningful visible-content changes do.
 */
function normalizeForComparison(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z#0-9]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
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
    const now = new Date().toISOString();
    try {
      const { status, text: rawText } = await fetchPublicText(item.url);

      if (status < 200 || status >= 300) {
        await supabase
          .from("watchlist_items")
          .update({ last_checked_at: now, last_status: `error: HTTP ${status}` })
          .eq("id", item.id);
        continue;
      }

      const text = normalizeForComparison(rawText);
      const hash = hashContent(text);
      const didChange = Boolean(item.last_hash) && item.last_hash !== hash;

      await supabase
        .from("watchlist_items")
        .update({ last_hash: hash, last_checked_at: now, last_status: "ok" })
        .eq("id", item.id);

      if (didChange) {
        changed += 1;
        await supabase.from("notifications").insert({
          user_id: item.user_id,
          project_id: item.project_id,
          title: "Watchlist change detected",
          body: `The visible content of “${item.label}” changed since the last check.`,
          url: item.project_id ? `/dashboard/projects/${item.project_id}` : null,
        });
      }
    } catch (err) {
      const reason =
        err instanceof Error && (err.name === "TimeoutError" || err.name === "AbortError")
          ? "error: timed out"
          : err instanceof Error && /private|internal|blocked|redirect/i.test(err.message)
            ? "error: blocked (non-public URL)"
            : "error: unreachable";
      await supabase
        .from("watchlist_items")
        .update({ last_checked_at: now, last_status: reason })
        .eq("id", item.id)
        .then(() => undefined, () => undefined);
    }
  }

  return NextResponse.json({ ok: true, checked, changed });
}
