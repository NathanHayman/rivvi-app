import { DEFAULT_REDIRECTS, validSlugRegex } from "@phunq/utils";
import { NextResponse } from "next/server";

import {
  addDomainToVercel,
  domainExists,
  validateDomain,
} from "@/lib/api/domains";
import { withAuth } from "@/lib/auth";
import { isReservedKey } from "@/lib/edge-config";
import prisma from "@/lib/prisma";
import { studioCreds } from "@/lib/studio-keys";

// GET /api/workspaces - get all workspaces for the current user
export const GET = withAuth(async ({ session }) => {
  const workspaces = await prisma.workspace.findMany({
    where: {
      users: {
        some: {
          userId: session.user.id,
        },
      },
    },
  });
  return NextResponse.json(workspaces);
});

export const POST = withAuth(async ({ req, session }) => {
  const { name, slug, domain } = await req.json();
  if (!name || !slug || !domain) {
    return new Response("Missing name or slug or domain", { status: 422 });
  }
  let slugError: string | null = null;

  // check if slug is too long
  if (slug.length > 48) {
    slugError = "Slug must be less than 48 characters";

    // check if slug is valid
  } else if (!validSlugRegex.test(slug)) {
    slugError = "Invalid slug";

    // check if slug is reserved
  } else if ((await isReservedKey(slug)) || DEFAULT_REDIRECTS[slug]) {
    slugError = "Cannot use reserved slugs";
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

  // if there is no more keys left, return an error
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
});
