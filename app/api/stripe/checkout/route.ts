import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { PRICE_IDS, type PlanKey } from "@/lib/pricing";

export async function POST(request: NextRequest) {
  try {
    const { plan } = (await request.json()) as { plan?: PlanKey };

    if (!plan || !(plan in PRICE_IDS)) {
      return NextResponse.json({ error: "Invalid plan." }, { status: 400 });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const stripe = getStripe();
    const price = PRICE_IDS[plan];
    const mode = plan === "founderReport" ? "payment" : "subscription";

    const session = await stripe.checkout.sessions.create({
      mode,
      line_items: [{ price, quantity: 1 }],
      success_url: `${siteUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/cancel`,
      allow_promotion_codes: true,
      metadata: { plan }
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Checkout failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
