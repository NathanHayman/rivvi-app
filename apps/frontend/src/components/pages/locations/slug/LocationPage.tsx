"use client";

import type { EncodeDataAttributeCallback } from "@sanity/react-loader/rsc";
import React from "react";

import type { LocationPayload } from "@/types";

interface LocationPageProps {
  data: LocationPayload | null;
  encodeDataAttribute?: EncodeDataAttributeCallback;
}

const LocationPage: React.FC<LocationPageProps> = ({
  data,
  encodeDataAttribute,
}) => {
  // Default to an empty object to allow previews on non-existent documents
  const { name } = data ?? {};

  return (
    <div>
      <h1>{name}</h1>
    </div>
  );
};

export { LocationPage };
