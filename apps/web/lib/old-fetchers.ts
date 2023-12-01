import { cache } from "react"; // 👈 import the cache function

import { getSession } from "./auth";
import prisma from "./prisma";

export const getWorkspaces = cache(async () => {
  const session = await getSession();
  if (!session) {
    return null;
  }
  const workspaces = await prisma.workspace.findMany({
    where: {
      users: {
        some: {
          userId: session.user.id,
        },
      },
    },
    include: {
      domains: true,
    },
  });

  return workspaces.map((workspace) => ({
    ...workspace,
    primaryDomain:
      workspace.domains.find((domain) => domain.primary) ||
      workspace.domains[0],
  }));
});

export const getWorkspace = cache(
  async ({ workspaceSlug }: { workspaceSlug: string }) => {
    const session = await getSession();
    if (!session) {
      return null;
    }
    return await prisma.workspace.findUnique({
      where: {
        slug: workspaceSlug,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        logo: true,
        usage: true,
        usageLimit: true,
        plan: true,
        stripeId: true,
        billingCycleStart: true,
        createdAt: true,
        users: {
          where: {
            userId: session.user.id,
          },
          select: {
            role: true,
          },
        },
      },
    });
  },
);

export const getFunnels = cache(
  async ({ workspaceSlug }: { workspaceSlug: string }) => {
    const session = await getSession();
    if (!session) {
      return null;
    }
    return await prisma.site.findMany({
      where: {
        workspace: {
          slug: workspaceSlug,
        },
      },
      select: {
        id: true,
        name: true,
        key: true,
        domain: true,
        workspace: {
          select: {
            slug: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },
);

export const getFunnel = cache(
  async ({ domain, key }: { domain: string; key: string }) => {
    return await prisma.site.findUnique({
      where: {
        domain_key: {
          domain,
          key,
        },
      },
    });
  },
);
