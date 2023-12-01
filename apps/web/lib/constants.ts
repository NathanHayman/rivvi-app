// import type { Funnel as FunnelProps, Page as PageProps } from "@prisma/client";
export const PHUNQ_HEADERS = {
  headers: {
    "x-powered-by": "rivvi.io",
  },
};

export const HOME_HOSTNAMES = new Set([
  "rivvi.io",
  "home.localhost:8888",
  "localhost",
]);

export const isHomeHostname = (domain: string) => {
  return HOME_HOSTNAMES.has(domain) || domain.endsWith(".vercel.app");
};

export const ADMIN_WORKSPACE_ID = "cl7pj5kq4006835rbjlt2ofka";

export const FAVICON_FOLDER = "/_static/favicons";
export const GOOGLE_FAVICON_URL =
  "https://www.google.com/s2/favicons?sz=64&domain_url=";

export const SHOW_BACKGROUND_SEGMENTS = [
  "tools",
  "pricing",
  "help",
  "features",
  "customers",
  "blog",
  "(blog-post)",
  "login",
  "register",
  "auth",
];

// export const PHUNQ_LOGO = "https://d2vwwcvoksz7ty.cloudfront.net/logo.png";
// export const PHUNQ_THUMBNAIL = "https://d2vwwcvoksz7ty.cloudfront.net/thumbnail.png";

// export const SHOW_BACKGROUND_SEGMENTS = [
//   "tools",
//   "pricing",
//   "help",
//   "features",
//   "customers",
//   "blog",
//   "(blog-post)",
//   "login",
//   "register",
//   "auth",
// ];

export const allTools = ["metatags", "inspector"];

export const SECOND_LEVEL_DOMAINS = new Set([
  "com",
  "co",
  "net",
  "org",
  "edu",
  "gov",
  "in",
]);

export const SPECIAL_APEX_DOMAINS = new Set([
  "my.id",
  "github.io",
  "vercel.app",
  "now.sh",
  "pages.dev",
  "webflow.io",
  "netlify.app",
  "fly.dev",
  "web.app",
]);

export const FRAMER_MOTION_LIST_ITEM_VARIANTS = {
  hidden: { scale: 0.8, opacity: 0 },
  show: { scale: 1, opacity: 1, transition: { type: "spring" } },
};

export const STAGGER_CHILD_VARIANTS = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, type: "spring" } },
};

export const SWIPE_REVEAL_ANIMATION_SETTINGS = {
  initial: { height: 0 },
  animate: { height: "auto" },
  exit: { height: 0 },
  transition: { duration: 0.15, ease: "easeOut" },
};

export const FADE_IN_ANIMATION_SETTINGS = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 },
};

export const PAGINATION_LIMIT = 100;

// @ts-expect-error because we're coercing the type here
export const DEFAULT_FUNNEL_PROPS: FunnelProps = {
  id: "",
  domain: "",

  key: null, // Unique slug for the funnel
  rootPath: null, // Represents the root path of the funnel on its associated domain

  published: false, // Indicates if the funnel is published
  archived: false, // Indicates if the funnel is archived

  title: "",
  description: null,
  logo: null,
  font: "Inter",
  image: null,
  imageBlurhash: null,
  message404: null,

  createdAt: new Date(),
  updatedAt: new Date(),

  // Relations
  // Note: Actual instances of related models or their IDs would be used in a real object,
  // but for default props, you might leave them as null or undefined and fill them in as needed.
  workspaceDomain: null,
  workspaceId: "",
  workspace: null,
  pages: [],
};

export const DEFAULT_PAGE_PROPS = {
  id: "",
  type: "custom",
  relationType: "standalone",
  domain: null,
  sanityDocumentId: null,
  slug: null,
  rootPath: null,
  published: false,
  archived: false,
  title: "",
  description: null,
  content: null,
  image: null,
  imageBlurhash: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  workspace: null,
  workspaceId: "",
  site: null,
  siteId: null,
  siteDomain: null,
  siteDomainSlug: null,
};
