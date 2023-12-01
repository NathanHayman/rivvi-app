import {
  getAdjustedBillingCycleStart,
  linkConstructor,
  log,
} from "@phunq/utils";
import { sendEmail } from "emails";
import ClicksSummary from "emails/clicks-summary";
import UsageExceeded from "emails/usage-exceeded";

import { limiter } from "@/lib/cron";
import prisma from "@/lib/prisma";
import { getStats } from "@/lib/stats";
import { WorkspaceProps } from "@/lib/types";

export const updateUsage = async () => {
  const workspaces = await prisma.workspace.findMany({
    where: {
      domains: {
        some: {
          verified: true,
        },
      },
    },
    select: {
      id: true,
      name: true,
      slug: true,
      usage: true,
      usageLimit: true,
      plan: true,
      billingCycleStart: true,
      users: {
        select: {
          user: true,
        },
      },
      domains: {
        where: {
          verified: true,
        },
      },
      sentEmails: true,
      createdAt: true,
    },
  });

  // Reset billing cycles for workspaces that:
  // - Are not on the free plan
  // - Are on the free plan but have not exceeded usage
  // - Have adjustedBillingCycleStart that matches today's date
  const billingReset = workspaces.filter(
    ({ usage, usageLimit, plan, billingCycleStart }) =>
      !(plan === "free" && usage > usageLimit) &&
      getAdjustedBillingCycleStart(billingCycleStart as number) ===
        new Date().getDate(),
  );

  // Get all workspaces that have exceeded usage
  const exceedingUsage = workspaces.filter(
    ({ usage, usageLimit }) => usage > usageLimit,
  );

  // Send email to notify overages
  const notifyOveragesResponse = await Promise.allSettled(
    exceedingUsage.map(async (workspace) => {
      const { name, usage, usageLimit, users, sentEmails } = workspace;
      const emails = users.map((user) => user.user.email) as string[];

      await log({
        message: `${name} is over usage limit. Usage: ${usage}, Limit: ${usageLimit}, Email: ${emails.join(
          ", ",
        )}`,
        type: "cron",
        mention: true,
      });
      const sentFirstUsageLimitEmail = sentEmails.some(
        (email) => email.type === ("firstUsageLimitEmail" as any),
      );
      if (!sentFirstUsageLimitEmail) {
        // @ts-ignore
        sendUsageLimitEmail(emails, workspace, "first");
      } else {
        const sentSecondUsageLimitEmail = sentEmails.some(
          (email) => email.type === ("secondUsageLimitEmail" as any),
        );
        if (!sentSecondUsageLimitEmail) {
          const daysSinceFirstEmail = Math.floor(
            (new Date().getTime() -
              new Date(sentEmails[0].createdAt).getTime()) /
              (1000 * 3600 * 24),
          );
          if (daysSinceFirstEmail >= 3) {
            // @ts-ignore
            sendUsageLimitEmail(emails, workspace, "second");
          }
        }
      }
    }),
  );

  // Reset usage for workspaces that have billingCycleStart today
  // also delete sentEmails for those workspaces
  const resetBillingResponse = await Promise.allSettled(
    billingReset.map(async (workspace) => {
      // Only send the 30-day summary email if the workspace was created more than 30 days ago
      if (
        workspace.createdAt.getTime() <
        new Date().getTime() - 30 * 24 * 60 * 60 * 1000
      ) {
        const [createdSite, topSites] = await Promise.allSettled([
          prisma.site.count({
            where: {
              workspace: {
                id: workspace.id,
              },
              createdAt: {
                // in the last 30 days
                gte: new Date(new Date().setDate(new Date().getDate() - 30)),
              },
            },
          }),
          workspace.usage > 0
            ? getStats({
                domain: workspace.domains
                  .map((domain) => domain.slug)
                  .join(","),
                endpoint: "top_sites",
                interval: "30d",
              }).then((data) =>
                data
                  .slice(0, 5)
                  .map(
                    ({
                      domain,
                      key,
                      clicks,
                    }: {
                      domain: string;
                      key: string;
                      clicks: number;
                    }) => ({
                      site: linkConstructor({ domain, key, pretty: true }),
                      clicks,
                    }),
                  ),
              )
            : [],
        ]);

        const emails = workspace.users.map(
          (user) => user.user.email,
        ) as string[];

        await Promise.allSettled(
          emails.map((email) => {
            limiter.schedule(() =>
              sendEmail({
                subject: `Your 30-day Rivvi summary for ${workspace.name}`,
                email,
                react: ClicksSummary({
                  email,
                  workspaceName: workspace.name,
                  workspaceSlug: workspace.slug,
                  totalClicks: workspace.usage,
                  createdSites:
                    createdSite.status === "fulfilled" ? createdSite.value : 0,
                  topSites:
                    createdSite.status === "fulfilled"
                      ? topSites.status === "fulfilled"
                        ? topSites.value
                        : []
                      : [],
                  createdSite:
                    createdSite.status === "fulfilled" ? createdSite.value : 0,
                } as {
                  email: string;
                  workspaceName: string;
                  workspaceSlug: string;
                  totalClicks: number;
                  createdSites: number;
                  topSites: { site: string; clicks: number }[];
                  createdSite: number;
                }),
              }),
            );
          }),
        );
      }

      return await prisma.workspace.update({
        where: {
          id: workspace.id,
        },
        data: {
          usage: 0,
          sentEmails: {
            deleteMany: {
              type: {
                in: ["firstUsageLimitEmail", "secondUsageLimitEmail"] as any,
              },
            },
          },
        },
      });
    }),
  );

  return {
    billingReset,
    exceedingUsage,
    notifyOveragesResponse,
    resetBillingResponse,
  };
};

const sendUsageLimitEmail = async (
  emails: string[],
  workspace: WorkspaceProps,
  type: "first" | "second",
) => {
  return await Promise.allSettled([
    emails.map((email) => {
      limiter.schedule(() =>
        sendEmail({
          subject: `You have exceeded your Rivvi usage limit`,
          email,
          react: UsageExceeded({
            email,
            workspace,
            type,
          }),
        }),
      );
    }),
    prisma.sentEmail.create({
      data: {
        workspace: {
          connect: {
            slug: workspace.slug,
          },
        },
        type: `${type}UsageLimitEmail` as any,
        user: {
          connect: {
            email: emails[0],
          },
        },
      },
    }),
  ]);
};
