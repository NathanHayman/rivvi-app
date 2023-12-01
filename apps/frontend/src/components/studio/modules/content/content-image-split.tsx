"use client";

import { Image } from "@nextui-org/react";
import type { PortableTextBlock } from "@portabletext/types";
import NextImage from "next/image";
import * as React from "react";
import type { Image as ImageProps } from "sanity";

import { ContentBlock } from "@/components/studio/shared/blocks/content";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { cn } from "@/lib/utils";
import { urlForImage } from "@/sanity/lib/utils";

interface Props {
  image: ImageProps;
  contentImageBody: PortableTextBlock[];
  contentLayout: string;
}

const ContentImageSplit: React.FC<Props> = ({
  image,
  contentImageBody,
  contentLayout,
}) => {
  const imageUrl = image && urlForImage(image)?.url();

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16">
      <div className="relative h-64 overflow-hidden rounded-xl shadow-2xl lg:h-fit">
        <AspectRatio ratio={16 / 9} className="h-full bg-muted">
          {imageUrl && (
            <Image
              as={NextImage}
              className={cn("h-full w-full object-cover object-center ")}
              src={imageUrl}
              width={2669}
              height={845}
              alt="image"
            />
          )}
        </AspectRatio>
      </div>

      <div className={`${contentLayout as string}`}>
        {contentLayout as string}
        {contentImageBody && <ContentBlock value={contentImageBody} />}
      </div>
    </div>
  );
};

export default ContentImageSplit;
