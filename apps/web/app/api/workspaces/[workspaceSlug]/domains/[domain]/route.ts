import { NextResponse } from "next/server";

import {
  addDomainToVercel,
  changeDomainForSites,
  changeDomainForImages,
  deleteDomainAndSites,
  removeDomainFromVercel,
  setRootDomain,
  validateDomain,
} from "@/lib/api/domains";
import { withAuth } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET /api/workspaces/[workspaceSlug]/domains/[domain] – get a workspace's domain
export const GET = withAuth(async ({ domain }) => {
  const data = await prisma.domain.findUnique({
    where: {
      slug: domain,
    },
    select: {
      slug: true,
      verified: true,
      primary: true,
    },
  });
  if (!data) {
    return new Response("Domain not found", { status: 404 });
  }
  return NextResponse.json({
    ...data,
  });
});

// PUT /api/workspaces/[workspaceSlug]/domains/[domain] – edit a workspace's domain
export const PUT = withAuth(async ({ req, workspace, domain }) => {
  const { slug: newDomain, primary } = await req.json();

  if (newDomain !== domain) {
    const validDomain = await validateDomain(newDomain);
    if (validDomain !== true) {
      return new Response(validDomain, { status: 422 });
    }
    const vercelResponse = await addDomainToVercel(newDomain);
    if (vercelResponse.error) {
      return new Response(vercelResponse.error.message, { status: 422 });
    }
  }

  const response = await Promise.allSettled([
    // if the domain is being changed, we need to:
    //  1. Remove the old domain from Vercel
    //  2. Add the new domain to Vercel
    //  3. Update all funnels in the workspace to point to the new domain
    //  4. Update all images in the workspace to point to the new domain
    ...(newDomain !== domain
      ? [
          removeDomainFromVercel(domain),
          changeDomainForSites(domain, newDomain),
          changeDomainForImages(domain, newDomain),
        ]
      : []),
    /* 
      if the workspace is not a free plan:
        - if the domain is being set: 
          - Set the root domain to the target in Redis
          - if the domain is being changed, also change the root domain key in Redis
        - if the domain is being unset:
          - delete the root domain key in Redis
    */
    workspace.plan !== "free" &&
      setRootDomain({
        domain,
        ...(newDomain !== domain && {
          newDomain,
        }),
      }),

    // if the domain is being set as the primary domain, set the current primary domain to false
    primary &&
      prisma.domain.updateMany({
        where: {
          workspaceId: workspace.id,
          primary: true,
        },
        data: {
          primary: false,
        },
      }),
    // Update the domain in the database along with its primary status
    prisma.domain.update({
      where: {
        slug: domain,
      },
      data: {
        ...(newDomain !== domain && {
          slug: newDomain,
        }),
        // same logic as the redis part above
        ...(workspace.plan !== "free" && {
          primary: primary ?? false,
        }),
      },
    }),
  ]);

  return NextResponse.json(response);
});

// DELETE /api/workspaces/[workspaceSlug]/domains/[domain] - delete a workspace's domain
export const DELETE = withAuth(async ({ domain }) => {
  const response = await deleteDomainAndSites(domain);
  return NextResponse.json(response);
});
