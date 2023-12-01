import { nanoid, PHUNQ_ADMIN_ID, truncate, validKeyRegex } from "@phunq/utils";
import cloudinary from "cloudinary";

import prisma from "@/lib/prisma";
import { redis } from "@/lib/upstash";

import { Session } from "../auth";
import { SiteProps, WorkspaceProps } from "../types";
import { isReservedKey } from "../edge-config";

export async function getSitesForWorkspace({
  workspaceId,
  domain,
  sort = "createdAt",
  userId,
  showArchived,
}: {
  workspaceId: string;
  domain?: string;
  sort?: "createdAt"; // descending for all
  userId?: string | null;
  showArchived?: boolean;
}): Promise<SiteProps[]> {
  return await prisma.site.findMany({
    where: {
      workspaceId,
      archived: showArchived ? undefined : false,
      ...(domain && { domain }),
      ...(userId && { userId }),
    },
    include: {
      workspace: true,
    },
    orderBy: {
      [sort]: "desc",
    },
  });
}

export async function getSitesCount({
  searchParams,
  workspaceId,
  userId,
}: {
  searchParams: Record<string, string>;
  workspaceId: string;
  userId?: string | null;
}): Promise<any> {
  let { groupBy, domain, showArchived } = searchParams as {
    groupBy?: "domain" | "userId";
    domain?: string;
    showArchived?: boolean;
  };

  if (groupBy) {
    return await prisma.site.groupBy({
      by: [groupBy],
      where: {
        workspaceId,
        archived: showArchived ? undefined : false,
        ...(userId && { userId }),
        ...(domain && { domain }),
      },
      _count: true,
      orderBy: {
        _count: {
          [groupBy]: "desc",
        },
      },
    });
  } else {
    return await prisma.site.count({
      where: {
        workspaceId,
        archived: showArchived ? undefined : false,
        ...(userId && { userId }),
        ...(domain && { domain }),
      },
    });
  }
}

export async function getRandomKey(domain: string): Promise<string> {
  /* recursively get random key till it gets one that's available */
  const key = nanoid();
  const response = await prisma.site.findUnique({
    where: {
      domain_key: {
        domain,
        key,
      },
    },
  });
  if (response) {
    // by the off chance that key already exists
    return getRandomKey(domain);
  } else {
    return key;
  }
}

export async function checkIfKeyExists(domain: string, key: string) {
  if (
    domain === "ruhe.app" &&
    ((await isReservedKey(key)) || key === "studio" || key === "login")
  ) {
    return true; // reserved keys for ruhe.app
  }
  const site = await prisma.site.findUnique({
    where: {
      domain_key: {
        domain,
        key,
      },
    },
  });
  return !!site;
}

export function processKey(key: string) {
  if (!validKeyRegex.test(key)) {
    return null;
  }
  // remove all leading and trailing slashes from key
  key = key.replace(/^\/+|\/+$/g, "");
  if (key.length === 0) {
    return null;
  }
  return key;
}

export async function processSite({
  payload,
  workspace,
  session,
}: {
  payload: SiteProps;
  workspace: WorkspaceProps | null;
  session?: Session;
}) {
  let { domain, key, image } = payload;

  if (!domain) {
    return {
      site: payload,
      error: "Missing short site domain.",
      status: 400,
    };
  }

  if (workspace) {
    if (!workspace.domains?.find((d) => d.slug === domain)) {
      return {
        site: payload,
        error: "Domain does not belong to workspace.",
        status: 403,
      };
    }
    // if it's not a custom workspace, do some filtering
  } else {
    if (domain !== "ruhe.app") {
      return {
        site: payload,
        error: "Invalid domain",
        status: 403,
      };
    }
  }

  if (!key) {
    key = await getRandomKey(domain);
  }

  return {
    site: {
      ...payload,
      key,
      // make sure workspaceId is set to the current workspace (or Dub's if there's no workspace)
      workspaceId: workspace?.id || PHUNQ_ADMIN_ID,
      ...(session && {
        userId: session.user.id,
      }),
    },
    error: null,
    status: 200,
  };
}

