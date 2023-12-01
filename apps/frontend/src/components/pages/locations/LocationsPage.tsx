"use client";

import ModuleWrap from "@/components/layout/wrap/module";
import { PageHeader } from "@/components/shared/PageHeader";
import { LocationShort, LocationsPagePayload, LocationsPayload } from "@/types";

import LocationsList from "./LocationsList";
import LocationsMap from "./LocationsMap";

interface LocationsPageProps {
  locations: LocationsPayload | null;
  pageData: LocationsPagePayload | null;
}

const LocationsPage: React.FC<LocationsPageProps> = ({
  locations,
  pageData,
}) => {
  return (
    <>
      {/* Page Header */}
      <PageHeader
        title={pageData?.header || "locations"}
        subtitle={pageData?.subheader || "locations Subtitle"}
      />
      <ModuleWrap>
        {/* Location Container */}
        <div className="relative h-screen w-full md:px-4 lg:grid lg:grid-cols-12 lg:gap-4">
          {/* Map */}
          <div className=" col-span-12 lg:col-span-7">
            <LocationsMap locations={locations as LocationShort[]} />
          </div>

          {/* Location List */}
          <div className="relative col-span-12 lg:col-span-5">
            <LocationsList locations={locations as LocationShort[]} />
          </div>
        </div>
      </ModuleWrap>
    </>
  );
};

export { LocationsPage };
