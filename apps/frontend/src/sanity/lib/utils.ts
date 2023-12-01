import createImageUrlBuilder from "@sanity/image-url";
import type { Image } from "sanity";

import { dataset, projectId } from "@/sanity/lib/api";

const imageBuilder = createImageUrlBuilder({
  projectId: projectId || "",
  dataset: dataset || "",
});

export const urlForImage = (source: Image | undefined) => {
  // Ensure that source image contains a valid reference
  if (!source?.asset?._ref) {
    return undefined;
  }

  return imageBuilder?.image(source).auto("format").fit("max");
};

export function urlForOpenGraphImage(image: Image | undefined) {
  return urlForImage(image)?.width(1200).height(627).fit("crop").url();
}

export function resolveHref(
  documentType?: string,
  slug?: string,
): string | undefined {
  switch (documentType) {
    case "settings":
      return "/";
    case "home":
      return "/";
    case "page":
      return slug ? `/${slug}` : undefined;
    case "project":
      return slug ? `/projects/${slug}` : undefined;
    case "about":
      return "/about";
    case "contact":
      return "/contact";
    case "careers":
      return "/careers";
    case "patientCenter":
      return "/patient-center";
    case "reference":
      return slug ? `/${slug}` : undefined;
    case "linkReference":
      return slug ? `/${slug}` : undefined;
    case "location":
      return slug ? `/locations/${slug}` : undefined;
    case "member":
      return slug ? `/members/${slug}` : undefined;
    case "service":
      return slug ? `/services/${slug}` : undefined;
    case "post":
      return slug ? `/news/${slug}` : undefined;
    case "news":
      return "/news";
    case "members":
      return "/members";
    case "locations":
      return "/locations";
    case "services":
      return "/services";
    default:
      console.warn("Invalid document type:", documentType);
      return undefined;
  }
}
