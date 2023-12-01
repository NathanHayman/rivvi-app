"use client";

import { AccordionItem } from "@nextui-org/react";

import { AccordionGroupProps } from "@/types";

import { CustomPortableText } from "../../shared/custom-portable-text";

export default function AccordionGroup({
  data,
}: {
  data: AccordionGroupProps;
}) {
  if (!data) return null;
  return (
    <>
      {data?.title && (
        <AccordionItem title={data.title} key={data._key}>
          {data?.body && <CustomPortableText value={data.body} />}
        </AccordionItem>
      )}
    </>
  );
}
