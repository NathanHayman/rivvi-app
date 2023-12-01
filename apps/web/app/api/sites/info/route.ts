import { NextResponse } from "next/server";

import { withAuth } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET /api/workspaces/[workspaceSlug]/sites/info – get the info for a site
export const GET = withAuth(async ({ headers, searchParams }) => {
  const { domain, key } = searchParams;
  const response = await prisma.site.findUnique({
    where: {
      domain_key: {
        domain: domain || "rivvi.app",
        key,
      },
    },
    include: {
      workspace: true,
    },
  });
  return NextResponse.json(response, {
    headers,
  });
});
