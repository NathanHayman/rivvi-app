import { NextResponse } from "next/server";

import { archiveSite } from "@/lib/api/sites";
import { withAuth } from "@/lib/auth";

// POST /api/projects/[slug]/sites/[siteId]/archive – archive a site
export const POST = withAuth(async ({ headers, site }) => {
  const response = await archiveSite(
    site!.domain || "ruhe.app",
    site!.key as string,
    true,
  );
  return NextResponse.json(response, { headers });
});

// DELETE /api/projects/[slug]/sites/[siteId]/archive – unarchive a site
export const DELETE = withAuth(async ({ headers, site }) => {
  const response = await archiveSite(
    site!.domain || "ruhe.app",
    site!.key as string,
    false,
  );
  return NextResponse.json(response, { headers });
});
