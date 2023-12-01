"use client";

import { type QueryResponseInitial } from "@sanity/react-loader/rsc";

import { locationQuery } from "@/sanity/lib/queries";
import { useQuery } from "@/sanity/loader/useQuery";
import { LocationPayload } from "@/types";

import { LocationPage } from "./LocationPage";

type Props = {
  params: { slug: string };
  initial: QueryResponseInitial<LocationPayload | null>;
};

export default function LocationPagePreview(props: Props) {
  const { params, initial } = props;
  const { data, encodeDataAttribute } = useQuery<LocationPayload | null>(
    locationQuery,
    params,
    { initial },
  );

  return (
    <LocationPage data={data!} encodeDataAttribute={encodeDataAttribute} />
  );
}
