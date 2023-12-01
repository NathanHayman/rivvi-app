import { PortableText, PortableTextComponents } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";

import Accordion from "@/components/studio/modules/accordion";
import Callout from "@/components/studio/modules/callout";
import Grid from "@/components/studio/modules/grid";
import ImageModule from "@/components/studio/modules/image/module";

import LinkSwitcher from "../links";

export function ContentBlock({
  paragraphClasses,
  value,
}: {
  paragraphClasses?: string;
  value: PortableTextBlock[];
}) {
  const components: PortableTextComponents = {
    block: {
      normal: ({ children }) => {
        return (
          <p
            className={`${paragraphClasses} leading-7 [&:not(:first-child)]:mt-6`}
          >
            {children}
          </p>
        );
      },
      h1: ({ children }) => {
        return (
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            {children}
          </h1>
        );
      },
      h2: ({ children }) => {
        return (
          <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
            {children}
          </h2>
        );
      },
      h3: ({ children }) => {
        return (
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            {children}
          </h3>
        );
      },
      h4: ({ children }) => {
        return (
          <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
            {children}
          </h4>
        );
      },
      h5: ({ children }) => {
        return (
          <h5 className="text-lg font-bold leading-6 text-gray-900">
            {children}
          </h5>
        );
      },
      h6: ({ children }) => {
        return (
          <h6 className="text-base font-bold leading-6 text-gray-900">
            {children}
          </h6>
        );
      },
      blockquote: ({ children }) => {
        return (
          <blockquote className="mt-6 border-l-2 pl-6 italic">
            {children}
          </blockquote>
        );
      },
      ul: ({ children }) => {
        return <ul className="my-6 ml-6 list-disc [&>li]:mt-2">{children}</ul>;
      },
      ol: ({ children }) => {
        return (
          <ol className="my-6 ml-6 list-decimal [&>li]:mt-2">{children}</ol>
        );
      },
      li: ({ children }) => {
        return <li>{children}</li>;
      },
      code: ({ children }) => {
        return (
          <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
            {children}
          </code>
        );
      },
    },
    marks: {
      lead: ({ children }) => {
        return <p className="text-xl text-muted-foreground">{children}</p>;
      },
      large: ({ children }) => {
        return <div className="text-lg font-semibold">{children}</div>;
      },
      small: ({ children }) => {
        return (
          <small className="text-sm font-medium leading-none">{children}</small>
        );
      },
      muted: ({ children }) => {
        return <p className="text-sm text-muted-foreground">{children}</p>;
      },
      annotationLinkExternal: ({ children, value }) => {
        return (
          <a
            className="underline transition hover:opacity-50"
            href={value?.href}
            rel="noreferrer noopener"
          >
            {children}
          </a>
        );
      },
      annotationLinkInternal: ({ children, value }) => {
        return (
          <LinkSwitcher data={value} type="body">
            {children}
          </LinkSwitcher>
        );
      },
      annotationLinkEmail: ({ children, value }) => {
        return (
          <LinkSwitcher data={value} type="email">
            {children}
          </LinkSwitcher>
        );
      },
    },
    types: {
      "module.image": ({ value }) => {
        return <ImageModule data={value} />;
      },
      "module.callout": ({ value }) => {
        return (
          <div className="w-full">
            <Callout callout={value} />
          </div>
        );
      },
      "module.accordion": ({ value }) => {
        return (
          <div className="w-full">
            <Accordion data={value} />
          </div>
        );
      },
      "module.grid": ({ value }) => {
        return <Grid data={value} />;
      },
    },
  };

  return <PortableText components={components} value={value} />;
}
