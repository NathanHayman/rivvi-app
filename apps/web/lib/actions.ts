"use server";

import prisma from "@/lib/prisma";
import { Page, Site } from "@prisma/client";
import { revalidateTag } from "next/cache";
import { getSession, withPageAuth, withSiteAuth } from "@/lib/auth/options";
import {
  addDomainToVercel,
  removeDomainFromVercelProject,
  validDomainRegex,
} from "@/lib/domains";
import { put } from "@vercel/blob";
import { customAlphabet } from "nanoid";
import { getBlurDataURL } from "./images";
import { validSlugRegex } from "@phunq/utils";
import { NextResponse } from "next/server";
import { domainExists, validateDomain } from "./api/domains";
import { studioCreds } from "./studio-keys";

const nanoid = customAlphabet(
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  7,
); // 7-character random string

export const createWorkspace = async (formData: FormData) => {
  const session = await getSession();
  if (!session?.user.id) {
    return {
      error: "Not authenticated",
    };
  }
  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const domain = formData.get("domain") as string;

  if (!name || !slug || !domain) {
    return {
      error: "Missing required fields",
    };
  }

  let slugError: string | null = null;

  // check if slug is too long
  if (slug.length > 48) {
    slugError = "Slug must be less than 48 characters";

    // check if slug is valid
  } else if (!validSlugRegex.test(slug)) {
    slugError = "Invalid slug";
  }

  const validDomain = await validateDomain(domain);
  if (slugError || validDomain !== true) {
    return NextResponse.json(
      {
        slugError,
        domainError: validDomain === true ? null : validDomain,
      },
      { status: 422 },
    );
  }
  const [slugExist, domainExist] = await Promise.all([
    prisma.workspace.findUnique({
      where: {
        slug,
      },
      select: {
        slug: true,
      },
    }),
    domainExists(domain),
  ]);
  if (slugExist || domainExist) {
    return NextResponse.json(
      {
        slugError: slugExist ? "Slug is already in use." : null,
        domainError: domainExist ? "Domain is already in use." : null,
      },
      { status: 422 },
    );
  }

  const studioKeys = studioCreds.map((cred) => cred.studioKey);

  // check if the key is used by another workspace already and if not, use it
  // it doesn't need to be random, just unique and not used by another workspace
  let newKey = studioKeys[Math.floor(Math.random() * studioKeys.length)];
  const keyExists = await prisma.workspace.findFirst({
    where: {
      studioKey: newKey,
    },
  });
  if (keyExists) {
    newKey = studioKeys[Math.floor(Math.random() * studioKeys.length)];
  }

  let response;
  try {
    if (keyExists) {
      throw new Error("No more keys left");
    }
    (response = await Promise.allSettled([
      prisma.workspace.create({
        data: {
          name,
          studioKey: newKey,
          studioTokenEditor: studioCreds.find(
            (cred) => cred.studioKey === newKey,
          )?.studioTokens[0].value,
          slug,
          users: {
            create: {
              userId: session.user.id,
              role: "OWNER",
            },
          },
          rootDomain: domain,
          domains: {
            create: {
              slug: domain,
              primary: true,
            },
          },
          billingCycleStart: new Date().getDate(),
        },
      }),
      addDomainToVercel(domain),
      // redis.set(`studioKey:${slug}`, newKey),
    ])),
      {
        next: {
          cache: "no-store",
        },
      };
  } catch (error) {
    if (error.message === "No more keys left") {
      return NextResponse.json({
        slugError: "No more keys left",
      });
    }
  }

  return NextResponse.json(response);
};

