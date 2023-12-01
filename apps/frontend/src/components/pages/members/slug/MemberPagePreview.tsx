"use client";

import { type QueryResponseInitial } from "@sanity/react-loader/rsc";

import { memberQuery } from "@/sanity/lib/queries";
import { useQuery } from "@/sanity/loader/useQuery";
import { MemberPayload } from "@/types";

import { MemberPage } from "./MemberPage";

type Props = {
  params: { slug: string };
  initial: QueryResponseInitial<MemberPayload | null>;
};

export default function MemberPagePreview(props: Props) {
  const { params, initial } = props;
  const { data, encodeDataAttribute } = useQuery<MemberPayload | null>(
    memberQuery,
    params,
    { initial },
  );

  return <MemberPage data={data!} encodeDataAttribute={encodeDataAttribute} />;
}
