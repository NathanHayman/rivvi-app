"use server";

import { validDomainRegex } from "@phunq/utils";
import { Page, Workspace } from "@prisma/client";
import { put } from "@vercel/blob";
import { nanoid } from "nanoid";
import { revalidatePath, revalidateTag } from "next/cache";

import {
  withCustomPageAuth,
  withPageAuth,
  withWorkspaceAuthNew,
} from "@/lib/auth-server";
import prisma from "@/lib/prisma";
import { getAllPageDocIds } from "@/lib/cms/backend";

import { addDomainToVercel } from "../api/domains";
import { getBlurDataURL } from "../images";

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

export const createCustomPage = withWorkspaceAuthNew(
  async (formData: FormData, workspace: Workspace) => {
    const title = formData.get("title") as string;
    const slug = formData.get("slug") as string;
    const domain = formData.get("domain") as string;

    const response = await prisma.page.create({
      data: {
        domain: domain,
        title: title,
        slug: slug,
        type: "custom",
        relationType: "standalone",
        workspace: {
          connect: {
            id: workspace.id,
          },
        },
      },
    });

    if (!response) {
      return {
        error: "Not authorized",
      };
    }

    await revalidateTag(`${domain}.${slug}`);

    return response;
  },
);

// creating a separate function for this because we're not using FormData
export const updateCustomPage = async (data: Page) => {
  const page = await prisma.page.findUnique({
    where: {
      id: data.id,
    },
    include: {
      workspace: true,
    },
  });
  if (!page) {
    return {
      error: "Page not found",
    };
  }
  try {
    const response = await prisma.page.update({
      where: {
        id: data.id,
      },
      data: {
        title: data.title,
        description: data.description,
        content: data.content,
      },
    });

    await revalidateTag(`${page.domain}.${page.slug}-${page.slug}`);

    return response;
  } catch (error: any) {
    return {
      error: error.message,
    };
  }
};

export const updateCustomPageMetadata = withCustomPageAuth(
  async (
    formData: FormData,
    page: Page & {
      workspace: Workspace;
    },
    key: string,
  ) => {
    const value = formData.get(key) as string;

    try {
      let response;
      if (key === "image") {
        const file = formData.get("image") as File;
        const filename = `${nanoid()}.${file.type.split("/")[1]}`;

        const { url } = await put(filename, file, {
          access: "public",
        });

        const blurhash = await getBlurDataURL(url);

        response = await prisma.page.update({
          where: {
            id: page.id,
          },
          data: {
            image: url,
            imageBlurhash: blurhash,
          },
        });
      } else {
        response = await prisma.page.update({
          where: {
            id: page.id,
          },
          data: {
            [key]: key === "published" ? value === "true" : value,
          },
        });
      }
      await revalidateTag(`${page.domain}.${page.slug}-${page.slug}`);

      return response;
    } catch (error: any) {
      if (error.code === "P2002") {
        return {
          error: `This slug is already in use`,
        };
      } else {
        return {
          error: error.message,
        };
      }
    }
  },
);

export const deleteCustomPage = withCustomPageAuth(
  async (_: FormData, page: Page) => {
    try {
      const response = await prisma.page.delete({
        where: {
          id: page.id,
        },
        select: {
          domain: true,
        },
      });
      return response;
    } catch (error: any) {
      return {
        error: error.message,
      };
    }
  },
);
