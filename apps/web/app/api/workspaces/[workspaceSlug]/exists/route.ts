import { NextResponse } from "next/server";

import { withSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET /api/workspaces/[workspaceSlug]/exists – check if a workspace exists
export const GET = withSession(async ({ params }) => {
  const { workspaceSlug } = params;
  const workspace = await prisma.workspace.findUnique({
    where: {
      slug: workspaceSlug as string,
    },
    select: {
      slug: true,
    },
  });
  if (workspace) {
    return NextResponse.json(1);
  } else {
    return NextResponse.json(0);
  }
});
