import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { createServiceSupabase } from "@/lib/supabase/server";
import { planFromPriceId, PRICE_IDS } from "@/lib/pricing";
import type { Json } from "@/lib/supabase/types";

type ServiceClient = ReturnType<typeof createServiceSupabase>;

/**
 * Reflect a Stripe event onto the user's profile (plan + customer id).
 * Returns false when an entitlement write FAILED (so the route can return a
 * 5xx and Stripe retries); returns true when synced or nothing to do.
 */
async function syncProfile(supabase: ServiceClient, event: Stripe.Event): Promise<boolean> {
  if (
    event.type === "checkout.session.completed" ||
    event.type === "checkout.session.async_payment_succeeded"
  ) {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.user_id ?? session.client_reference_id ?? null;
    if (!userId) return true;

    // Only grant once the money is actually there. Delayed payment methods
    // complete the session as "unpaid" and settle later via
    // checkout.session.async_payment_succeeded.
    if (session.payment_status !== "paid") return true;

    // Never write an unvalidated plan string from metadata.
    const plan = session.metadata?.plan;
    if (!plan || !(plan in PRICE_IDS)) return true;

    const { error } = await supabase.from("profiles").upsert(
      {
        id: userId,
        plan,
        stripe_customer_id: typeof session.customer === "string" ? session.customer : null,
      },
      { onConflict: "id" }
    );
    return !error;
  }

  if (
    event.type === "customer.subscription.created" ||
    event.type === "customer.subscription.updated" ||
    event.type === "customer.subscription.deleted"
  ) {
    const subscription = event.data.object as Stripe.Subscription;
    const userId = subscription.metadata?.user_id ?? null;
    if (!userId) return true;

    const activeStatuses = ["active", "trialing"];
    if (event.type === "customer.subscription.deleted" || !activeStatuses.includes(subscription.status)) {
      const { error } = await supabase
        .from("profiles")
        .upsert({ id: userId, plan: "free" }, { onConflict: "id" });
      return !error;
    }

    const priceId = subscription.items.data[0]?.price?.id;
    const plan = priceId ? planFromPriceId(priceId) : null;
    if (!plan) return true;

    const { error } = await supabase.from("profiles").upsert(
      {
        id: userId,
        plan,
        stripe_customer_id:
          typeof subscription.customer === "string" ? subscription.customer : null,
      },
      { onConflict: "id" }
    );
    return !error;
  }

  return true;
}

export async function POST(request: NextRequest) {
  const stripe = getStripe();
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: "Missing webhook signature or secret." }, { status: 400 });
  }

  const body = await request.text();

  try {
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    const supabase = createServiceSupabase();

    // Idempotency: skip events already fully processed (audit row exists).
    try {
      const { data: existing } = await supabase
        .from("billing_events")
        .select("id")
        .eq("stripe_event_id", event.id)
        .maybeSingle();
      if (existing) {
        return NextResponse.json({ received: true, duplicate: true });
      }
    } catch {
      // If the check fails, fall through — processing is idempotent anyway.
    }

    // Entitlement sync FIRST, and checked: if it fails, return 5xx so Stripe
    // retries the delivery (upserts make retries safe).
    const synced = await syncProfile(supabase, event);
    if (!synced) {
      return NextResponse.json(
        { error: "Entitlement sync failed; retry requested." },
        { status: 500 }
      );
    }

    // Audit log (best-effort) — written last so it doubles as the
    // "fully processed" idempotency marker.
    try {
      const object = event.data.object as unknown as Record<string, unknown>;
      await supabase.from("billing_events").insert({
        stripe_event_id: event.id,
        event_type: event.type,
        customer_id: (object.customer as string) ?? null,
        subscription_id:
          (object.subscription as string) ?? (object.id as string) ?? null,
        checkout_session_id: event.type.startsWith("checkout.") ? (object.id as string) : null,
        plan: ((object.metadata as Record<string, string>) ?? {}).plan ?? null,
        status: (object.status as string) ?? event.type,
        raw: event as unknown as Json,
      });
    } catch {
      // Ignore audit failures — entitlements are already synced.
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Webhook failed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
