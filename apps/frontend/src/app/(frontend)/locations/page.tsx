import dynamic from "next/dynamic";
import { draftMode } from "next/headers";

import { LocationsPage } from "@/components/pages/locations/LocationsPage";
import { loadLocations, loadLocationsPage } from "@/sanity/loader/loadQuery";
const LocationsPagePreview = dynamic(
  () => import("@/components/pages/locations/LocationsPagePreview"),
);

export default async function LocationsRoute() {
  const { data: initial } = await loadLocationsPage();
  const { data: locationsData } = await loadLocations();

  if (draftMode().isEnabled) {
    return <LocationsPagePreview initial={initial as any} />;
  }

  return (
    <LocationsPage locations={locationsData as any} pageData={initial as any} />
  );
}
