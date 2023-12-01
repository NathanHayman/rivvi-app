import * as React from "react";

import UnstyledLink, {
  UnstyledLinkProps,
} from "@/components/studio/elements/links/unstyled-link";
import { cn } from "@/lib/utils";

const ButtonLinkVariant = [
  "primary",
  "outline",
  "ghost",
  "light",
  "dark",
  "inverted",
] as const;
const ButtonLinkSize = ["sm", "base"] as const;

type ButtonLinkProps = {
  isDarkBg?: boolean;
  variant?: (typeof ButtonLinkVariant)[number];
  size?: (typeof ButtonLinkSize)[number];
  theme?: "none" | "page" | "home" | "section";
  classNames?: {
    leftIcon?: string;
    rightIcon?: string;
  };
} & UnstyledLinkProps;

const ButtonLink = React.forwardRef<HTMLAnchorElement, ButtonLinkProps>(
  function ButtonLink(
    {
      children,
      className,
      variant = "primary",
      theme = "none",
      size = "base",
      classNames,
      ...rest
    },
    ref,
  ) {
    return (
      <UnstyledLink
        ref={ref}
        {...rest}
        className={cn(
          "inline-flex items-center rounded-lg font-medium",
          "focus:outline-none focus-visible:ring focus-visible:ring-primary-500",
          "shadow-sm",
          "transition-all duration-75",
          //#region  //*=========== Size ===========
          [
            size === "base" && ["px-6 py-2", "text-sm md:text-base"],
            size === "sm" && ["px-2 py-1", "text-xs md:text-sm"],
          ],
          //#endregion  //*======== Size ===========
          //#region  //*=========== Variants ===========
          [
            variant === "primary" &&
              theme === "none" && [
                "bg-primary-500 text-white",
                "border border-primary-600",
                "hover:bg-primary-600 hover:text-white",
                "active:bg-primary-700",
                "disabled:bg-primary-700",
              ],
            theme === "page" && [
              "bg-page-background-btn text-page-text-btn",
              "border-page-background-btn border",
              "hover:bg-page-background-btn/10 hover:text-page-text-btn hover:opacity-90",
              "active:bg-page-background-btn/70",
              "disabled:bg-page-background-btn/70",
            ],
            theme === "home" && [
              "bg-home-background-btn text-home-text-btn",
              "border-home-background-btn/90 border",
              "hover:bg-home-background-btn/10 hover:text-home-text-btn hover:opacity-90",
              "active:bg-home-background-btn/70",
              "disabled:bg-home-background-btn/70",
            ],
            variant === "outline" &&
              theme === "home" && [
                "text-home-text-outline",
                "border-home-background-outline border",
                "hover:bg-primary-50 active:bg-primary-100 disabled:bg-primary-100",
              ],
            variant === "outline" &&
              theme === "page" && [
                "text-page-text-outline",
                "border-page-background-outline border",
                "hover:bg-primary-50 active:bg-primary-100 disabled:bg-primary-100",
              ],
            variant === "outline" &&
              theme === "none" && [
                "text-primary-500",
                "border border-primary-500",
                "hover:bg-primary-50 active:bg-primary-100 disabled:bg-primary-100",
              ],
            variant === "inverted" &&
              theme === "home" && [
                "text-home-text-btn",
                "border-home-background-btn border",
                "hover:bg-home-background-btn/10 hover:text-home-text-btn",
                "active:bg-home-background-btn/70",
                "disabled:bg-home-background-btn/70",
              ],
            variant === "inverted" &&
              theme === "page" && [
                "text-page-text-btn",
                "border-page-background-btn border",
                "hover:bg-page-background-btn/10 hover:text-page-text-btn",
                "active:bg-page-background-btn/70",
                "disabled:bg-page-background-btn/70",
              ],
            variant === "inverted" &&
              theme === "none" && [
                "text-primary-500",
                "border border-primary-500",
                "hover:bg-primary-50 active:bg-primary-100 disabled:bg-primary-100",
              ],
          ],
          //#endregion  //*======== Variants ===========
          "disabled:cursor-not-allowed",
          className,
        )}
      >
        {children}
      </UnstyledLink>
    );
  },
);

ButtonLink.displayName = "ButtonLink";

export default ButtonLink;
