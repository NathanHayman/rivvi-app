"use server";

import { nanoid } from "@phunq/utils";
import { Site } from "@prisma/client";
import { put } from "@vercel/blob";
import { revalidatePath, revalidateTag } from "next/cache";

import { withSiteAuth } from "../auth/options";
import prisma from "@/lib/prisma";

import { getBlurDataURL } from "../images";

export async function getSitesByWorkspace(workspaceSlug: string) {
  if (!workspaceSlug) {
    return [];
  }

  let response;
  try {
    response = await prisma.site.findMany({
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
  } catch (error) {
    console.log(error);
  }

  revalidateTag(`${workspaceSlug}-sites`);

  return response;
}

export const updateSite = withSiteAuth(
  async (formData: FormData, site: Site, key: string) => {
    const value = formData.get(key) as string;

    try {
      let response;

      if (key === "image" || key === "logo") {
        if (!process.env.BLOB_READ_WRITE_TOKEN) {
          return {
            error:
              "Missing BLOB_READ_WRITE_TOKEN token. Note: Vercel Blob is currently in beta – please fill out this form for access: https://tally.so/r/nPDMNd",
          };
        }

        const file = formData.get(key) as File;
        const filename = `${nanoid()}.${file.type.split("/")[1]}`;

        const { url } = await put(filename, file, {
          access: "public",
        });

        const blurhash = key === "image" ? await getBlurDataURL(url) : null;

        response = await prisma.site.update({
          where: {
            id: site.id,
          },
          data: {
            [key]: url,
            ...(blurhash && { imageBlurhash: blurhash }),
          },
        });
      } else {
        response = await prisma.site.update({
          where: {
            key: site.key as string,
          },
          data: {
            [key]: value,
          },
        });
      }

      revalidatePath(`${site.domain}/sites/${site.key}`);
      revalidateTag(`${site.domain}-metadata`);

      return response;
    } catch (error: any) {
      if (error.code === "P2002") {
        return {
          error: `This ${key} is already taken`,
        };
      } else {
        return {
          error: error.message,
        };
      }
    }
  },
);

export async function removePageFromSite({
  workspaceSlug,
  key,
  id,
}: {
  workspaceSlug: string;
  key: string;
  id: string;
}) {
  if (!workspaceSlug) {
    return [];
  }

  const site = await prisma.site.findUnique({
    where: {
      key,
    },
  });

  if (!site) {
    throw new Error("site not found");
  }
  // remove the page from the site and set it to unpublished
  const siteWithPages = await prisma.site.update({
    where: {
      key,
    },
    data: {
      pages: {
        disconnect: {
          id,
        },
      },
    },
  });

  await prisma.page.update({
    where: {
      id,
    },
    data: {
      published: false,
      siteDomainSlug: null as any,
    },
  });

  revalidatePath(`${workspaceSlug}/sites/${site.key}/pages`);
  revalidateTag(`${site.key}-pages`);

  return siteWithPages;
}

export async function deleteSiteFromWorkspace({
  workspaceSlug,
  key,
}: {
  workspaceSlug: string;
  key: string;
}) {
  if (!workspaceSlug) {
    return [];
  }

  const response = await prisma.site.delete({
    where: {
      key,
    },
  });

  revalidateTag(`${workspaceSlug}-sites`);
  revalidatePath(`${workspaceSlug}/sites`);

  return response;
}

export async function getSites({ workspaceSlug }: { workspaceSlug: string }) {
  const sites = await prisma.site.findMany({
    where: {
      workspace: {
        slug: workspaceSlug,
      },
    },
  });

  return sites;
}

export async function getSitesByKey({ key }: { key: string }) {
  const site = await prisma.site.findUnique({
    where: {
      key,
    },
  });
  return site;
}

export async function updateSiteContent(key: string, domain: string) {
  await prisma.site.update({
    where: {
      domain_key: {
        key,
        domain,
      },
    },
    data: {
      // content: jsonContent,
    },
  });
}

export async function publishSite(key: string, domain: string) {
  await prisma.site.update({
    where: {
      domain_key: {
        key,
        domain,
      },
    },
    data: {
      // published: true,
    },
  });
}
