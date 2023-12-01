"use client";

import type { EncodeDataAttributeCallback } from "@sanity/react-loader/rsc";
import Link from "next/link";
import React from "react";

import { resolveHref } from "@/sanity/lib/utils";
import { LocationShort } from "@/types";

import LocationCard from "./LocationCard";

interface LocationsListProps {
  locations: LocationShort[];
  encodeDataAttribute?: EncodeDataAttributeCallback;
}

const LocationsList: React.FC<LocationsListProps> = ({
  locations,
  encodeDataAttribute,
}) => {
  if (!locations) {
    return null;
  }
  return (
    <ul className="lg:h-[700px] lg:space-y-4 lg:overflow-y-scroll">
      {locations.map((location, key) => {
        const href = resolveHref("location", location.slug);
        if (!href) {
          return null;
        }
        return (
          <Link
            key={key}
            href={href}
            data-sanity={encodeDataAttribute?.(["locations", key, "slug"])}
          >
            <li className="flex flex-col items-center rounded-lg border border-gray-200 bg-white shadow dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 md:max-w-xl md:flex-row">
              <LocationCard location={location} />
            </li>
          </Link>
        );
      })}
    </ul>
  );
};

export default LocationsList;
