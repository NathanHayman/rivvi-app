//

import { createClient, type SanityClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "@/sanity/lib/api";
import {
  getAllLocations,
  getAllMembers,
  getAllPages,
  getAllPosts,
} from "@/sanity/lib/queries";

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

export async function getAllRoutes() {
  const client = getClient();
  const allPosts = await client.fetch(getAllPosts);
  const allMembers = await client.fetch(getAllMembers);
  const allLocations = await client.fetch(getAllLocations);
  const allPages = await client.fetch(getAllPages);
  const allRoutes = [
    ...allPosts.map((slug: string) => `/news/${slug}`),
    ...allMembers.map((slug: string) => `/providers/${slug}`),
    ...allLocations.map((slug: string) => `/locations/${slug}`),
    ...allPages.map((slug: string) => `/${slug}`),
  ];
  return allRoutes;
}
