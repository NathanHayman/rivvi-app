import "dotenv-flow/config";

import * as fs from "fs";
import * as Papa from "papaparse";

import prisma from "@/lib/prisma";

const index = 24000;
const siteClicks: { domain: string; key: string; clicks: string }[] = [];

async function main() {
  Papa.parse(fs.createReadStream("sql.csv", "utf-8"), {
    header: true,
    step: (result: {
      data: { domain: string; key: string; clicks: string };
    }) => {
      siteClicks.push(result.data);
    },
    complete: async () => {
      const sitesWithClicks = await prisma.site.findMany({
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
      console.table(siteClicks.slice(0, 50));

      const siteClicksToUpdate = siteClicks
        .filter((siteClick) => {
          const { domain, key } = siteClick;
          return sitesWithClicks.find(
            (site) => site.domain === domain && site.key === key,
          );
        })
        .slice(index, index + 1000);

      await Promise.all(
        siteClicksToUpdate.map((siteClick) => {
          const { domain, key, clicks } = siteClick;
          console.log(`Updating ${domain}/${key} with ${clicks} clicks.`);
          return prisma.site.update({
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
        `Done updating ${index} to ${index + siteClicksToUpdate.length} sites.`,
      );
    },
  });
}

main();
