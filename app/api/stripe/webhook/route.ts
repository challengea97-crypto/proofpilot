import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { createServiceSupabase } from "@/lib/supabase/server";
import { planFromPriceId } from "@/lib/pricing";
import type { Json } from "@/lib/supabase/types";

type ServiceClient = ReturnType<typeof createServiceSupabase>;

/** Reflect a Stripe event onto the user's profile (plan + customer id). */
async function syncProfile(supabase: ServiceClient, event: Stripe.Event) {
  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.user_id ?? session.client_reference_id ?? null;
      if (!userId) return;
      await supabase
        .from("profiles")
        .update({
          plan: session.metadata?.plan ?? "free",
          stripe_customer_id: typeof session.customer === "string" ? session.customer : null,
        })
        .eq("id", userId);
      return;
    }

    if (
      event.type === "customer.subscription.created" ||
      event.type === "customer.subscription.updated" ||
      event.type === "customer.subscription.deleted"
    ) {
      const subscription = event.data.object as Stripe.Subscription;
      const userId = subscription.metadata?.user_id ?? null;
      if (!userId) return;

      if (event.type === "customer.subscription.deleted" || subscription.status !== "active") {
        await supabase.from("profiles").update({ plan: "free" }).eq("id", userId);
        return;
      }

      const priceId = subscription.items.data[0]?.price?.id;
      const plan = priceId ? planFromPriceId(priceId) : null;
      if (plan) {
        await supabase
          .from("profiles")
          .update({
            plan,
            stripe_customer_id:
              typeof subscription.customer === "string" ? subscription.customer : null,
          })
          .eq("id", userId);
      }
    }
  } catch {
    // Never fail the webhook because of a profile-sync hiccup; Stripe retries.
  }
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

    // Audit log (best-effort).
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
      // Ignore duplicate/insert errors — the sync below is what grants access.
    }

    await syncProfile(supabase, event);

    return NextResponse.json({ received: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Webhook failed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
