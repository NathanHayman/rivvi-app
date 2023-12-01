import { unstable_cache } from "next/cache";
import prisma from "@/lib/prisma";
import { cache } from "react";
import { getSession } from "@/lib/auth/options";

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

export const getSites = cache(
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

export const getSite = cache(
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

export async function getSiteData(domain: string) {
  const subdomain = domain.endsWith(
    `.${process.env.NEXT_PUBLIC_USER_SUBDOMAIN}`,
  )
    ? domain.replace(`.${process.env.NEXT_PUBLIC_USER_SUBDOMAIN}`, "")
    : null;

  return await unstable_cache(
    async () => {
      return prisma.site.findUnique({
        where: subdomain ? { subdomain } : { customDomain: domain },
        include: { workspace: true },
      });
    },
    [`${domain}-metadata`],
    {
      revalidate: 900,
      tags: [`${domain}-metadata`],
    },
  )();
}

export async function getPagesForSite(domain: string) {
  const subdomain = domain.endsWith(
    `.${process.env.NEXT_PUBLIC_USER_SUBDOMAIN}`,
  )
    ? domain.replace(`.${process.env.NEXT_PUBLIC_USER_SUBDOMAIN}`, "")
    : null;

  return await unstable_cache(
    async () => {
      return prisma.page.findMany({
        where: {
          site: subdomain ? { subdomain } : { customDomain: domain },
          published: true,
        },
        select: {
          title: true,
          description: true,
          slug: true,
          image: true,
          imageBlurhash: true,
          createdAt: true,
        },
        orderBy: [
          {
            createdAt: "desc",
          },
        ],
      });
    },
    [`${domain}-pages`],
    {
      revalidate: 900,
      tags: [`${domain}-pages`],
    },
  )();
}

export async function getPageData(domain: string, slug: string) {
  const subdomain = domain.endsWith(
    `.${process.env.NEXT_PUBLIC_USER_SUBDOMAIN}`,
  )
    ? domain.replace(`.${process.env.NEXT_PUBLIC_USER_SUBDOMAIN}`, "")
    : null;

  return await unstable_cache(
    async () => {
      const data = await prisma.page.findFirst({
        where: {
          site: subdomain ? { subdomain } : { customDomain: domain },
          slug,
          published: true,
        },
        include: {
          site: {
            include: {
              workspace: true,
            },
          },
        },
      });

      if (!data) return null;

      const relatedPages = await prisma.page.findMany({
        where: {
          site: subdomain ? { subdomain } : { customDomain: domain },
          published: true,
          NOT: {
            id: data.id,
          },
        },
        select: {
          slug: true,
          title: true,
          createdAt: true,
          description: true,
          image: true,
          imageBlurhash: true,
        },
        orderBy: [
          {
            createdAt: "desc",
          },
        ],
        take: 3,
      });

      return {
        ...data,
        relatedPages,
      };
    },
    [`${domain}-${slug}`],
    {
      revalidate: 900, // 15 minutes
      tags: [`${domain}-${slug}`],
    },
  )();
}
