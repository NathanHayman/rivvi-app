"use client";

import { type QueryResponseInitial } from "@sanity/react-loader/rsc";

import { locationsPaqeQuery, locationsQuery } from "@/sanity/lib/queries";
import { useQuery } from "@/sanity/loader/useQuery";
import { LocationsPagePayload, LocationsPayload } from "@/types";

import { LocationsPage } from "./LocationsPage";

type Props = {
  initial: QueryResponseInitial<LocationsPayload | null>;
};

export default function LocationsPagePreview(props: Props) {
  const { initial } = props;
  const { data, encodeDataAttribute } = useQuery<LocationsPayload | null>(
    locationsQuery,
    {},
    { initial: initial as QueryResponseInitial<LocationsPayload | null> },
  );

  const { data: pageData } = useQuery<LocationsPagePayload | null>(
    locationsPaqeQuery,
    {},
    { initial: initial as QueryResponseInitial<LocationsPagePayload | null> },
  );

  if (!data || !pageData) {
    return (
      <div className="text-center">
        Please start editing your locations document to see the preview!
      </div>
    );
  }

  return <LocationsPage locations={data as any} pageData={pageData as any} />;
}
