"use server";
import { getDomainWithoutWWW, PHUNQ_ADMIN_ID } from "@phunq/utils";
import { get } from "@vercel/edge-config";
import { randomBytes } from "crypto";

import { deleteDomainAndSites } from "@/lib/api/domains";
import { deleteWorkspace } from "@/lib/api/workspace";
import { getSession, hashToken } from "@/lib/auth";
import prisma from "@/lib/prisma";

async function isAdmin() {
  const session = await getSession();
  if (!session?.user) return false;
  const response = await prisma.workspaceUser.findUnique({
    where: {
      userId_workspaceId: {
        // @ts-ignore
        userId: session.user.id,
        workspaceId: PHUNQ_ADMIN_ID,
      },
    },
  });
  if (!response) return false;
  return true;
}

async function getImpersonateUrl(email: string) {
  const token = randomBytes(32).toString("hex");

  await prisma.verificationToken.create({
    data: {
      identifier: email,
      token: hashToken(token),
      expires: new Date(Date.now() + 60000),
    },
  });

  const params = new URLSearchParams({
    callbackUrl: process.env.NEXTAUTH_URL as string,
    email,
    token,
  });

  return `${process.env.NEXTAUTH_URL}/api/auth/callback/email?${params}`;
}

export async function getUser(data: FormData) {
  const email = data.get("email") as string;

  if (!(await isAdmin())) {
    return {
      error: "Unauthorized",
    };
  }

  const response = await prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      email: true,
    },
  });

  if (!response?.email) {
    return {
      error: "No user found",
    };
  }

  return {
    email: response.email,
    impersonateUrl: await getImpersonateUrl(response.email),
  };
}

export async function getWorkspaceOwner(data: FormData) {
  const slug = data.get("slug") as string;

  if (!(await isAdmin())) {
    return {
      error: "Unauthorized",
    };
  }

  const response = await prisma.user.findFirst({
    where: {
      workspaces: {
        some: {
          workspace: {
            slug,
          },
          role: "OWNER",
        },
      },
    },
    select: {
      email: true,
    },
  });

  if (!response?.email) {
    return {
      error: "No user found",
    };
  }

  return {
    email: response.email,
    impersonateUrl: await getImpersonateUrl(response.email),
  };
}

export async function getUserByKey(data: FormData) {
  const key = data.get("key") as string;

  if (!(await isAdmin())) {
    return {
      error: "Unauthorized",
    };
  }

  const response = await prisma.user.findFirst({
    where: {
      sites: {
        some: {
          domain: "ruhe.app",
          key,
        },
      },
    },
    select: {
      email: true,
      sites: {
        where: {
          domain: "ruhe.app",
          key,
        },
        select: {
          key: true,
          // url: true,
        },
      },
      workspaces: {
        where: {
          role: "OWNER",
        },
        select: {
          workspace: {
            select: {
              name: true,
              slug: true,
              plan: true,
              domains: {
                select: {
                  slug: true,
                  verified: true,
                },
              },
            },
          },
        },
      },
    },
  });
  if (!response?.email) {
    return {
      error: "No user found",
    };
  }

  const { email, sites, workspaces } = response;

  const hostnames = new Set<string>();

  sites.map((site) => {
    const hostname = getDomainWithoutWWW(site.key as string);
    hostname && hostnames.add(hostname);
  });

  const verifiedDomains = workspaces
    .filter(({ workspace }) => {
      return workspace.domains.some(({ verified }) => verified);
    })
    .flatMap(({ workspace }) => workspace.domains.map(({ slug }) => slug));

  return {
    email: response?.email as string,
    hostnames: Array.from(hostnames),
    proWorkspaceSlugs:
      workspaces
        .filter(({ workspace }) => workspace.plan === "pro")
        .map(({ workspace }) => workspace.slug) || [],
    verifiedDomains: verifiedDomains || [],
    impersonateUrl: await getImpersonateUrl(email),
  };
}

export async function banUser(data: FormData) {
  const email = data.get("email") as string;
  const hostnames = data.getAll("hostname") as string[];

  if (!(await isAdmin())) {
    return {
      error: "Unauthorized",
    };
  }

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
      workspaces: {
        where: {
          role: "OWNER",
        },
        select: {
          workspace: {
            select: {
              id: true,
              slug: true,
              logo: true,
              stripeId: true,
            },
          },
        },
      },
    },
  });

  if (!user) {
    return {
      error: "No user found",
    };
  }

  const blacklistedDomains = (await get("domains")) as string[];
  const blacklistedEmails = (await get("emails")) as string[];

  const ban = await Promise.allSettled([
    deleteDomainAndSites(user.id),
    fetch(
      `https://api.vercel.com/v1/edge-config/${process.env.EDGE_CONFIG_ID}/items?teamId=${process.env.TEAM_ID_VERCEL}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${process.env.AUTH_BEARER_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: [
            {
              operation: "update",
              key: "domains",
              value: [...blacklistedDomains, ...hostnames],
            },
            {
              operation: "update",
              key: "emails",
              value: [...blacklistedEmails, email],
            },
          ],
        }),
      },
    ).then((res) => res.json()),
    ...user.workspaces.map(({ workspace }) =>
      deleteWorkspace({
        id: workspace.id,
        slug: workspace.slug,
        stripeId: workspace.stripeId || undefined,
        logo: workspace.logo || undefined,
      }),
    ),
  ]);

  const response = await prisma.user.delete({
    where: {
      id: user.id,
    },
  });

  console.log(
    JSON.stringify(
      {
        ban,
        response,
      },
      null,
      2,
    ),
  );

  return true;
}
