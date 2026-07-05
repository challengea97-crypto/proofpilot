import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getOptionalUser, getProfile } from "@/lib/auth";
import { getSiteUrl } from "@/lib/env";

/** Opens the Stripe customer portal so the user can manage/cancel their plan. */
export async function POST() {
  try {
    const user = await getOptionalUser();
    if (!user) {
      return NextResponse.json({ error: "Please sign in." }, { status: 401 });
    }

    const profile = await getProfile(user);
    if (!profile?.stripe_customer_id) {
      return NextResponse.json(
        { error: "No billing account yet — make a purchase first." },
        { status: 400 }
      );
    }

    const stripe = getStripe();
    const session = await stripe.billingPortal.sessions.create({
      customer: profile.stripe_customer_id,
      return_url: `${getSiteUrl()}/dashboard/billing`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not open the billing portal.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
