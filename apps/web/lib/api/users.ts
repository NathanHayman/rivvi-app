import { randomBytes } from "crypto";
import { sendEmail } from "emails";
import WorkspaceInvite from "emails/project-invite";

import { hashToken, Session } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { WorkspaceProps } from "@/lib/types";

export async function inviteUser({
  email,
  workspace,
  session,
}: {
  email: string;
  workspace: WorkspaceProps;
  session?: Session;
}) {
  // same method of generating a token as next-auth
  const token = randomBytes(32).toString("hex");
  const TWO_WEEKS_IN_SECONDS = 60 * 60 * 24 * 14;
  const expires = new Date(Date.now() + TWO_WEEKS_IN_SECONDS * 1000);

  // create a project invite record and a verification request token that lasts for a week
  // here we use a try catch to account for the case where the user has already been invited
  // for which `prisma.projectInvite.create()` will throw a unique constraint error
  try {
    await prisma.workspaceInvite.create({
      data: {
        email,
        expires,
        workspaceId: workspace.id,
      },
    });
  } catch (error) {
    if (error.code === "P2002") {
      throw new Error("User has already been invited to this workspace");
    }
  }

  await prisma.verificationToken.create({
    data: {
      identifier: email,
      token: hashToken(token),
      expires,
    },
  });

  const params = new URLSearchParams({
    callbackUrl: `${process.env.NEXTAUTH_URL}/${workspace.slug}`,
    email,
    token,
  });

  const url = `${process.env.NEXTAUTH_URL}/api/auth/callback/email?${params}`;

  return await sendEmail({
    subject: "You've been invited to join a workspace on Phunq",
    email,
    react: WorkspaceInvite({
      email,
      url,
      workspaceName: workspace.name,
      workspaceUser: session?.user.name || null,
      workspaceUserEmail: session?.user.email || null,
    }),
  });
}
