import { NextResponse } from "next/server";

import { getRandomKey } from "@/lib/api/sites";
import { withAuth } from "@/lib/auth";

// GET /api/workspaces/[workspaceSlug]/sites/random – get a random available site key
export const GET = withAuth(async ({ headers, searchParams }) => {
  const { domain } = searchParams;
  const response = await getRandomKey(domain || "ruhe.app");
  return NextResponse.json(response, {
    headers,
  });
});
