import Link, { LinkProps } from "next/link";
import * as React from "react";

import { cn } from "@/lib/utils";

export type UnstyledLinkProps = {
  href: string;
  children: React.ReactNode;
  openNewTab?: boolean;
  className?: string;
  nextLinkProps?: Omit<LinkProps, "href">;
} & React.ComponentPropsWithRef<"a">;

const UnstyledLink = React.forwardRef<HTMLAnchorElement, UnstyledLinkProps>(
  function UnstyledLink(
    { children, href, openNewTab, className, nextLinkProps, ...rest },
    ref,
  ) {
    const isNewTab =
      openNewTab !== undefined
        ? openNewTab
        : href && !href.startsWith("/") && !href.startsWith("#");

    if (!isNewTab) {
      return (
        <Link
          href={href}
          ref={ref}
          className={className}
          {...rest}
          {...nextLinkProps}
        >
          {children}
        </Link>
      );
    }

    return (
      <a
        ref={ref}
        // rel="noopener noreferrer"
        href={href}
        {...rest}
        className={cn("cursor-newtab", className)}
      >
        {children}
      </a>
    );
  },
);

UnstyledLink.displayName = "UnstyledLink";

export default UnstyledLink;
