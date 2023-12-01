"use client";
import { Image } from "@nextui-org/react";

import LinkSwitcher from "@/components/studio/shared/links/index";
import { CallToActionProps } from "@/types";

export default function CallToAction({ data }: { data: CallToActionProps }) {
  const { title, body, content, links, layout } = data ?? {};
  if (!data) return null;
  const image = content && content[0]?.asset.url;
  const layoutType = layout ?? "default";

  return (
    <section className={`${"bg-home-background-btn"} rounded-xl`}>
      <div className="flex flex-col items-center justify-center px-6 py-16 sm:px-6 sm:py-24 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        {image && (
          <div
            className={`mx-auto flex w-full max-w-md items-center justify-center text-center ${
              layoutType === "left"
                ? "order-1 lg:order-1 lg:pr-4"
                : layoutType === "right"
                  ? "order-2 lg:order-2 lg:pl-4"
                  : "order-1 lg:order-1"
            }`}
          >
            <Image
              className="mx-auto w-full"
              src={image}
              alt="Content image"
              width={400}
            />
          </div>
        )}
        <div
          className={`mx-auto max-w-xl ${
            layoutType !== "default"
              ? "pb-16 text-left lg:pb-0"
              : "pt-16 text-center lg:pb-0"
          }`}
        >
          {title && (
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              {title}
            </h2>
          )}
          {body && (
            <p className="mx-auto mt-2 max-w-xl leading-7 text-indigo-100 lg:mt-4 lg:text-lg lg:leading-8">
              {body}
            </p>
          )}
          {links && (
            <div className="mt-10 flex w-full items-start justify-start gap-x-6">
              {links.map((link: any) => (
                <LinkSwitcher key={link._key} data={link} variant="inverted">
                  {link.title}
                </LinkSwitcher>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
