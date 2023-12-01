import { sendEmail } from "emails";
import DomainDeleted from "emails/domain-deleted";
import InvalidDomain from "emails/invalid-domain";

import { deleteDomainAndSites } from "@/lib/api/domains";
import { limiter } from "@/lib/cron";
import prisma from "@/lib/prisma";

export const handleDomainUpdates = async ({
  domain,
  createdAt,
  verified,
  primary,
  changed,
  sitesCount,
}: {
  domain: string;
  createdAt: Date;
  verified: boolean;
  primary: boolean;
  changed: boolean;
  sitesCount: number;
}) => {
  if (verified) return;

  const invalidDays = Math.floor(
    (new Date().getTime() - new Date(createdAt).getTime()) / (1000 * 3600 * 24),
  );

  // do nothing if domain is invalid for less than 14 days
  if (invalidDays < 14) return;

  const workspace = await prisma.workspace.findFirst({
    where: {
      domains: {
        some: {
          slug: domain,
        },
      },
    },
    select: {
      id: true,
      name: true,
      slug: true,
      sentEmails: true,
      usage: true,
      users: {
        select: {
          user: {
            select: {
              email: true,
            },
          },
        },
      },
    },
  });
  if (!workspace) {
    // await log({
    //   message: `Domain *${domain}* is invalid but not associated with any workspace, skipping.`,
    //   type: "cron",
    //   mention: true,
    // });
    return;
  }
  const workspaceSlug = workspace.slug;
  const sentEmails = workspace.sentEmails.map((email) => email.type);
  const emails = workspace.users.map((user) => user.user.email) as string[];

  // if domain is invalid for more than 30 days, check if we can delete it
  if (invalidDays >= 30) {
    // else, delete the domain
    return await Promise.allSettled([
      deleteDomainAndSites(domain).then(async () => {
        // check if there are any domains left for the workspace
        const remainingDomains = await prisma.domain.count({
          where: {
            workspaceId: workspace.id,
          },
        });
        // if the deleted domain was the only domain, delete the workspace as well
        if (remainingDomains === 0) {
          return prisma.workspace.delete({
            where: {
              slug: workspaceSlug,
            },
          });
          // if the deleted domain was primary, make another domain primary
        } else if (primary) {
          const anotherDomain = await prisma.domain.findFirst({
            where: {
              workspaceId: workspace.id,
            },
          });
          if (!anotherDomain) return;
          return prisma.domain.update({
            where: {
              slug: anotherDomain.slug,
            },
            data: {
              primary: true,
            },
          });
        }
      }),
      // log({
      //   message: `Domain *${domain}* has been invalid for > 30 days and ${
      //     sitesCount > 0 ? "has links but no link clicks" : "has no links"
      //   }, deleting.`,
      //   type: "cron",
      // }),
      emails.map((email) =>
        limiter.schedule(() =>
          sendEmail({
            subject: `Your domain ${domain} has been deleted`,
            email,
            react: DomainDeleted({
              email,
              domain,
              workspaceSlug,
            }),
          }),
        ),
      ),
    ]);
  }

  if (invalidDays >= 28) {
    const sentSecondDomainInvalidEmail = sentEmails.includes(
      "secondDomainInvalidEmail",
    );
    if (!sentSecondDomainInvalidEmail) {
      return sendDomainInvalidEmail({
        workspaceSlug,
        domain,
        invalidDays,
        emails,
        type: "second",
      });
    }
  }

  if (invalidDays >= 14) {
    const sentFirstDomainInvalidEmail = sentEmails.includes(
      "firstDomainInvalidEmail",
    );
    if (!sentFirstDomainInvalidEmail) {
      return sendDomainInvalidEmail({
        workspaceSlug,
        domain,
        invalidDays,
        emails,
        type: "first",
      });
    }
  }
  return;
};

const sendDomainInvalidEmail = async ({
  workspaceSlug,
  domain,
  invalidDays,
  emails,
  type,
}: {
  workspaceSlug: string;
  domain: string;
  invalidDays: number;
  emails: string[];
  type: "first" | "second";
}) => {
  return await Promise.allSettled([
    emails.map((email) =>
      limiter.schedule(() =>
        sendEmail({
          subject: `Your domain ${domain} needs to be configured`,
          email,
          react: InvalidDomain({
            email,
            domain,
            workspaceSlug,
            invalidDays,
          }),
        }),
      ),
    ),
    prisma.sentEmail.create({
      data: {
        workspace: {
          connect: {
            slug: workspaceSlug,
          },
        },
        type: `${type}DomainInvalidEmail`,
        user: {
          connect: {
            email: "user@example.com", // replace with the user's email
          },
        },
      },
    }),
  ]);
};
