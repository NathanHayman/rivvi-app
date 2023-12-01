import { toPlainText } from "@portabletext/react";
import { Metadata, ResolvingMetadata } from "next";
import dynamic from "next/dynamic";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";

import { MemberPage } from "@/components/pages/members/slug/MemberPage";
import { urlForOpenGraphImage } from "@/sanity/lib/utils";
import { generateStaticSlugs } from "@/sanity/loader/generateStaticSlugs";
import { loadMember } from "@/sanity/loader/loadQuery";
const MemberPagePreview = dynamic(
  () => import("@/components/pages/members/slug/MemberPagePreview"),
);

type Props = {
  params: { slug: string };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { data: member } = await loadMember(params.slug);
  const ogImage = urlForOpenGraphImage(member?.image);

  return {
    title: member?.name,
    description: member?.bio
      ? toPlainText(member.bio)
      : (await parent).description,
    openGraph: ogImage
      ? {
          images: [ogImage, ...((await parent).openGraph?.images || [])],
        }
      : {},
  };
}

export function generateStaticParams() {
  return generateStaticSlugs("member");
}

export default async function MemberSlugRoute({ params }: Props) {
  const initial = await loadMember(params.slug);

  if (draftMode().isEnabled) {
    return <MemberPagePreview params={params} initial={initial} />;
  }

  if (!initial.data) {
    notFound();
  }

  return <MemberPage data={initial.data} />;
}
