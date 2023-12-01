import "dotenv-flow/config";

import prisma from "@/lib/prisma";

async function main() {
  const workspaces = await prisma.workspace.findMany({
    select: {
      slug: true,
      plan: true,
      usage: true,
      domains: {
        select: {
          slug: true,
        },
      },
      _count: {
        select: {
          funnels: true,
          domains: true,
        },
      },
    },
    orderBy: {
      usage: "desc",
    },
    take: 100,
  });
  console.table(
    workspaces.map((workspace) => ({
      ...workspace,
      domains: `${
        workspace.domains
          .slice(0, 2)
          .map((domain) => domain.slug)
          .join(", ") +
        (workspace.domains.length > 2
          ? `... ${workspace._count.domains - 2}+`
          : "")
      }`,
    })),
  );
}

main();
