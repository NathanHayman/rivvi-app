import "server-only";

import type { QueryParams } from "@sanity/client";
import { createClient } from "next-sanity";

import {
  getAllPageDocIdsQuery,
  homeDocIdQuery,
  pageDocIdBySlugQuery,
} from "./queries";
import type { HomeDocIdPayload } from "./types";

// export const token = process.env.SANITY_API_READ_TOKEN;

const DEFAULT_PARAMS = {} as QueryParams;
const DEFAULT_TAGS = [] as string[];

export async function sanityFetch<QueryResponse>({
  query,
  params = DEFAULT_PARAMS,
  tags = DEFAULT_TAGS,
  studioKey,
  token,
}: {
  query: string;
  params?: QueryParams;
  tags: string[];
  studioKey?: string;
  token?: string;
}): Promise<QueryResponse> {
  const client = createClient({
    projectId: studioKey as string,
    dataset: "production",
    apiVersion: "2023-06-21",
    useCdn: false,
    perspective: "published",
  });
  const sanityClient = client.config().useCdn
    ? client.withConfig({ useCdn: false })
    : client;
  return sanityClient.fetch<QueryResponse>(query, params, {
    // We only cache if there's a revalidation webhook setup
    cache: "no-store",
    token: token,
    perspective: "published",
    next: {
      revalidate: 10,
      tags,
    },
  });
}

export function getPageDocIdBySlug(slug: string) {
  return sanityFetch<any | null>({
    query: pageDocIdBySlugQuery,
    params: { slug },
    tags: [`page:${slug}`],
  });
}

export function getAllPageDocIds(studioKey: string, studioTokenEditor: string) {
  return sanityFetch<any>({
    query: getAllPageDocIdsQuery,
    params: {},
    tags: [`pages`],
    studioKey,
    token: studioTokenEditor,
  });
}

export function getHomeDocIdBySlug(slug: string) {
  return sanityFetch<HomeDocIdPayload | null>({
    query: homeDocIdQuery,
    params: { slug },
    tags: [`page:${slug}`],
  });
}
