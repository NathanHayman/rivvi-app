"use client";

import { Card, CardFooter, Image } from "@nextui-org/react";

import { urlForImage } from "@/sanity/lib/utils";
import { GridItemProps } from "@/types";

import { CustomPortableText } from "../../shared/custom-portable-text";
import LinkSwitcher from "../../shared/links";

export default function GridItem({ data }: { data: GridItemProps }) {
  const { title, image, body, links } = data ?? {};
  const imageUrl = image && urlForImage(image)?.url();
  return (
    <Card className="overflow-hidden p-4">
      {imageUrl && (
        <Image
          alt={"Image of " + title ?? "Image"}
          className="h-56 w-full object-cover"
          width="100%"
          src={imageUrl}
        />
      )}
      <div className="mt-2 flex h-full flex-col items-start px-4 py-2 lg:mt-4">
        <div className="text-lg font-bold tracking-tight lg:text-xl">
          {title}
        </div>
        <div className="mb-2 mt-2 text-[15px] text-gray-700">
          {body && (
            <CustomPortableText
              value={body}
              paragraphClasses="text-[15px] text-gray-700"
            />
          )}
        </div>
      </div>
      <CardFooter className="h-full px-4 py-2">
        {links &&
          links.map((link: any) => (
            <LinkSwitcher key={link._key} data={link} className="self-end">
              {link.title}
            </LinkSwitcher>
          ))}
      </CardFooter>
    </Card>
  );
}
{
  /*

<Card className="not-prose break-inside-avoid rounded-lg p-6 pb-4 relative lg:top-16">
<div className="flex flex-col items-start truncate whitespace-pre-wrap">
  <div className="font-bold tracking-tight text-base lg:text-lg">
    {title}
  </div>
  <div className="mb-2 mt-4 text-[15px] text-gray-700">{body}</div>
</div>
<Divider className="w-full my-4" />
<div className="flex sm:flex-col sm:items-start sm:justify-center sm:space-y-2 lg:flex-row lg:justify-between lg:items-center lg:space-y-0 items-center justify-between">
  <div className="flex items-center space-x-2 order-2 lg:order-1">
    <Avatar radius="full" size="md" src={image} alt="Sebastian Mellen" />
    <div>
      <h4 className="text-[15px] font-semibold text-gray-900 flex items-center space-x-1">
        {name}
        <span className="flex items-center space-x-1">
          <span className="sr-only">Verified Customer Review</span>
          <BadgeCheck className="h-4 w-4 fill-[#3ba9ee55] text-[#3BA9EE]" />
        </span>
      </h4>
      <div className="flex items-center space-x-1">
        <p className="text-sm text-gray-500 transition-all duration-75 hover:text-gray-900">
          {subtitle}
        </p>
        <p>·</p>
        <p className="text-sm text-gray-500 transition-all duration-75 hover:text-gray-900">
          {date}
        </p>
      </div>
    </div>
  </div>
  <div className="order-1 lg:order-2 pb-4 lg:pb-0 lg:self-end">
    <div className="group flex items-center">
      {[...Array(stars)].map((_, i) => (
        <Star key={i} className="h-4 w-4 fill-[#FFC107] text-[#FFC107]" />
      ))}
    </div>
  </div>
</div>
</Card>
)
}
*/
}
