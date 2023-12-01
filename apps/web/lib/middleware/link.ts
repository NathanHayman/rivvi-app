import { LOCALHOST_IP, PHUNQ_HEADERS } from "@phunq/utils";
import { ipAddress } from "@vercel/edge";
import { NextFetchEvent, NextRequest, NextResponse } from "next/server";

import { parse } from "@/lib/middleware/utils";
import { ratelimit } from "@/lib/upstash";

import { isBlacklistedReferrer } from "../edge-config";

export default async function LinkMiddleware(
  req: NextRequest,
  ev: NextFetchEvent,
) {
  const { domain, fullKey: key } = parse(req);

  if (!domain || !key) {
    return NextResponse.next();
  }

  if (
    process.env.NODE_ENV !== "development" &&
    domain === "ruhe.app" &&
    key === "github"
  ) {
    if (await isBlacklistedReferrer(req.headers.get("referer"))) {
      console.log(
        'middleware/link.ts: await isBlacklistedReferrer(req.headers.get("referer"))',
      );
      return new Response("Don't DDoS me pls 🥺", { status: 429 });
    }
    const ip = ipAddress(req) || LOCALHOST_IP;
    const { success } = await ratelimit(10, "1 d").limit(
      `${ip}:${domain}:${key}`,
    );

    if (!success) {
      console.log('middleware/link.ts: ratelimit(10, "1 d").limit');
      return new Response("Don't DDoS me pls 🥺", { status: 429 });
    }
  }
  return NextResponse.redirect(new URL("/", req.url), PHUNQ_HEADERS);
}
