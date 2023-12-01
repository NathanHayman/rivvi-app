import { NextResponse } from "next/server";

import { deleteSite, editSite, processSite } from "@/lib/api/sites";
import { withAuth } from "@/lib/auth";

// PUT /api/workspaces/[slug]/sites/[siteId] – update a site
export const PUT = withAuth(
  async ({ req, headers, workspace, site, session }) => {
    let body;
    try {
      body = await req.json();
    } catch (error) {
      return new Response("Missing or invalid body.", { status: 400, headers });
    }
    if (Object.keys(body).length === 0) {
      return new Response("No fields to update.", { status: 304, headers });
    }

    const updatedSite = {
      ...site,
      ...body,
    };

    if (updatedSite.workspaceId !== site?.workspaceId) {
      return new Response(
        "Transferring sites to another workspace is not yet supported.",
        {
          status: 403,
          headers,
        },
      );
    }

    const {
      site: processedSite,
      error,
      status,
    } = await processSite({
      payload: updatedSite,
      workspace,
    });

    if (!processedSite) {
      return new Response(error, { status, headers });
    }

    const [response, invalidFavicon] = await Promise.allSettled([
      editSite({
        // site is guaranteed to exist because if not we will return 404
        domain: site!.domain as string,
        key: site!.key as string,
        updatedSite: processedSite,
      }),
      // @ts-ignore
    ]).then((results) => results.map((result) => result.value));

    if (response === null) {
      return new Response("Key already exists.", { status: 409, headers });
    }

    return NextResponse.json(response, {
      headers,
    });
  },
  {
    needNotExceededUsage: true,
  },
);

// DELETE /api/workspaces/[slug]/sites/[siteId] – delete a site
export const DELETE = withAuth(async ({ headers, workspace, site }) => {
  const response = await deleteSite({
    domain: site!.domain as string,
    key: site!.key as string,
  });
  return NextResponse.json(response[0], {
    headers,
  });
});
