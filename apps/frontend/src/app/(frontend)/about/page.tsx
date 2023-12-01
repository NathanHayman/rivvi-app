import dynamic from "next/dynamic";
import { draftMode } from "next/headers";

import { AboutPage } from "@/components/pages/about/AboutPage";
import { loadAbout, loadAboutPage } from "@/sanity/loader/loadQuery";
const AboutPagePreview = dynamic(
  () => import("@/components/pages/about/AboutPagePreview"),
);

export default async function AboutRoute() {
  const { data: initial } = await loadAboutPage();
  const { data: aboutData } = await loadAbout();

  if (draftMode().isEnabled) {
    return <AboutPagePreview initial={initial as any} />;
  }

  return <AboutPage data={aboutData as any} pageData={initial as any} />;
}
