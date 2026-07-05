// Netlify Scheduled Function: triggers the watchlist monitor daily.
// It calls the app's protected /api/cron/monitor endpoint with the shared secret.
// Requires the CRON_SECRET environment variable to be set in Netlify.

export const config = { schedule: "0 8 * * *" };

export default async () => {
  const base = process.env.URL ?? process.env.NEXT_PUBLIC_SITE_URL;
  const secret = process.env.CRON_SECRET;

  if (!base || !secret) {
    return new Response("Monitor not configured (set CRON_SECRET).", { status: 200 });
  }

  try {
    const response = await fetch(`${base}/api/cron/monitor`, {
      method: "POST",
      headers: { "x-cron-secret": secret },
    });
    return new Response(await response.text(), { status: response.status });
  } catch {
    return new Response("Monitor run failed.", { status: 200 });
  }
};
