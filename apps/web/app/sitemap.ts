import { MetadataRoute } from "next";
import { headers } from "next/headers";

import { isHomeHostname } from "@/lib/constants";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const headersList = headers();
  let domain = headersList.get("host") as string;
  if (isHomeHostname(domain)) domain = "rivvi.io";

  return [
    {
      url: `https://${domain}`,
      lastModified: new Date(),
    },
    ...(domain === "rivvi.io"
      ? [
          {
            url: `https://${domain}/pricing`,
            lastModified: new Date(),
          },
        ]
      : []),
  ];
}
