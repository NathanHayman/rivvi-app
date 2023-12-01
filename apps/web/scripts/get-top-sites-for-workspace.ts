import "dotenv-flow/config";

import prisma from "@/lib/prisma";
import { getStats } from "@/lib/stats";

import { linkConstructor } from "./utils";

async function main() {
  const workspace = await prisma.workspace.findUnique({
    where: {
      slug: "phunq",
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
  if (!workspace) {
    console.log("No workspace found");
    return;
  }
  const topFunnels = await getStats({
    domain: workspace.domains.map((domain) => domain.slug).join(","),
    endpoint: "top_funnels",
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
          funnel: linkConstructor({ domain, key, pretty: true }),
          clicks,
        }),
      ),
  );

  console.table(topFunnels);
}

main();
