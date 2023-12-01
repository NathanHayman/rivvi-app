"use client";

import { Image } from "@nextui-org/react";

import { urlForImage } from "@/sanity/lib/utils";
import { ImageBoxProps } from "@/types";

export default function ImageBox({
  image,
  alt = "Cover image",
  size = "100vw",
  classesWrapper,
}: ImageBoxProps) {
  const imageUrl = image && urlForImage(image)?.url();

  const imageData = {
    width: image?.metadata?.dimensions?.width,
    height: image?.metadata?.dimensions?.height,
  };

  return (
    <div
      className={`relative w-fit overflow-hidden rounded-[3px] bg-accent shadow-md ${classesWrapper}`}
    >
      {imageUrl && (
        <Image
          className="mx-auto w-full self-center"
          shadow="lg"
          alt={alt || "Cover image"}
          {...imageData}
          sizes={size}
          src={imageUrl as string}
        />
      )}
    </div>
  );
}
