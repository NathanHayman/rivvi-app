import dynamic from "next/dynamic";
import { draftMode } from "next/headers";

import { ServicesPage } from "@/components/pages/services/ServicesPage";
import { loadServices, loadServicesPage } from "@/sanity/loader/loadQuery";
const ServicesPagePreview = dynamic(
  () => import("@/components/pages/services/ServicesPagePreview"),
);

export default async function ServicesRoute() {
  const { data: initial } = await loadServicesPage();
  const { data: servicesData } = await loadServices();

  if (draftMode().isEnabled) {
    return <ServicesPagePreview initial={initial as any} />;
  }

  return (
    <ServicesPage services={servicesData as any} pageData={initial as any} />
  );
}
