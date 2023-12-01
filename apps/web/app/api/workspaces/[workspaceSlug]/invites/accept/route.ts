import { NextResponse } from "next/server";

import { withSession } from "@/lib/auth";
import prisma from "@/lib/prisma";

// POST /api/workspaces/[slug]/invites/accept – accept a workspace invite
export const POST = withSession(async ({ session, params }) => {
  const invite = await prisma.workspaceInvite.findFirst({
    where: {
      email: session.user.email,
      workspace: {
        slug: params.slug,
      },
    },
    select: {
      expires: true,
      workspaceId: true,
    },
  });
  if (!invite) {
    return new Response("Invalid invite", { status: 404 });
  } else if (invite.expires < new Date()) {
    return new Response("Invite expired", { status: 410 });
  } else {
    const response = await Promise.all([
      prisma.workspaceUser.create({
        data: {
          userId: session.user.id,
          role: "MEMBER",
          workspaceId: invite.workspaceId,
        },
      }),
      prisma.workspaceInvite.delete({
        where: {
          email_workspaceId: {
            email: session.user.email,
            workspaceId: invite.workspaceId,
          },
        },
      }),
    ]);
    return NextResponse.json(response);
  }
});
