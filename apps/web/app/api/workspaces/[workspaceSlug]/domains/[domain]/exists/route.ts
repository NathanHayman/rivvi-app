import { NextResponse } from "next/server";

import { domainExists } from "@/lib/api/domains";
import { withAuth } from "@/lib/auth";

// GET /api/workspaces/[workspaceSlug]/domains/[domain]/exists – check if a domain exists
export const GET = withAuth(async ({ domain, workspace }) => {
  const exists = await domainExists(domain);
  if (exists) {
    return NextResponse.json(1);
  } else {
    return NextResponse.json(0);
  }
});