export const createSite = async (formData: FormData) => {
  const session = await getSession();
  if (!session?.user.id) {
    return {
      error: "Not authenticated",
    };
  }
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const subdomain = formData.get("subdomain") as string;

  try {
    const response = await prisma.site.create({
      data: {
        name,
        description,
        subdomain,
      },
    });
    revalidateTag(
      `${subdomain}.${process.env.NEXT_PUBLIC_USER_SUBDOMAIN}-metadata`,
    );
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

export const updateSite = withSiteAuth(
  async (formData: FormData, site: Site, key: string) => {
    const value = formData.get(key) as string;

    try {
      let response;

      if (key === "customDomain") {
        if (value.includes("vercel.pub")) {
          return {
            error: "Cannot use vercel.pub subdomain as your custom domain",
          };

          // if the custom domain is valid, we need to add it to Vercel
        } else if (validDomainRegex.test(value)) {
          response = await prisma.site.update({
            where: {
              id: site.id,
            },
            data: {
              customDomain: value,
            },
          });
          await Promise.all([
            addDomainToVercel(value),
            // Optional: add www subdomain as well and redirect to apex domain
            // addDomainToVercel(`www.${value}`),
          ]);

          // empty value means the user wants to remove the custom domain
        } else if (value === "") {
          response = await prisma.site.update({
            where: {
              id: site.id,
            },
            data: {
              customDomain: null,
            },
          });
        }

        // if the site had a different customDomain before, we need to remove it from Vercel
        if (site.customDomain && site.customDomain !== value) {
          response = await removeDomainFromVercelProject(site.customDomain);

          /* Optional: remove domain from Vercel team 

          // first, we need to check if the apex domain is being used by other sites
          const apexDomain = getApexDomain(`https://${site.customDomain}`);
          const domainCount = await prisma.site.count({
            where: {
              OR: [
                {
                  customDomain: apexDomain,
                },
                {
                  customDomain: {
                    endsWith: `.${apexDomain}`,
                  },
                },
              ],
            },
          });

          // if the apex domain is being used by other sites
          // we should only remove it from our Vercel project
          if (domainCount >= 1) {
            await removeDomainFromVercelProject(site.customDomain);
          } else {
            // this is the only site using this apex domain
            // so we can remove it entirely from our Vercel team
            await removeDomainFromVercelTeam(
              site.customDomain
            );
          }
          
          */
        }
      } else if (key === "image" || key === "logo") {
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
            id: site.id,
          },
          data: {
            [key]: value,
          },
        });
      }
      console.log(
        "Updated site data! Revalidating tags: ",
        `${site.subdomain}.${process.env.NEXT_PUBLIC_USER_SUBDOMAIN}-metadata`,
        `${site.customDomain}-metadata`,
      );
      revalidateTag(
        `${site.subdomain}.${process.env.NEXT_PUBLIC_USER_SUBDOMAIN}-metadata`,
      );
      site.customDomain && revalidateTag(`${site.customDomain}-metadata`);

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

export const deleteSite = withSiteAuth(async (_: FormData, site: Site) => {
  try {
    const response = await prisma.site.delete({
      where: {
        id: site.id,
      },
    });
    await revalidateTag(
      `${site.subdomain}.${process.env.NEXT_PUBLIC_USER_SUBDOMAIN}-metadata`,
    );
    response.customDomain && revalidateTag(`${site.customDomain}-metadata`);
    return response;
  } catch (error: any) {
    return {
      error: error.message,
    };
  }
});

export const getSiteFromPageId = async (pageId: string) => {
  const page = await prisma.page.findUnique({
    where: {
      id: pageId,
    },
    select: {
      siteId: true,
    },
  });
  return page?.siteId;
};

export const createPage = withSiteAuth(async (_: FormData, site: Site) => {
  const session = await getSession();
  if (!session?.user.id) {
    return {
      error: "Not authenticated",
    };
  }
  const response = await prisma.page.create({
    data: {
      siteId: site.id,
    },
  });

  revalidateTag(
    `${site.subdomain}.${process.env.NEXT_PUBLIC_USER_SUBDOMAIN}-pages`,
  );
  site.customDomain && revalidateTag(`${site.customDomain}-pages`);

  return response;
});

// creating a separate function for this because we're not using FormData
export const updatePage = async (data: Page) => {
  const session = await getSession();
  if (!session?.user.id) {
    return {
      error: "Not authenticated",
    };
  }
  const page = await prisma.page.findUnique({
    where: {
      id: data.id,
    },
    include: {
      site: true,
    },
  });
  if (!page || page.site?.userId !== session.user.id) {
    return {
      error: "page not found",
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

    revalidateTag(
      `${page.site?.subdomain}.${process.env.NEXT_PUBLIC_USER_SUBDOMAIN}-pages`,
    );
    revalidateTag(
      `${page.site?.subdomain}.${process.env.NEXT_PUBLIC_USER_SUBDOMAIN}-${page.slug}`,
    );

    // if the site has a custom domain, we need to revalidate those tags too
    page.site?.customDomain &&
      (revalidateTag(`${page.site?.customDomain}-pages`),
      revalidateTag(`${page.site?.customDomain}-${page.slug}`));

    return response;
  } catch (error: any) {
    return {
      error: error.message,
    };
  }
};

export const updatePageMetadata = withPageAuth(
  async (
    formData: FormData,
    page: Page & {
      site: Site;
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

      await revalidateTag(
        `${page.site?.subdomain}.${process.env.NEXT_PUBLIC_USER_SUBDOMAIN}-pages`,
      );
      await revalidateTag(
        `${page.site?.subdomain}.${process.env.NEXT_PUBLIC_USER_SUBDOMAIN}-${page.slug}`,
      );

      // if the site has a custom domain, we need to revalidate those tags too
      page.site?.customDomain &&
        (await revalidateTag(`${page.site?.customDomain}-pages`),
        await revalidateTag(`${page.site?.customDomain}-${page.slug}`));

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

export const deletePage = withPageAuth(async (_: FormData, page: Page) => {
  try {
    const response = await prisma.page.delete({
      where: {
        id: page.id,
      },
      select: {
        siteId: true,
      },
    });
    return response;
  } catch (error: any) {
    return {
      error: error.message,
    };
  }
});

export const editUser = async (
  formData: FormData,
  _id: unknown,
  key: string,
) => {
  const session = await getSession();
  if (!session?.user.id) {
    return {
      error: "Not authenticated",
    };
  }
  const value = formData.get(key) as string;

  try {
    const response = await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        [key]: value,
      },
    });
    return response;
  } catch (error: any) {
    if (error.code === "P2002") {
      return {
        error: `This ${key} is already in use`,
      };
    } else {
      return {
        error: error.message,
      };
    }
  }
};
