"use client";

import type { EncodeDataAttributeCallback } from "@sanity/react-loader/rsc";
import React from "react";

import type { MemberPayload } from "@/types";

interface MemberPageProps {
  data: MemberPayload | null;
  encodeDataAttribute?: EncodeDataAttributeCallback;
}

const MemberPage: React.FC<MemberPageProps> = ({
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

export { MemberPage };
