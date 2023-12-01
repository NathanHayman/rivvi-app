import { Metadata, ResolvingMetadata } from "next";
import dynamic from "next/dynamic";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";

import { ServicePage } from "@/components/pages/services/slug/ServicePage";
import { generateStaticSlugs } from "@/sanity/loader/generateStaticSlugs";
import { loadService } from "@/sanity/loader/loadQuery";
const ServicePagePreview = dynamic(
  () => import("@/components/pages/services/slug/ServicePagePreview"),
);

type Props = {
  params: { slug: string };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { data: service } = await loadService(params.slug);
  //   const ogImage = urlForOpenGraphImage(service?.coverImage)

  return {
    title: service?.title,
    // description: service?.overview
    //   ? toPlainText(service.overview)
    //   : (await parent).description,
    // openGraph: ogImage
    //   ? {
    //       images: [ogImage, ...((await parent).openGraph?.images || [])],
    //     }
    //   : {},
  };
}

export function generateStaticParams() {
  return generateStaticSlugs("service");
}

export default async function ServiceSlugRoute({ params }: Props) {
  const initial = await loadService(params.slug);

  if (draftMode().isEnabled) {
    return <ServicePagePreview params={params} initial={initial} />;
  }

  if (!initial.data) {
    notFound();
  }

  return <ServicePage data={initial.data} />;
}
