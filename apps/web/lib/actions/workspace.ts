// "use server";

import prisma from "@/lib/prisma";
import { redis } from "@/lib/upstash";

class UserNotFoundErr extends Error {}

export async function GetWorkspaceStudioKey(workspaceSlug: string) {
  let cachedKey = "" as string | null;
  try {
    cachedKey = await redis.get(`studioKey:${workspaceSlug}`);
  } catch (err) {
    console.error(err);
  }
  if (cachedKey) {
    return cachedKey as string;
  }
  const workspace = await prisma.workspace.findUnique({
    where: {
      slug: workspaceSlug as string,
    },
    select: {
      studioKey: true,
    },
  });

  if (!workspace) {
    throw new UserNotFoundErr();
  }

  return workspace.studioKey as string;
}

export async function getSitesByWorkspace({
  workspaceSlug,
}: {
  workspaceSlug: string;
}) {
  const sites = await prisma.site.findMany({
    where: {
      workspace: {
        slug: workspaceSlug,
      },
    },
  });

  return sites;
}

export async function getPagesByWorkspace({
  workspaceSlug,
}: {
  workspaceSlug: string;
}) {
  const pages = await prisma.page.findMany({
    where: {
      workspace: {
        slug: workspaceSlug,
      },
    },
    select: {
      type: true,
      id: true,
      slug: true,
      title: true,
      sanityDocumentId: true,
      siteDomainSlug: true,
      published: true,
      domain: true,
    },
  });

  return pages;
}
