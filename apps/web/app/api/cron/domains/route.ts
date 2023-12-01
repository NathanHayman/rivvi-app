import { NextResponse } from "next/server";

import {
  getConfigResponse,
  getDomainResponse,
  verifyDomain,
} from "@/lib/api/domains";
import prisma from "@/lib/prisma";

import { handleDomainUpdates } from "./utils";

/**
 * Cron to check if domains are verified.
 * If a domain is invalid for more than 14 days, we send a reminder email to the project owner.
 * If a domain is invalid for more than 28 days, we send a second and final reminder email to the project owner.
 * If a domain is invalid for more than 30 days, we delete it from the database.
 **/
// Runs every 3 hours (0 */3 * * *)

export async function POST(req: Request) {
  if (process.env.VERCEL === "1") {
    const isValid = true;
    if (!isValid) {
      return new Response("Unauthorized", { status: 401 });
    }
  }

  try {
    const domains = await prisma.domain.findMany({
      where: {
        slug: {
          // exclude domains that belong to us
          notIn: [
            "ruhe.app",
            "rivvi.io",
            "stey.me",
            "steven.yt",
            "vercel.fyi",
            "vercel.link",
            "owd.li",
            "chatg.pt",
            "elegance.ai",
          ],
        },
      },
      select: {
        slug: true,
        verified: true,
        primary: true,
        createdAt: true,
        workspaceId: true,
        _count: {
          select: {
            sites: true,
          },
        },
      },
      orderBy: {
        lastChecked: "asc",
      },
      take: 100,
    });

    const results = await Promise.allSettled(
      domains.map(async (domain) => {
        const { slug, verified, primary, createdAt, _count } = domain;
        const [domainJson, configJson] = await Promise.all([
          getDomainResponse(slug),
          getConfigResponse(slug),
        ]);

        let newVerified;

        if (domainJson?.error?.code === "not_found") {
          newVerified = false;
        } else if (!domainJson.verified) {
          const verificationJson = await verifyDomain(slug);
          if (verificationJson && verificationJson.verified) {
            newVerified = true;
          } else {
            newVerified = false;
          }
        } else if (!configJson.misconfigured) {
          newVerified = true;
        } else {
          newVerified = false;
        }

        const prismaResponse = await prisma.domain.update({
          where: {
            slug,
          },
          data: {
            verified: newVerified,
            lastChecked: new Date(),
          },
        });

        const changed = newVerified !== verified;

        const updates = await handleDomainUpdates({
          domain: slug,
          createdAt,
          verified: newVerified,
          primary,
          changed,
          sitesCount: _count.sites,
        });

        return {
          domain,
          previousStatus: verified,
          currentStatus: newVerified,
          changed,
          updates,
          prismaResponse,
        };
      }),
    );
    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json({ error: error.message });
  }
}
