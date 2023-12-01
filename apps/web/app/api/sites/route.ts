import { PHUNQ_ADMIN_ID } from "@phunq/utils";
import { NextResponse } from "next/server";

import { getSitesForWorkspace } from "@/lib/api/sites";
import { withAuth } from "@/lib/auth";

// GET /api/sites – get all user sites
export const GET = withAuth(
  async ({ headers, searchParams, workspace, session }) => {
    const { domain, sort, userId, showArchived } = searchParams as {
      domain?: string;
      search?: string;
      sort?: "createdAt";
      page?: string;
      userId?: string;
      showArchived?: string;
    };
    const response = await getSitesForWorkspace({
      workspaceId: workspace?.id || PHUNQ_ADMIN_ID,
      domain,
      sort,
      userId: workspace?.id ? userId : session.user.id,
      showArchived: showArchived === "true" ? true : false,
    });
    return NextResponse.json(response, {
      headers,
    });
  },
);
