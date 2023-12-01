import "dotenv-flow/config";

import prisma from "@/lib/prisma";

async function main() {
  const [users, count] = await Promise.all([
    prisma.user.findMany({
      where: {
        workspaces: {
          none: {},
        },
      },
      select: {
        email: true,
        createdAt: true,
        _count: {
          select: {
            workspaces: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
      take: 100,
    }),
    prisma.user.count({
      where: {
        workspaces: {
          none: {},
        },
      },
    }),
  ]);
  // log in table format
  console.table(users);
  console.log(`Total: ${count}`);
}

main();
