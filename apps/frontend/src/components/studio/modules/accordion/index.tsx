"use client";
import { AccordionItem, Accordion as ModuleAccordion } from "@nextui-org/react";
import { ChevronLeft } from "lucide-react";

import { AccordionProps } from "@/types";

import { CustomPortableText } from "../../shared/custom-portable-text";

export default function Accordion({ data }: { data: AccordionProps }) {
  const { groups } = data ?? {};
  const itemClasses = {
    title:
      "font-medium tracking-tight text-lg not-prose lg:text-xl text-gray-800",
    content: "text-gray-600 not-prose pb-4 lg:pb-6 pr-2 text-base lg:pr-6",
    base: "py-2 lg:py-4",
  };
  return (
    <>
      {groups && (
        <ModuleAccordion
          defaultSelectedKeys={[groups[0]._key] as string[]}
          selectionMode="multiple"
          variant="light"
          itemClasses={itemClasses}
          className="not-prose"
          onFocus={(e) => {
            e.target.blur();
          }}
        >
          {groups.map((group, i) => (
            <AccordionItem
              title={group.title}
              key={group.title}
              aria-label={`Accordion ${i}`}
              className="not-prose my-2 py-2 sm:my-2.5"
              indicator={
                <ChevronLeft
                  size={24}
                  className="[data-nextui-accordion-indicator]"
                />
              }
            >
              {group?.body && (
                <CustomPortableText
                  paragraphClasses="not-prose pt-0 mt-0"
                  value={group.body}
                />
              )}
            </AccordionItem>
          ))}
        </ModuleAccordion>
      )}
    </>
  );
}
