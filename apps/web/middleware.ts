import { ADMIN_HOSTNAMES, APP_HOSTNAMES, LOCALHOST_IP } from "@phunq/utils";
import { NextFetchEvent, NextRequest, NextResponse } from "next/server";

import { AppMiddleware, RootMiddleware } from "@/lib/middleware";
import { parse } from "@/lib/middleware/utils";

import { ipAddress } from "@vercel/edge";
import { isHomeHostname } from "./lib/constants";
import AdminMiddleware from "./lib/middleware/admin";

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api/ routes
     * 2. /_next/ (Next.js internals)
     * 3. /_proxy/ (special page for OG tags proxying)
     * 4. /_static (inside /public)
     * 5. /_vercel (Vercel internals)
     * 6. /favicon.ico, /sitemap.xml, /robots.txt (static files)
     */
    "/((?!api/|_next/|_proxy/|_static|_vercel|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};

export default async function middleware(req: NextRequest, ev: NextFetchEvent) {
  // console the ip address of the request
  const { domain, path, key, fullPath } = parse(req);
  // const ip = ipAddress(req) || LOCALHOST_IP;

  // // if the ip in not LOCALHOST_IP, then dont allow the user to access the site
  // if (ip !== LOCALHOST_IP) {
  //   return NextResponse.redirect(new URL(`https://rivvi.io/404`, req.url));
  // }

  // for Home
  if (isHomeHostname(domain)) {
    return NextResponse.rewrite(
      new URL(`/rivvi.io${path === "/" ? "" : path}`, req.url),
    );
  }

  // for App
  if (APP_HOSTNAMES.has(domain)) {
    return AppMiddleware(req);
  }

  // for Admin
  if (ADMIN_HOSTNAMES.has(domain)) {
    return AdminMiddleware(req);
  }

  // for root pages (e.g. dub.co, vercel.fyi, etc.)
  if (key.length === 0) {
    // console.log(`Root: ${domain}${path}`);
    return RootMiddleware(req, ev);
  }

  // for home pages (e.g. dub.co, vercel.fyi, etc.)
  // return NextResponse.redirect(new URL("/", req.url), PHUNQ_HEADERS);
  return NextResponse.rewrite(new URL(`/${domain}${path}`, req.url));
}
