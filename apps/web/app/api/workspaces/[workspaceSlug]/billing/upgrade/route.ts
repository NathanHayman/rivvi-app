import { APP_DOMAIN } from "@phunq/utils";
import { NextResponse } from "next/server";

import { withAuth } from "@/lib/auth";
import { stripe } from "@/lib/stripe";

export const POST = withAuth(async ({ searchParams, workspace, session }) => {
  const { priceId } = searchParams;

  if (!priceId) {
    return new Response("Missing price ID", { status: 400 });
  }

  if (!workspace) {
    return new Response("Workspace not found", { status: 404 });
  }

  const stripeSession = await stripe.checkout.sessions.create({
    customer_email: session.user.email,
    success_url: `${APP_DOMAIN}/${workspace.slug}/settings/billing?success=true`,
    cancel_url: `${APP_DOMAIN}/${workspace.slug}/settings/billing`,
    line_items: [{ price: priceId, quantity: 1 }],
    automatic_tax: {
      enabled: true,
    },
    tax_id_collection: {
      enabled: true,
    },
    mode: "subscription",
    allow_promotion_codes: true,
    client_reference_id: workspace.id,
  });
  return NextResponse.json(stripeSession);
});
