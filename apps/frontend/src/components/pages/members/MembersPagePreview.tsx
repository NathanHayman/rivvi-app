"use client";

import { type QueryResponseInitial } from "@sanity/react-loader/rsc";

import { membersPageQuery, membersQuery } from "@/sanity/lib/queries";
import { useQuery } from "@/sanity/loader/useQuery";
import { MembersPagePayload, MembersPayload } from "@/types";

import { MembersPage } from "./MembersPage";

type Props = {
  initial: QueryResponseInitial<MembersPayload | null>;
};

export default function MembersPagePreview(props: Props) {
  const { initial } = props;
  const { data, encodeDataAttribute } = useQuery<MembersPayload | null>(
    membersQuery,
    {},
    { initial: initial as QueryResponseInitial<MembersPayload | null> },
  );

  const { data: pageData } = useQuery<MembersPagePayload | null>(
    membersPageQuery,
    {},
    { initial: initial as QueryResponseInitial<MembersPagePayload | null> },
  );

  if (!data || !pageData) {
    return (
      <div className="text-center">
        Please start editing your members document to see the preview!
      </div>
    );
  }

  return <MembersPage members={data as any} pageData={pageData as any} />;
}
