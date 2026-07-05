import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { createServiceSupabase } from "@/lib/supabase/server";
import type { Json } from "@/lib/supabase/types";

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

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as any;
      await supabase.from("billing_events").insert({
        stripe_event_id: event.id,
        event_type: event.type,
        customer_id: session.customer || null,
        subscription_id: session.subscription || null,
        checkout_session_id: session.id,
        plan: session.metadata?.plan || null,
        status: "completed",
        raw: event as unknown as Json
      });
    }

    if (
      event.type === "customer.subscription.created" ||
      event.type === "customer.subscription.updated" ||
      event.type === "customer.subscription.deleted" ||
      event.type === "invoice.payment_failed"
    ) {
      await supabase.from("billing_events").insert({
        stripe_event_id: event.id,
        event_type: event.type,
        customer_id: (event.data.object as any).customer || null,
        subscription_id: (event.data.object as any).id || null,
        status: (event.data.object as any).status || event.type,
        raw: event as unknown as Json
      });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Webhook failed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
