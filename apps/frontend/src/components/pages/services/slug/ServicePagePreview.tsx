"use client";

import { type QueryResponseInitial } from "@sanity/react-loader/rsc";

import { serviceQuery } from "@/sanity/lib/queries";
import { useQuery } from "@/sanity/loader/useQuery";
import { ServicePayload } from "@/types";

import ServicePage from "./ServicePage";

type Props = {
  params: { slug: string };
  initial: QueryResponseInitial<ServicePayload | null>;
};

export default function ServicePagePreview(props: Props) {
  const { params, initial } = props;
  const { data, encodeDataAttribute } = useQuery<ServicePayload | null>(
    serviceQuery,
    params,
    { initial },
  );

  return <ServicePage data={data!} encodeDataAttribute={encodeDataAttribute} />;
}
