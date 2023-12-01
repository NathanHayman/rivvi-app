import { NextFetchEvent, NextRequest, NextResponse } from "next/server";

import { parse } from "./utils";

export default async function RootMiddleware(
  req: NextRequest,
  ev: NextFetchEvent,
) {
  const { domain } = parse(req);

  if (!domain) {
    return NextResponse.next();
  }

  if (domain === "rivvi.io") {
    console.log("middleware/root.ts: domain === rivvi.io");
    return NextResponse.rewrite(new URL("/rivvi.io", req.url));
  } else {
    console.log("middleware/root.ts: domain !== rivvi.io");
    // rewrite to root page unless the user defines a site to redirect to
    return NextResponse.rewrite(new URL(`/${domain}`, req.url));
  }
}