export async function addSite(site: SiteProps) {
  const { domain, key, name, description, image } = site;
  const uploadedImage = image && image.startsWith("data:image") ? true : false;

  const exists = await checkIfKeyExists(domain as string, key as string);
  if (exists) {
    const error = "Key already exists.";
    return {
      site,
      error,
      status: 409,
    };
  }

  let [response, _] = await Promise.all([
    prisma.site.create({
      data: {
        ...site,
        key,
        name: truncate(name, 120) as string,
        description: truncate(description, 240) as string | null,
        image: uploadedImage ? undefined : image,
      },
    }),
    redis.set(`${domain}:${key}`, {
      // url: encodeURIComponent(url),
      // password: hasPassword,
      // proxy,
      // ...(rewrite && {
      //   rewrite: true,
      //   iframeable: await isIframeable({ url, requestDomain: domain }),
      // }),
      // ...(ios && { ios }),
      // ...(android && { android }),
      // ...(geo && { geo }),
    }),
  ]);
  if (image) {
    const { secure_url } = await cloudinary.v2.uploader.upload(image, {
      // public_id: key,
      folder: domain as string,
      overwrite: true,
      invalidate: true,
    });
    response = await prisma.site.update({
      where: {
        id: response.id,
      },
      data: {
        image: secure_url,
      },
    });
  }
  return response;
}

export async function editSite({
  domain: oldDomain = "ruhe.app",
  key: oldKey,
  updatedSite,
}: {
  domain?: string;
  key: string;
  updatedSite: SiteProps;
}) {
  const { id, domain, key, name, description, image } = updatedSite;
  const changedKey = key !== oldKey;
  const changedDomain = domain !== oldDomain;
  const uploadedImage = image && image.startsWith("data:image") ? true : false;

  if (changedDomain || changedKey) {
    const exists = await checkIfKeyExists(domain as string, key as string);
    if (exists) return null;
  }

  // exclude fields that should not be updated
  const { id: _, updatedAt, ...rest } = updatedSite;

  const [response, ...effects] = await Promise.all([
    prisma.site.update({
      where: {
        id,
      },
      data: {
        ...rest,
        key,
        name: truncate(name, 120) as string,
        description: truncate(description, 240) as string | null,
        image: uploadedImage ? undefined : image,
      },
    }),
    // only upload image to cloudinary if proxy is true and there's an image
    image
      ? cloudinary.v2.uploader.upload(image, {
          public_id: key as string,
          folder: domain as string,
          overwrite: true,
          invalidate: true,
        })
      : cloudinary.v2.uploader.destroy(`${domain}/${key}`, {
          invalidate: true,
        }),
    redis.set(
      `${domain}:${key}`,
      {
        // url: encodeURIComponent(url),
        // password: hasPassword,
        // proxy,
        // ...(rewrite && {
        //   rewrite: true,
        //   iframeable: await isIframeable({ url, requestDomain: domain }),
        // }),
        // ...(ios && { ios }),
        // ...(android && { android }),
        // ...(geo && { geo }),
      },
      {
        nx: true,
      },
    ),
    // if key is changed: rename resource in Cloudinary, delete the old key in Redis and change the clicks key name
    ...(changedDomain || changedKey
      ? [
          cloudinary.v2.uploader
            .destroy(`${oldDomain}/${oldKey}`, {
              invalidate: true,
            })
            .catch(() => {}),
          redis.del(`${oldDomain}:${oldKey}`),
        ]
      : []),
  ]);
  if (image) {
    const { secure_url } = effects[0];
    response.image = secure_url;
    await prisma.site.update({
      where: {
        id,
      },
      data: {
        image: secure_url,
      },
    });
  }

  return response;
}

export async function deleteSite({
  domain = "ruhe.app",
  key,
}: {
  domain?: string;
  key: string;
}) {
  return await Promise.all([
    prisma.site.delete({
      where: {
        domain_key: {
          domain,
          key,
        },
      },
    }),
    cloudinary.v2.uploader.destroy(`${domain}/${key}`, {
      invalidate: true,
    }),
    // deleteClickData({
    //   domain,
    //   key,
    // }),
    redis.del(`${domain}:${key}`),
  ]);
}

export async function archiveSite(
  domain: string,
  key: string,
  archived = true,
) {
  return await prisma.site.update({
    where: {
      domain_key: {
        domain,
        key,
      },
    },
    data: {
      archived,
    },
  });
}

export async function archiveFunnel(
  domain: string,
  key: string,
  archived = true,
) {
  return await prisma.site.update({
    where: {
      domain_key: {
        domain,
        key,
      },
    },
    data: {
      archived,
    },
  });
}
