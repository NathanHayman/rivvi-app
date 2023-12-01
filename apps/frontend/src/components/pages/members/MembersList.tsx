"use client";

import type { EncodeDataAttributeCallback } from "@sanity/react-loader/rsc";
import Link from "next/link";
import React from "react";

import { resolveHref } from "@/sanity/lib/utils";
import { MemberShort } from "@/types";

import MemberCard from "./MembersCard";

interface MembersListProps {
  members: MemberShort[];
  encodeDataAttribute?: EncodeDataAttributeCallback;
}

const MembersList: React.FC<MembersListProps> = ({
  members,
  encodeDataAttribute,
}) => {
  if (!members) {
    return null;
  }
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {members.map((member, key) => {
        const href = resolveHref("member", member.slug);
        if (!href) {
          return null;
        }
        return (
          <Link
            key={key}
            href={href}
            data-sanity={encodeDataAttribute?.(["members", key, "slug"])}
          >
            <MemberCard member={member} />
          </Link>
        );
      })}
    </div>
  );
};

export default MembersList;
