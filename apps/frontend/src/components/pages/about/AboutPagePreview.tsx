"use client";

import { type QueryResponseInitial } from "@sanity/react-loader/rsc";

import { aboutPageQuery, aboutQuery } from "@/sanity/lib/queries";
import { useQuery } from "@/sanity/loader/useQuery";
import { AboutPagePayload, AboutPayload } from "@/types";

import { AboutPage } from "./AboutPage";

type Props = {
  initial: QueryResponseInitial<AboutPagePayload | null>;
};

export default function AboutPagePreview(props: Props) {
  const { initial } = props;
  const { data, encodeDataAttribute } = useQuery<AboutPayload | null>(
    aboutQuery,
    {},
    { initial: initial as QueryResponseInitial<AboutPayload | null> },
  );

  const { data: pageData } = useQuery<AboutPagePayload | null>(
    aboutPageQuery,
    {},
    { initial: initial as QueryResponseInitial<AboutPagePayload | null> },
  );

  if (!data || !pageData) {
    return (
      <div className="text-center">
        Please start editing your about page document to see the preview!
      </div>
    );
  }

  return <AboutPage data={data as any} pageData={pageData as any} />;
}
