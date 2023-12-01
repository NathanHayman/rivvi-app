import { NextResponse } from "next/server";

import { withAuth } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET /api/workspaces/[slug]/users – get users for a specific workspace
export const GET = withAuth(async ({ workspace }) => {
  const users = await prisma.workspaceUser.findMany({
    where: {
      workspaceId: workspace.id,
    },
    select: {
      role: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
      createdAt: true,
    },
  });
  return NextResponse.json(
    users.map((u) => ({
      ...u.user,
      role: u.role,
    })),
  );
});

// PUT /api/workspaces/[slug]/users – update a user's role for a specific workspace
export const PUT = withAuth(
  async ({ req, workspace }) => {
    const { userId, role } = await req.json();
    if (!userId || !role) {
      return new Response("Missing userId or role", { status: 400 });
    }
    const response = await prisma.workspaceUser.update({
      where: {
        userId_workspaceId: {
          workspaceId: workspace.id,
          userId,
        },
      },
      data: {
        role,
      },
    });
    return NextResponse.json(response);
  },
  {
    requiredRole: ["OWNER"],
  },
);

// DELETE /api/workspaces/[slug]/users – remove a user from a workspace

export const DELETE = withAuth(
  async ({ searchParams, workspace }) => {
    const { userId } = searchParams;
    if (!userId) {
      return new Response("Missing userId", { status: 400 });
    }
    const workspaceUser = await prisma.workspaceUser.findUnique({
      where: {
        userId_workspaceId: {
          workspaceId: workspace.id,
          userId,
        },
      },
      select: {
        role: true,
      },
    });
    if (workspaceUser?.role === "OWNER") {
      return new Response(
        "Cannot remove OWNER from workspace. Please transfer ownership to another user first.",
        { status: 400 },
      );
    }
    const response = await prisma.workspaceUser.delete({
      where: {
        userId_workspaceId: {
          workspaceId: workspace.id,
          userId,
        },
      },
    });
    return NextResponse.json(response);
  },
  {
    requiredRole: ["OWNER"],
  },
);
