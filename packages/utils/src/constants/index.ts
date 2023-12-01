export const LOCALHOST_GEO_DATA = {
  city: "Las Vegas",
  region: "NV",
  country: "US",
  latitude: "36.17497",
  longitude: "-115.13722",
};
export const LOCALHOST_IP = "70.180.136.230";

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

export const HOME_DOMAIN = "https://rivvi.io";

export const APP_HOSTNAMES = new Set([
  "app.rivvi.io",
  "preview.rivvi.io",
  "localhost:8888",
  "localhost",
]);

export const APP_DOMAIN =
  process.env.NEXT_PUBLIC_VERCEL_ENV === "production"
    ? "https://app.rivvi.io"
    : process.env.NEXT_PUBLIC_VERCEL_ENV === "preview"
      ? "https://preview.rivvi.io"
      : "http://localhost:8888";

export const ADMIN_HOSTNAMES = new Set([
  "admin.rivvi.io",
  "admin.localhost:8888",
]);

export const DEFAULT_REDIRECTS = {
  home: "https://rivvi.io",
  dub: "https://rivvi.io",
  signin: "https://app.rivvi.io/login",
  login: "https://app.rivvi.io/login",
  register: "https://app.rivvi.io/register",
  signup: "https://app.rivvi.io/register",
  app: "https://app.rivvi.io",
  dashboard: "https://app.rivvi.io",
  links: "https://app.rivvi.io/links",
  settings: "https://app.rivvi.io/settings",
  welcome: "https://app.rivvi.io/welcome",
  discord: "https://twitter.com/asedf", // placeholder for now
};

export const PHUNQ_HEADERS = {
  headers: {
    "x-powered-by": "rivvi.io, the better way to build pages",
  },
};
export const FAVICON_FOLDER = "/_static/favicons";
export const GOOGLE_FAVICON_URL =
  "https://www.google.com/s2/favicons?sz=64&domain_url=";

export const PHUNQ_LOGO = "https://d2vwwcvoksz7ty.cloudfront.net/logo.png";
export const PHUNQ_THUMBNAIL =
  "https://d2vwwcvoksz7ty.cloudfront.net/thumbnail.png";

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

export const ALL_TOOLS = [
  { name: "Metatags API", slug: "metatags" },
  { name: "Link Inspector", slug: "inspector" },
];

export { default as ccTLDs } from "./cctlds";
export { default as COUNTRIES } from "./countries";

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

export const PHUNQ_ADMIN_ID = "cl7pj5kq4006835rbjlt2ofka";
