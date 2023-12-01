import { NextResponse } from "next/server";

import { withAuth } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET /api/me - get the current user
export const GET = withAuth(async ({ session }) => {
  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
  });
  return NextResponse.json(user);
});
