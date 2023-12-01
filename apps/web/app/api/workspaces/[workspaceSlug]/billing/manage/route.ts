import { APP_DOMAIN } from "@phunq/utils";
import { NextResponse } from "next/server";

import { withAuth } from "@/lib/auth";
import { stripe } from "@/lib/stripe";

// POST /api/workspaces/[slug]/billing/manage - create a Stripe billing portal session
export const POST = withAuth(async ({ workspace }) => {
  if (!workspace.stripeId) {
    return new Response("No Stripe customer ID", { status: 400 });
  }
  const { url } = await stripe.billingPortal.sessions.create({
    customer: workspace.stripeId,
    return_url: `${APP_DOMAIN}/${workspace.slug}/settings/billing`,
  });
  return NextResponse.json(url);
});
