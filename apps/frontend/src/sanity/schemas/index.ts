// Rich text annotations used in the block content editor
import annotationLinkEmail from "./annotations/linkEmail";
import annotationLinkExternal from "./annotations/linkExternal";
import annotationLinkInternal from "./annotations/linkInternal";

const annotations = [
  annotationLinkEmail,
  annotationLinkExternal,
  annotationLinkInternal,
];

/* -------- Document Types -------- */
import footer from "./documents/footer";
import header from "./documents/header";
import insurance from "./documents/insurance";
import location from "./documents/location";
import provider from "./documents/member";
import modal from "./documents/modal";
import page from "./documents/page";
import post from "./documents/post";
import service from "./documents/service";

const documents = [
  page,
  header,
  footer,
  modal,
  project,
  post,
  service,
  insurance,
  location,
  provider,
];

/* -------- Object Types -------- */
import linkAction from "./annotations/linkAction";
import noModules from "./blocks/no-modules";
import project from "./documents/project";
import cta from "./objects/cta";
import duration from "./objects/duration";
import faq from "./objects/faq";
import footerColumn from "./objects/footer/footerColumn";
import linkExternal from "./objects/global/linkExternal";
import linkInternal from "./objects/global/linkInternal";
import linkReference from "./objects/global/linkReference";
import links from "./objects/global/links";
import notFoundPage from "./objects/global/notFoundPage";
import hero from "./objects/hero";
import homeMembers from "./objects/homeMembers";
import milestone from "./objects/milestone";
import moduleAccordion from "./objects/module/accordion";
import accordionBody from "./objects/module/accordionBody";
import accordionGroup from "./objects/module/accordionGroup";
import moduleCallout from "./objects/module/callout";
import moduleCallToAction from "./objects/module/callToAction";
import moduleContentAll from "./objects/module/contentAll";
import moduleContentImage from "./objects/module/contentImage";
import moduleContentPlain from "./objects/module/contentPlain";
import moduleGrid from "./objects/module/grid";
import gridItems from "./objects/module/gridItem";
import headerHome from "./objects/module/header/home";
import moduleHeading from "./objects/module/header/module";
import headerPage from "./objects/module/header/page";
import headerVideo from "./objects/module/header/video";
import moduleImage from "./objects/module/image";
import moduleImageAction from "./objects/module/imageCallToAction";
import moduleImages from "./objects/module/images";
import moduleInstagram from "./objects/module/instagram";
import patientForm from "./objects/patientForm";
import redirect from "./objects/redirect";
import review from "./objects/review";
import section from "./objects/section";
import seoDescription from "./objects/seo/description";
import seoHome from "./objects/seo/home";
import seoPage from "./objects/seo/page";
import seo from "./objects/seo/seo";
import shortBlock from "./objects/shortBlock";
import timeline from "./objects/timeline";

const objects = [
  links,
  linkAction,
  linkExternal,
  linkInternal,
  linkReference,
  notFoundPage,
  headerHome,
  headerPage,
  headerVideo,
  moduleAccordion,
  accordionBody,
  accordionGroup,
  footerColumn,
  moduleCallout,
  moduleCallToAction,
  moduleContentAll,
  moduleContentImage,
  moduleContentPlain,
  moduleGrid,
  gridItems,
  milestone,
  moduleImage,
  moduleImageAction,
  moduleImages,
  moduleInstagram,
  moduleHeading,
  section,
  seo,
  seoHome,
  seoPage,
  seoDescription,
  timeline,
  duration,
  redirect,
  cta,
  faq,
  hero,
  homeMembers,
  patientForm,
  review,
  shortBlock,
];

/* -------- Singleton Types -------- */
import about from "./singletons/about";
import author from "./singletons/author";
import careers from "./singletons/careers";
import category from "./singletons/category";
import contact from "./singletons/contact";
import home from "./singletons/home";
import locations from "./singletons/locations";
import members from "./singletons/members";
import news from "./singletons/news";
import patientCenter from "./singletons/patientCenter";
import services from "./singletons/services";
import serviceType from "./singletons/serviceType";
import settings from "./singletons/settings";

const singletons = [
  settings,
  home,
  about,
  author,
  careers,
  category,
  contact,
  locations,
  members,
  news,
  patientCenter,
  services,
  serviceType,
];

// Block content
import body from "./blocks/body";
import videoText from "./blocks/video-text";
import blockContent from "./objects/blockContent";

const blocks = [body, videoText, noModules, blockContent];

// Object types
// import footer from './objects/global/footer';

export const schemaTypes = [
  ...annotations,
  ...singletons,
  ...objects,
  ...blocks,
  ...documents,
];
