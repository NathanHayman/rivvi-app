"use client";

import { cn } from "@phunq/utils";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { Dispatch, ReactNode, SetStateAction } from "react";
import { Drawer } from "vaul";
import { useMediaQuery } from "./hooks";

export function Popover({
  children,
  content,
  className,
  align = "center",
  openPopover,
  setOpenPopover,
  mobileOnly,
  subTrigger,
}: {
  children: ReactNode;
  content: ReactNode | string;
  className?: string;
  align?: "center" | "start" | "end";
  openPopover?: boolean;
  setOpenPopover?: Dispatch<SetStateAction<boolean>>;
  mobileOnly?: boolean;
  subTrigger?: ReactNode;
}) {
  const { isMobile } = useMediaQuery();

  if (mobileOnly || isMobile) {
    return (
      <Drawer.Root open={openPopover} onOpenChange={setOpenPopover}>
        <div className="sm:hidden">{children}</div>
        <Drawer.Overlay className="bg-root/80 fixed inset-0 z-40 bg-opacity-10 backdrop-blur" />
        <Drawer.Portal>
          <Drawer.Content className="border-slate-6 fixed bottom-0 left-0 right-0 z-50 mt-24 rounded-t-[10px] border-t">
            <div className="sticky top-0 z-20 flex w-full items-center justify-center rounded-t-[10px] bg-inherit">
              <div className="bg-muted my-3 h-1 w-12 rounded-full" />
            </div>
            <div className="flex min-h-[150px] w-full items-center justify-center overflow-hidden bg-slate-50 pb-8 align-middle shadow-xl ">
              {content}
            </div>
          </Drawer.Content>
          <Drawer.Overlay />
        </Drawer.Portal>
      </Drawer.Root>
    );
  }

  return (
    <PopoverPrimitive.Root open={openPopover} onOpenChange={setOpenPopover}>
      <PopoverPrimitive.Trigger className="sm:inline-flex" asChild>
        {children}
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          sideOffset={8}
          align={align}
          className={cn(
            " data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-[999]  outline-none",
            className,
          )}
        >
          {content}
          <PopoverPrimitive.PopoverClose
            className="absolute right-0 top-0 m-2 rounded-full bg-slate-50 p-1 "
            aria-label="Close popover"
            asChild
          >
            {subTrigger}
          </PopoverPrimitive.PopoverClose>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}
