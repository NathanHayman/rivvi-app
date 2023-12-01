import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

import { parse } from "@/lib/middleware/utils";

import { conn } from "../planetscale";
import { UserProps } from "../types";

export default async function AppMiddleware(req: NextRequest) {
  const { path, fullPath } = parse(req);
  const session = (await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })) as {
    email?: string;
    user?: UserProps;
  };
  // if there's no session and the path isn't /login or /register, redirect to /login
  if (!session?.email && path !== "/login" && path !== "/register") {
    console.log(
      "middleware/app.ts: !session?.email && path !== /login && path !== /register",
    );
    return NextResponse.redirect(
      new URL(
        `/login${path !== "/" ? `?next=${encodeURIComponent(path)}` : ""}`,
        req.url,
      ),
    );

    // if there's a session
  } else if (session?.email) {
    // if the user was created in the last 10s
    // (this is a workaround because the `isNewUser` flag is triggered when a user does `dangerousEmailAccountLinking`)
    if (
      session?.user?.createdAt &&
      new Date(session?.user?.createdAt).getTime() > Date.now() - 10000 &&
      path === "/"
    ) {
      // check if the user has an existing workspace invite, if yes, we skip the onboarding flow
      const [existingInvite, existingWorkspace] = [
        await conn
          ?.execute("SELECT workspaceId FROM WorkspaceInvite WHERE email = ?", [
            session.email,
          ])
          .then((res) => res.rows[0] as { workspaceId: string } | undefined),
        await conn
          ?.execute("SELECT workspaceId FROM WorkspaceUser WHERE userId = ?", [
            session.user.id,
          ])
          .then((res) => res.rows[0] as { workspaceId: string } | undefined),
      ];

      // if there's an existing invite or there's an existing workspace
      if (existingInvite || existingWorkspace) {
        // get the workspace slug
        const workspace = await conn
          ?.execute("SELECT slug from Workspace WHERE id = ?", [
            existingInvite
              ? existingInvite.workspaceId
              : existingWorkspace?.workspaceId,
          ])
          .then((res) => res.rows[0] as { slug: string } | undefined);

        // redirect them to the workspace slug
        if (workspace?.slug) {
          console.log("middleware/app.ts: workspace?.slug");

          return NextResponse.redirect(new URL(workspace.slug, req.url));
        } else {
          console.log("middleware/app.ts: !workspace?.slug");

          // if there's no workspace slug, redirect to "/"
          return NextResponse.redirect(new URL("/", req.url));
        }
      } else {
        console.log("middleware/app.ts: !existingInvite");

        // if there's no existing invite, redirect to /welcome flow
        return NextResponse.redirect(new URL("/onboarding", req.url));
      }

      // if the path is /login or /register, redirect to "/"
    } else if (path === "/login" || path === "/register") {
      console.log("middleware/app.ts: path === /login || /register");

      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // otherwise, rewrite the path to /app/page
  console.log("middleware/app.ts: rewrite");
  return NextResponse.rewrite(
    new URL(`/app.rivvi.io${fullPath === "/" ? "" : fullPath}`, req.url),
  );
}
