import * as React from "react";

import { cn } from "@/lib/utils";

import UnstyledLink, { UnstyledLinkProps } from "./unstyled-link";

const UnderlineLink = React.forwardRef<HTMLAnchorElement, UnstyledLinkProps>(
  function UnderlineLink({ children, className, ...rest }, ref) {
    return (
      <UnstyledLink
        ref={ref}
        {...rest}
        className={cn(
          "animated-underline custom-link inline-flex items-center font-medium",
          "focus:outline-none focus-visible:rounded focus-visible:ring focus-visible:ring-primary-500 focus-visible:ring-offset-2",
          "border-dark border-b border-dotted hover:border-black/0",
          className,
        )}
      >
        {children}
      </UnstyledLink>
    );
  },
);

UnderlineLink.displayName = "UnderlineLink";

export default UnderlineLink;
