import { createClient, type SanityClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "@/sanity/lib/api";
import { allRedirectsQuery } from "@/sanity/lib/queries";
import { RedirectsPayload } from "@/types";

// create a client instance without preview mode
export function getClient(): SanityClient {
  return createClient({
    projectId,
    dataset,
    apiVersion,
    // useCdn === true, gives fast, cheap responses using a globally distributed cache.
    // Set this to `false` if your application require the freshest possible
    // data always (potentially slightly slower and a bit more expensive).
    // see: https://www.sanity.io/docs/api-cdn
  });
}

export async function getRedirects() {
  const client = getClient();
  const data = await client.fetch<RedirectsPayload | null>(allRedirectsQuery, {
    next: { revalidate: 1 },
  });

  const redirects = data?.redirects || [];

  if (!redirects) {
    throw new Error("Redirects not found");
  }

  return redirects;
}
