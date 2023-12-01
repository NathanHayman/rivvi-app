"use client";

import Image from "next/image";

import { urlForImage } from "@/sanity/lib/utils";
import { ImageProps } from "@/types";

export default function LogoImageComponent({ data }: { data: ImageProps }) {
  const { asset, alt, caption, hotspot, crop, width, height } = data ?? {};
  const imageUrl = data && urlForImage(data)?.width(200).url();
  if (imageUrl) {
    return (
      <div className="relative flex h-full max-h-[75px] w-full min-w-[200px] items-center justify-center">
        <Image
          className="object-contain"
          src={imageUrl as string}
          alt={alt || "Cover image"}
          width={200}
          height={100}
        />
      </div>
    );
  }
}
