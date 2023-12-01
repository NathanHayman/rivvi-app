"use client";

import React from "react";

import ModuleWrap from "@/components/layout/wrap/module";
import { PageHeader } from "@/components/shared/PageHeader";
import { MemberShort, MembersPagePayload, MembersPayload } from "@/types";

import MembersList from "./MembersList";

interface MembersPageProps {
  members: MembersPayload | null;
  pageData: MembersPagePayload | null;
}

const MembersPage: React.FC<MembersPageProps> = ({ members, pageData }) => {
  return (
    <>
      {/* Page Header */}
      <PageHeader
        title={pageData?.header || "Providers Title"}
        subtitle={pageData?.subheader || "Providers Subtitle"}
      />
      <ModuleWrap>
        {/* Member List */}
        <MembersList members={members as MemberShort[]} />
      </ModuleWrap>
    </>
  );
};

export { MembersPage };
