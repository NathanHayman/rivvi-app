import { PHUNQ_ADMIN_ID } from "@phunq/utils";
import { NextResponse } from "next/server";

import { getSitesCount } from "@/lib/api/sites";
import { withAuth } from "@/lib/auth";

// GET /api/workspaces/[workspaceSlug]/sites/count – get the number of sites for a workspace
export const GET = withAuth(async ({ headers, searchParams, workspace }) => {
  const count = await getSitesCount({
    searchParams,
    workspaceId: workspace?.id || PHUNQ_ADMIN_ID,
  });
  return NextResponse.json(count, {
    headers,
  });
});
