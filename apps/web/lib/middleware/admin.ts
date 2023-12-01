import { PHUNQ_ADMIN_ID } from "@phunq/utils";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

import { parse } from "@/lib/middleware/utils";

import { conn } from "../planetscale";
import { UserProps } from "../types";

export default async function AdminMiddleware(req: NextRequest) {
  const { path } = parse(req);
  let isAdmin = false;

  const session = (await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })) as {
    id?: string;
    email?: string;
    user?: UserProps;
  };

  const response = await conn
    ?.execute("SELECT workspaceId FROM WorkspaceUsers WHERE userId = ?", [
      session?.user?.id,
    ])
    .then((res) => res.rows[0] as { workspaceId: string } | undefined);

  if (response?.workspaceId === PHUNQ_ADMIN_ID) {
    isAdmin = true;
  }

  if (path === "/login" && isAdmin) {
    console.log("middleware/admin.ts: path === /login && isAdmin");
    return NextResponse.redirect(new URL("/", req.url));
  } else if (path !== "/login" && !isAdmin) {
    console.log("middleware/admin.ts: path !== /login && !isAdmin");
    return NextResponse.redirect(new URL(`/login`, req.url));
  }

  console.log("middleware/admin.ts: return NextResponse.rewrite");
  return NextResponse.rewrite(
    new URL(`/admin.rivvi.io${path === "/" ? "" : path}`, req.url),
  );
}
