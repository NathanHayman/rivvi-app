import { NextResponse } from "next/server";

import { deleteWorkspace } from "@/lib/api/workspace";
import { withAuth } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET /api/workspaces/[workspaceSlug] – get a specific workspace
export const GET = withAuth(async ({ workspace }) => {
  return NextResponse.json(workspace);
});

// PUT /api/workspaces/[workspaceSlug] – update a specific workspace
export const PUT = withAuth(
  async ({ req, workspace }) => {
    const { name, slug } = await req.json();
    try {
      const response = await prisma.workspace.update({
        where: {
          slug: workspace.slug,
        },
        data: {
          ...(name && { name }),
          ...(slug && { slug }),
        },
      });
      return NextResponse.json(response);
    } catch (error) {
      if (error.code === "P2002") {
        return new Response("workspace slug already exists.", { status: 422 });
      }
      return new Response(error.message, { status: 500 });
    }
  },
  {
    requiredRole: ["OWNER"],
  },
);

// DELETE /api/workspaces/[workspaceSlug] – delete a specific workspace
export const DELETE = withAuth(
  async ({ workspace }) => {
    const response = await deleteWorkspace(workspace);
    return NextResponse.json(response);
  },
  {
    requiredRole: ["OWNER"],
  },
);
