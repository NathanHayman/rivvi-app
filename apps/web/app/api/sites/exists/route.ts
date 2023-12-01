import { NextResponse } from "next/server";

import { checkIfKeyExists } from "@/lib/api/sites";
import { withAuth } from "@/lib/auth";

// GET /api/workspaces/[workspaceSlug]/sites/exists – check if a site exists
export const GET = withAuth(async ({ headers, searchParams }) => {
  const { domain, key } = searchParams;
  const response = await checkIfKeyExists(domain as string, key as string);
  return NextResponse.json(response, {
    headers,
  });
});
