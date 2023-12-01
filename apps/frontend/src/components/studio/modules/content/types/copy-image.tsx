"use client";

import { Image } from "@nextui-org/react";

import { ContentBlock } from "@/components/studio/shared/blocks/content";
import { urlForImage } from "@/sanity/lib/utils";

export function CopyImageL({ data }: { data: any }) {
  const { image, contentImageBody } = data ?? {};
  const imageUrl = image && urlForImage(image)?.url();
  return (
    <div className="mx-auto grid h-full max-w-2xl grid-cols-1 items-start gap-x-8 gap-y-6 sm:gap-y-8 lg:mx-0 lg:max-w-none lg:grid-cols-2">
      <div className="lg:pr-4">
        {imageUrl && (
          <Image
            className="w-full"
            src={imageUrl}
            alt="Content image"
            width={1920}
            height={1080}
          />
        )}
      </div>
      {contentImageBody && (
        <div className="lg:max-w-lg">
          <ContentBlock value={contentImageBody} />
        </div>
      )}
    </div>
  );
}

export function CopyImageR({ data }: { data: any }) {
  const { image, contentImageBody } = data ?? {};
  const imageUrl = image && urlForImage(image)?.url();
  return (
    <div className="mx-auto grid max-w-2xl grid-cols-1 items-start gap-x-8 gap-y-6 sm:gap-y-8 lg:mx-0 lg:max-w-none lg:grid-cols-2">
      {contentImageBody && (
        <div className="lg:max-w-lg xl:max-w-xl">
          <ContentBlock value={contentImageBody} />
        </div>
      )}
      <div className="lg:pl-4">
        {imageUrl && (
          <Image
            className="w-full"
            src={imageUrl}
            alt="Content image"
            width={1920}
            height={1080}
          />
        )}
      </div>
    </div>
  );
}

export function CopyImageD({ data }: { data: any }) {
  const { image, contentImageBody } = data ?? {};
  const imageUrl = image && urlForImage(image)?.url();
  return (
    <div className="relative mx-auto grid h-full w-full max-w-2xl grid-cols-1 items-start gap-x-8 gap-y-6 border border-red-500/50 sm:gap-y-8 lg:mx-0 lg:max-w-none lg:grid-cols-2">
      {contentImageBody && (
        <div className="w-full lg:col-span-1">
          <ContentBlock value={contentImageBody} />
        </div>
      )}
      <div className="lg:pr-4">
        {imageUrl && (
          <Image
            className="w-full"
            src={imageUrl}
            alt="Content image"
            width={1920}
            height={1080}
          />
        )}
      </div>
      <h1 className="absolute -top-8">FIX ME - contentLayout not found</h1>
    </div>
  );
}
