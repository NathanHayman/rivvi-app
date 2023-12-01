import { toPlainText } from "@portabletext/react";
import { Metadata, ResolvingMetadata } from "next";
import dynamic from "next/dynamic";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";

import { LocationPage } from "@/components/pages/locations/slug/LocationPage";
import { urlForOpenGraphImage } from "@/sanity/lib/utils";
import { generateStaticSlugs } from "@/sanity/loader/generateStaticSlugs";
import { loadLocation } from "@/sanity/loader/loadQuery";
const LocationPagePreview = dynamic(
  () => import("@/components/pages/locations/slug/LocationPagePreview"),
);

type Props = {
  params: { slug: string };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { data: location } = await loadLocation(params.slug);
  const ogImage = urlForOpenGraphImage(location?.image);

  return {
    title: location?.name,
    description: location?.overview
      ? toPlainText(location.overview)
      : (await parent).description,
    openGraph: ogImage
      ? {
          images: [ogImage, ...((await parent).openGraph?.images || [])],
        }
      : {},
  };
}

export function generateStaticParams() {
  return generateStaticSlugs("location");
}

export default async function LocationSlugRoute({ params }: Props) {
  const initial = await loadLocation(params.slug);

  if (draftMode().isEnabled) {
    return <LocationPagePreview params={params} initial={initial} />;
  }

  if (!initial.data) {
    notFound();
  }

  return <LocationPage data={initial.data} />;
}
