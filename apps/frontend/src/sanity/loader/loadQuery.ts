import "server-only";

import { draftMode } from "next/headers";

import { client } from "@/sanity/lib/client";
import {
  aboutPageQuery,
  aboutQuery,
  homePageQuery,
  locationQuery,
  locationsPaqeQuery,
  locationsQuery,
  memberQuery,
  membersPageQuery,
  membersQuery,
  pagesBySlugQuery,
  projectBySlugQuery,
  serviceQuery,
  servicesPageQuery,
  servicesQuery,
  settingsQuery,
} from "@/sanity/lib/queries";
import { token } from "@/sanity/lib/token";
import {
  AboutPagePayload,
  AboutPayload,
  HomePagePayload,
  LocationPayload,
  LocationsPagePayload,
  LocationsPayload,
  MemberPayload,
  MembersPagePayload,
  MembersPayload,
  PagePayload,
  ProjectPayload,
  ServicePayload,
  ServicesPagePayload,
  ServicesPayload,
  SettingsPayload,
} from "@/types";

import { queryStore } from "./createQueryStore";

const serverClient = client.withConfig({
  token,
  stega: {
    // Enable stega if it's a Vercel preview deployment, as the Vercel Toolbar has controls that shows overlays
    enabled: process.env.VERCEL_ENV !== "production",
  },
});

/**
 * Sets the server client for the query store, doing it here ensures that all data fetching in production
 * happens on the server and not on the client.
 * Live mode in `sanity/presentation` still works, as it uses the `useLiveMode` hook to update `useQuery` instances with
 * live draft content using `postMessage`.
 */
queryStore.setServerClient(serverClient);

const usingCdn = serverClient.config().useCdn;
// Automatically handle draft mode
export const loadQuery = ((query, params = {}, options = {}) => {
  const {
    perspective = draftMode().isEnabled ? "previewDrafts" : "published",
  } = options;
  // Don't cache by default
  let cache: RequestCache = "no-store";
  // If `next.tags` is set, and we're not using the CDN, then it's safe to cache
  if (!usingCdn && Array.isArray(options.next?.tags)) {
    cache = "force-cache";
  }
  return queryStore.loadQuery(query, params, {
    cache,
    ...options,
    perspective,
  });
}) satisfies typeof queryStore.loadQuery;

/**
 * Loaders that are used in more than one place are declared here, otherwise they're colocated with the component
 */

export function loadSettings() {
  return loadQuery<SettingsPayload>(
    settingsQuery,
    {},
    { next: { tags: ["settings", "home", "page"] } },
  );
}

// Services

export function loadServicesPage() {
  return loadQuery<ServicesPagePayload | null>(
    servicesPageQuery,
    { slug: "services" },
    { next: { tags: ["page:services"] } },
  );
}

export function loadServices() {
  return loadQuery<ServicesPayload | null>(
    servicesQuery,
    { slug: "services" },
    { next: { tags: ["page:services"] } },
  );
}

export function loadService(slug: string) {
  return loadQuery<ServicePayload | null>(
    serviceQuery,
    { slug },
    { next: { tags: [`service:${slug}`] } },
  );
}

// Locations

export function loadLocationsPage() {
  return loadQuery<LocationsPagePayload | null>(
    locationsPaqeQuery,
    { slug: "locations" },
    { next: { tags: ["page:locations"] } },
  );
}

export function loadLocations() {
  return loadQuery<LocationsPayload | null>(
    locationsQuery,
    { slug: "locations" },
    { next: { tags: ["page:locations"] } },
  );
}

export function loadLocation(slug: string) {
  return loadQuery<LocationPayload | null>(
    locationQuery,
    { slug },
    { next: { tags: [`location:${slug}`] } },
  );
}

// Members

export function loadMembersPage() {
  return loadQuery<MembersPagePayload | null>(
    membersPageQuery,
    { slug: "members" },
    { next: { tags: ["page:members"] } },
  );
}

export function loadMembers() {
  return loadQuery<MembersPayload | null>(
    membersQuery,
    { slug: "members" },
    { next: { tags: ["page:members"] } },
  );
}

export function loadMember(slug: string) {
  return loadQuery<MemberPayload | null>(
    memberQuery,
    { slug },
    { next: { tags: [`member:${slug}`] } },
  );
}

// About

export function loadAboutPage() {
  return loadQuery<AboutPagePayload | null>(
    aboutPageQuery,
    { slug: "about" },
    { next: { tags: ["page:about"] } },
  );
}

export function loadAbout() {
  return loadQuery<AboutPayload | null>(
    aboutQuery,
    { slug: "about" },
    { next: { tags: ["page:about"] } },
  );
}

export function loadHomePage() {
  return loadQuery<HomePagePayload | null>(
    homePageQuery,
    {},
    { next: { tags: ["home", "page"] } },
  );
}

export function getPageSeo(slug: string) {
  return loadQuery<PagePayload | null>(
    pagesBySlugQuery,
    { slug },
    { next: { tags: [`page:${slug}`] } },
  );
}

export function loadProject(slug: string) {
  return loadQuery<ProjectPayload | null>(
    projectBySlugQuery,
    { slug },
    { next: { tags: [`project:${slug}`] } },
  );
}

export function loadPage(slug: string) {
  return loadQuery<PagePayload | null>(
    pagesBySlugQuery,
    { slug },
    { next: { tags: [`page:${slug}`] } },
  );
}
