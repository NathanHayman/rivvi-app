import { NextResponse } from "next/server";

import { inviteUser } from "@/lib/api/users";
import { withAuth } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET /api/workspaces/[slug]/invites – get invites for a specific workspace
export const GET = withAuth(async ({ workspace }) => {
  const invites = await prisma.workspaceInvite.findMany({
    where: {
      workspaceId: workspace.id,
    },
    select: {
      email: true,
      createdAt: true,
    },
  });
  return NextResponse.json(invites);
});

// POST /api/workspaces/[slug]/invites – invite a teammate
export const POST = withAuth(
  async ({ req, workspace, session }) => {
    const { email } = await req.json();
    const alreadyInTeam = await prisma.workspaceUser.findFirst({
      where: {
        workspaceId: workspace.id,
        user: {
          email,
        },
      },
    });
    if (alreadyInTeam) {
      return new Response("User already exists in this workspace.", {
        status: 400,
      });
    }

    if (workspace.plan === "free") {
      const users = await prisma.workspaceUser.count({
        where: {
          workspaceId: workspace.id,
        },
      });
      const invites = await prisma.workspaceInvite.count({
        where: {
          workspaceId: workspace.id,
        },
      });
      if (users + invites >= 3) {
        return new Response(
          "You've reached the maximum number of users for the free plan.",
          {
            status: 400,
          },
        );
      }
    }

    try {
      await inviteUser({
        email,
        workspace,
        session,
      });
      return NextResponse.json({ message: "Invite sent" });
    } catch (error) {
      return new Response(error.message, {
        status: 400,
      });
    }
  },
  {
    requiredRole: ["OWNER"],
  },
);

// DELETE /api/workspaces/[slug]/invites – delete a pending invite
export const DELETE = withAuth(
  async ({ searchParams, workspace }) => {
    const { email } = searchParams;
    if (!email) {
      return new Response("Missing email", {
        status: 400,
      });
    }
    const response = await prisma.workspaceInvite.delete({
      where: {
        email_workspaceId: {
          email,
          workspaceId: workspace.id,
        },
      },
    });
    return NextResponse.json(response);
  },
  {
    requiredRole: ["OWNER"],
  },
);
