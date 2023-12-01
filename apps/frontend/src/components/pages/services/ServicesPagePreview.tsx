"use client";

import { type QueryResponseInitial } from "@sanity/react-loader/rsc";

import { servicesPageQuery, servicesQuery } from "@/sanity/lib/queries";
import { useQuery } from "@/sanity/loader/useQuery";
import { ServicesPagePayload, ServicesPayload } from "@/types";

import ServicesPage from "./ServicesPage";

type Props = {
  initial: QueryResponseInitial<ServicesPayload | null>;
};

export default function ServicesPagePreview(props: Props) {
  const { initial } = props;
  const { data, encodeDataAttribute } = useQuery<ServicesPayload | null>(
    servicesQuery,
    {},
    { initial: initial as QueryResponseInitial<ServicesPayload | null> },
  );

  const { data: pageData } = useQuery<ServicesPagePayload | null>(
    servicesPageQuery,
    {},
    { initial: initial as QueryResponseInitial<ServicesPagePayload | null> },
  );

  if (!data || !pageData) {
    return (
      <div className="text-center">
        Please start editing your Services document to see the preview!
      </div>
    );
  }

  return <ServicesPage services={data as any} pageData={pageData as any} />;
}
