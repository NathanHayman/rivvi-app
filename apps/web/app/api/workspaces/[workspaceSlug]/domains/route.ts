import { NextResponse } from "next/server";

import {
  addDomainToVercel,
  setRootDomain,
  validateDomain,
} from "@/lib/api/domains";
import { withAuth } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET /api/workspaces/[workspaceSlug]/domains – get all domains for a workspace
export const GET = withAuth(async ({ workspace }) => {
  const domains = await prisma.domain.findMany({
    where: {
      workspaceId: workspace.id,
    },
    select: {
      slug: true,
      verified: true,
      primary: true,
    },
  });
  return NextResponse.json(domains);
});

// POST /api/workspaces/[workspaceSlug]/domains - add a domain
export const POST = withAuth(async ({ req, workspace }) => {
  const { slug: domain, primary } = await req.json();
  const validDomain = await validateDomain(domain);
  if (validDomain !== true) {
    return new Response(validDomain, { status: 422 });
  }
  const vercelResponse = await addDomainToVercel(domain);
  if (vercelResponse.error) {
    return new Response(vercelResponse.error.message, { status: 422 });
  }
  /* 
        If the domain is being added, we need to:
          1. Add the domain to Vercel
          2. If there's a landing page set, update the root domain in Redis
          3. If the domain is being set as the primary domain, set all other domains to not be the primary domain
          4. Add the domain to the database along with its primary status
      */
  const response = await Promise.allSettled([
    setRootDomain({
      domain,
    }),
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
    prisma.domain.create({
      data: {
        slug: domain,
        workspaceId: workspace.id,
        primary,
      },
    }),
  ]);

  return NextResponse.json(response);
});
