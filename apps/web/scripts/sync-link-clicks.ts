import "dotenv-flow/config";

import * as fs from "fs";
import * as Papa from "papaparse";

import prisma from "@/lib/prisma";

const index = 24000;
const funnelClicks: { domain: string; key: string; clicks: string }[] = [];

async function main() {
  Papa.parse(fs.createReadStream("sql.csv", "utf-8"), {
    header: true,
    step: (result: {
      data: { domain: string; key: string; clicks: string };
    }) => {
      funnelClicks.push(result.data);
    },
    complete: async () => {
      const funnelsWithClicks = await prisma.funnel.findMany({
        where: {
          clicks: {
            gt: 0,
          },
        },
        select: {
          domain: true,
          key: true,
        },
      });
      console.table(funnelClicks.slice(0, 50));

      const funnelClicksToUpdate = funnelClicks
        .filter((funnelClick) => {
          const { domain, key } = funnelClick;
          return funnelsWithClicks.find(
            (funnel) => funnel.domain === domain && funnel.key === key,
          );
        })
        .slice(index, index + 1000);

      await Promise.all(
        funnelClicksToUpdate.map((funnelClick) => {
          const { domain, key, clicks } = funnelClick;
          console.log(`Updating ${domain}/${key} with ${clicks} clicks.`);
          return prisma.funnel.update({
            where: {
              domain_key: {
                domain,
                key,
              },
            },
            data: {
              clicks: parseInt(clicks),
            },
          });
        }),
      );

      console.log(
        `Done updating ${index} to ${
          index + funnelClicksToUpdate.length
        } funnels.`,
      );
    },
  });
}

main();
