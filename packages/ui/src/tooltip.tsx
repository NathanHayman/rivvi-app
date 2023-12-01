"use client";

import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { HelpCircle } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";
import { Drawer } from "vaul";

import { nFormatter, timeAgo } from "@phunq/utils";

import { useMediaQuery } from "./hooks";

export function Tooltip({
  children,
  content,
  fullWidth,
}: {
  children: ReactNode;
  content: ReactNode | string;
  fullWidth?: boolean;
}) {
  const { isMobile } = useMediaQuery();

  if (isMobile) {
    return (
      <Drawer.Root>
        <Drawer.Trigger
          className={`${
            fullWidth ? "w-full" : "inline-flex"
          } text-foreground md:hidden`}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          {children}
        </Drawer.Trigger>
        <Drawer.Overlay className="bg-modal fixed inset-0 z-40 bg-opacity-10 backdrop-blur" />
        <Drawer.Portal>
          <Drawer.Content className="bg-background border-border fixed bottom-0 left-0 right-0 z-50 mt-24 rounded-t-[10px] border-t">
            <div className="sticky top-0 z-20 flex w-full items-center justify-center rounded-t-[10px] bg-inherit">
              <div className="bg-muted-foreground my-3 h-1 w-12 rounded-full" />
            </div>
            <div className="bg-background flex min-h-[150px] w-full items-center justify-center overflow-hidden align-middle shadow-xl">
              {typeof content === "string" ? (
                <span className="text-muted-foreground block text-center text-sm">
                  {content}
                </span>
              ) : (
                content
              )}
            </div>
          </Drawer.Content>
          <Drawer.Overlay />
        </Drawer.Portal>
      </Drawer.Root>
    );
  }
  return (
    <TooltipPrimitive.Provider delayDuration={100}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger className="md:inline-flex" asChild>
          {children}
        </TooltipPrimitive.Trigger>
        {/* 
            We don't use TooltipPrimitive.Portal here because for some reason it 
            prevents you from selecting the contents of a tooltip when used inside a modal 
        */}
        <TooltipPrimitive.Content
          sideOffset={8}
          side="top"
          className="animate-slide-up-fade border-border bg-popover z-[99] items-center overflow-hidden rounded-md border shadow-md md:block"
        >
          {typeof content === "string" ? (
            <div className="text-muted-foreground block max-w-xs px-4 py-2 text-center text-sm">
              {content}
            </div>
          ) : (
            content
          )}
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}

export function TooltipContent({
  title,
  cta,
  href,
  target,
  onClick,
}: {
  title: string;
  cta?: string;
  href?: string;
  target?: string;
  onClick?: () => void;
}) {
  return (
    <div className="flex flex-col items-center space-y-3 p-4 text-center md:max-w-xs">
      <p className="text-foreground text-sm">{title}</p>
      {cta &&
        (href ? (
          <Link
            href={href}
            {...(target ? { target } : {})}
            className="border-border text-background hover:bg-background hover:text-muted-foreground mt-4 w-full rounded-md border bg-black px-3 py-1.5 text-center text-sm transition-all"
          >
            {cta}
          </Link>
        ) : onClick ? (
          <button
            type="button"
            className="border-border text-background hover:bg-background hover:text-muted-foreground mt-4 w-full rounded-md border bg-black px-3 py-1.5 text-center text-sm transition-all"
            onClick={onClick}
          >
            {cta}
          </button>
        ) : null)}
    </div>
  );
}

export function SimpleTooltipContent({
  title,
  cta,
  href,
}: {
  title: string;
  cta: string;
  href: string;
}) {
  return (
    <div className="text-foreground max-w-xs px-4 py-2 text-center text-sm">
      {title}{" "}
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex text-gray-500 underline underline-offset-4 hover:text-gray-800"
      >
        {cta}
      </a>
    </div>
  );
}

export function InfoTooltip({ content }: { content: ReactNode | string }) {
  return (
    <Tooltip content={content}>
      <HelpCircle className="h-4 w-4 text-gray-500" />
    </Tooltip>
  );
}

export function NumberTooltip({
  value,
  unit = "total clicks",
  children,
  lastClicked,
}: {
  value?: number | null;
  unit?: string;
  children: ReactNode;
  lastClicked?: Date | null;
}) {
  if ((!value || value < 1000) && !lastClicked) {
    return children;
  }
  return (
    <Tooltip
      content={
        <div className="text-foreground block max-w-xs px-4 py-2 text-center text-sm">
          <p className="text-foreground text-sm font-semibold">
            {nFormatter(value || 0, { full: true })} {unit}
          </p>
          {lastClicked && (
            <p className="mt-1 text-xs text-gray-500">
              Last clicked {timeAgo(lastClicked, { withAgo: true })}
            </p>
          )}
        </div>
      }
    >
      {children}
    </Tooltip>
  );
}
