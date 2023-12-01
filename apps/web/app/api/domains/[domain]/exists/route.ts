import { NextResponse } from "next/server";

import { domainExists } from "@/lib/api/domains";
import { withSession } from "@/lib/auth";
import { HOME_DOMAIN } from "@phunq/utils";

// GET /api/domains/[domain]/exists – check if a domain exists
export const GET = withSession(async ({ params }) => {
  const { domain } = params;

  // This is used for project creation only, if you add a domain within an existing project,
  // use the /api/workspaces/[workspaceSlug]/domains/[domain]/exists endpoint instead

  // if the url is "home.localhost:8888 or rivvi.io, then return 1"
  if (domain === HOME_DOMAIN) {
    return NextResponse.json(1);
  }
  const exists = await domainExists(domain);
  if (exists) {
    return NextResponse.json(1);
  } else {
    return NextResponse.json(0);
  }
});
