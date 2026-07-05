import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { PRICE_IDS, type PlanKey } from "@/lib/pricing";
import { getOptionalUser } from "@/lib/auth";
import { getSiteUrl } from "@/lib/env";

export async function POST(request: NextRequest) {
  try {
    const { plan } = (await request.json()) as { plan?: PlanKey };

    if (!plan || !(plan in PRICE_IDS)) {
      return NextResponse.json({ error: "Invalid plan." }, { status: 400 });
    }

    // Purchases are tied to a signed-in user so the webhook can grant access.
    const user = await getOptionalUser();
    if (!user) {
      return NextResponse.json(
        { error: "Please sign in to continue.", requiresAuth: true },
        { status: 401 }
      );
    }

    const siteUrl = getSiteUrl();
    const stripe = getStripe();
    const price = PRICE_IDS[plan];
    const mode: "payment" | "subscription" = plan === "founderReport" ? "payment" : "subscription";

    const session = await stripe.checkout.sessions.create({
      mode,
      line_items: [{ price, quantity: 1 }],
      success_url: `${siteUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/cancel`,
      allow_promotion_codes: true,
      client_reference_id: user.id,
      customer_email: user.email ?? undefined,
      metadata: { plan, user_id: user.id },
      ...(mode === "subscription"
        ? { subscription_data: { metadata: { plan, user_id: user.id } } }
        : {}),
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Checkout failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
