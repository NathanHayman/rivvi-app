import { Image } from "sanity";

import LinkSwitcher from "@/components/studio/shared/links";

import ImageBox from "./box";

export default function ImageModule({ data }: { data: any }) {
  const { image, callToAction, caption, variant } = data ?? {};
  if (!data) return null;

  switch (variant) {
    case "simple":
      return (
        <div className="not-prose space-y-2">
          {image && (
            <ImageBox
              image={image as Image}
              alt={image?.alt ?? "Cover image"}
              classesWrapper="relative"
            />
          )}
        </div>
      );
    case "round":
      return (
        <div className="not-prose space-y-2">
          {image && (
            <ImageBox
              image={image as Image}
              alt={image?.alt ?? "Cover image"}
              classesWrapper="relative w-fit rounded-full overflow-hidden aspect-[1/1] max-w-[275px] border-4 border-accent"
            />
          )}
        </div>
      );
    case "caption":
      return (
        <div className="space-y-2">
          {image && (
            <ImageBox
              image={image as Image}
              alt={image?.alt ?? "Cover image"}
              classesWrapper="relative aspect-[16/9]"
            />
          )}
          {caption && (
            <div className="font-sans text-sm text-gray-600">{caption}</div>
          )}
        </div>
      );
    case "callToAction":
      return (
        <div className="not-prose space-y-2">
          {image && (
            <ImageBox
              image={image as Image}
              alt={image?.alt ?? "Cover image"}
              classesWrapper="relative aspect-[16/9] not-prose sm:rounded-[3px]"
            />
          )}
          <div className="not-prose px-4 py-3 sm:flex sm:items-center sm:justify-between sm:px-6 lg:px-8">
            {callToAction?.title && (
              <p className="not-prose pb-2 text-center text-base font-medium sm:text-left lg:pb-0 lg:text-lg">
                {callToAction.title}
              </p>
            )}
            {callToAction?.links &&
              callToAction.links.map((link: any) => (
                <LinkSwitcher
                  key={link._key}
                  data={link || link.reference}
                  type={link._type}
                  className="mx-auto block w-fit text-center text-sm sm:mx-0 sm:w-auto lg:text-left lg:text-base"
                >
                  {link.title}
                </LinkSwitcher>
              ))}
          </div>
        </div>
      );
    default:
      return (
        <div className="not-prose space-y-2">
          {image && (
            <ImageBox
              image={image as Image}
              alt={image?.alt ?? "Cover image"}
              classesWrapper="relative aspect-[16/9]"
            />
          )}
        </div>
      );
  }
}
