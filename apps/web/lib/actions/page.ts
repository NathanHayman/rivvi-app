"use server";

import { validDomainRegex } from "@phunq/utils";
import { Page } from "@prisma/client";
import { revalidatePath, revalidateTag } from "next/cache";

import { withPageAuth } from "../auth/options";
import prisma from "@/lib/prisma";
import { getAllPageDocIds } from "@/lib/cms/backend";
import { addDomainToVercel } from "../api/domains";

export const syncPagesFromSanity = async (
  slug: string,
  studioKey: string,
  studioTokenEditor,
) => {
  const workspace = await prisma.workspace.findUnique({
    where: {
      slug,
    },
  });

  if (!workspace) {
    return {
      error: "Workspace not found",
    };
  }

  const sanityPages = await getAllPageDocIds(studioKey, studioTokenEditor);

  if (!sanityPages) {
    return {
      error: "No pages found",
    };
  }

  // check if the page _id (which is the Sanity document ID) exists in the database
  // if it doesn't, create it and revlaidate the cache for the /[slug]/pages page
  // if it does, update it and revalidate the cache for the /[slug]/pages page
  for (const sanityPage of sanityPages) {
    const page = await prisma.page.findUnique({
      where: {
        sanityDocumentId: sanityPage._id,
      },
    });

    if (!page) {
      await prisma.page.create({
        data: {
          title: sanityPage.title,
          slug: sanityPage.slug,
          sanityDocumentId: sanityPage._id,
          workspaceId: workspace.id,
          type: "studio",
          relationType: "standalone",
        },
      });
      revalidateTag(
        `${workspace.slug}.${process.env.NEXT_PUBLIC_USER_SUBDOMAIN}-pages`,
      );
    } else {
      await prisma.page.update({
        where: {
          sanityDocumentId: sanityPage._id,
        },
        data: {
          title: sanityPage.title,
          slug: sanityPage.slug,
        },
      });
      revalidateTag(
        `${workspace.slug}.${process.env.NEXT_PUBLIC_USER_SUBDOMAIN}-pages`,
      );
    }
  }

  // get all pages from the database
  const databasePages = await prisma.page.findMany({
    where: {
      workspaceId: workspace.id,
    },
  });

  // check if the page exists in Sanity
  // if it doesn't, delete it and revlaidate the cache for the /[slug]/pages page
  for (const databasePage of databasePages) {
    const sanityPage = sanityPages.find(
      (sanityPage) => sanityPage._id === databasePage.sanityDocumentId,
    );

    if (!sanityPage) {
      await prisma.page.delete({
        where: {
          id: databasePage.id,
        },
      });
      revalidateTag(
        `${workspace.slug}.${process.env.NEXT_PUBLIC_USER_SUBDOMAIN}-pages`,
      );
    }
  }

  return {
    success: true,
  };
};

export const deletePage = withPageAuth(async (_: FormData, page: Page) => {
  try {
    const response = await prisma.page.delete({
      where: {
        id: page.id,
      },
      select: {
        workspaceId: true,
      },
    });
    return response;
  } catch (error: any) {
    return {
      error: error.message,
    };
  }
});

export const createSite = async (formData: FormData, workspaceSlug: string) => {
  const name = formData.get("name") as string;
  // const description = formData.get("description") as string;
  const domain = formData.get("domain") as string;

  try {
    let response;
    if (domain) {
      if (domain.includes("rivvi.io")) {
        return {
          error: "Cannot use rivvi.io subdomain as your domain",
        };
      } else if (validDomainRegex.test(domain)) {
        response = await prisma.site.create({
          data: {
            name,
            domain,
          },
        });
        await addDomainToVercel(domain);
      } else {
        return {
          error: "Invalid domain",
        };
      }
    } else {
      response = await prisma.site.create({
        data: {
          name,
        },
      });
    }
    revalidatePath(`${workspaceSlug}/sites/${response.key}`);
    revalidatePath(`${workspaceSlug}/sites`);
    return response;
  } catch (error: any) {
    if (error.code === "P2002") {
      return {
        error: `This subdomain is already taken`,
      };
    } else {
      return {
        error: error.message,
      };
    }
  }
};

export async function deleteSite(key: string, domain: string) {
  await prisma.site.delete({
    where: {
      key,
    },
  });

  revalidatePath(`${domain}/sites`);
}

export async function getPagesBySite({ key }: { key: string }) {
  const pages = await prisma.page.findMany({
    where: {
      site: {
        key,
      },
    },
  });

  return pages;
}

// we're gonna pass in the key and the pages, each page will it's own id
export async function addPagesToSite({
  key,
  pages,
}: {
  key: string;
  pages: string[];
}) {
  const site = await prisma.site.findUnique({
    where: {
      key,
    },
  });

  if (!site) {
    throw new Error("site not found");
  }

  const sitePages = await prisma.page.findMany({
    where: {
      site: {
        key,
      },
    },
  });

  const sitePageIds = sitePages.map((page) => page.id);

  const pageIds = pages.filter((page) => !sitePageIds.includes(page));

  const pagesToConnect = pageIds.map((pageId) => ({
    id: pageId,
  }));

  const siteWithPages = await prisma.site.update({
    where: {
      key,
    },
    data: {
      pages: {
        connect: pagesToConnect,
      },
    },
  });

  await prisma.page.updateMany({
    // set pages to published
    where: {
      id: {
        in: pageIds,
      },
    },
    data: {
      published: true,
      siteDomainSlug: site.domain,
    },
  });

  revalidatePath(`${site.domain}/sites/${key}/pages`);

  return siteWithPages;
}
