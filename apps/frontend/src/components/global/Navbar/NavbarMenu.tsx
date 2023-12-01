"use client";

import { Navbar, NavbarContent, NavbarItem } from "@nextui-org/react";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { resolveHref } from "@/sanity/lib/utils";
import { MenuItem } from "@/types";

interface MenuProps {
  menuItems?: MenuItem[];
  pathname?: string;
}

export function Menu({ menuItems, pathname }: MenuProps) {
  return (
    <Navbar className="hidden border-t bg-secondary lg:block">
      <div className="mx-auto w-full max-w-screen-xl px-4 py-4 lg:grid lg:grid-cols-2">
        <NavbarContent
          className="mt-0 flex w-full flex-row items-start space-x-8"
          justify="start"
        >
          {menuItems &&
            menuItems.map((menuItem, key) => {
              if (!menuItem?._type) {
                return null;
              }
              if (menuItem?.reference?._type === "home") {
                return (
                  <NavbarItem key={key}>
                    <Link
                      href="/"
                      legacyBehavior
                      passHref
                      className={cn(
                        "transition-colors duration-200 ease-in-out hover:text-primary dark:text-foreground/60 dark:hover:text-primary",
                        pathname === "/"
                          ? "text-primary"
                          : "text-foreground/90 dark:text-foreground/60",
                        buttonVariants({ variant: "link", size: "sm" }),
                      )}
                    >
                      {menuItem?.reference?.title}
                    </Link>
                  </NavbarItem>
                );
              }
              const href = resolveHref(
                menuItem?._type,
                menuItem?.reference?.slug,
              );
              if (!href) {
                return null;
              }
              const isActive = pathname === href;
              return (
                <NavbarItem key={key}>
                  <Link
                    href={href}
                    legacyBehavior
                    passHref
                    className={cn(
                      "transition-colors duration-200 ease-in-out hover:text-primary dark:text-foreground/60 dark:hover:text-primary",
                      isActive
                        ? "text-primary"
                        : "text-foreground/90 dark:text-foreground/60",
                      buttonVariants({ variant: "link", size: "sm" }),
                    )}
                  >
                    {menuItem?.reference?.title}
                  </Link>
                </NavbarItem>
              );
            })}
        </NavbarContent>
      </div>
    </Navbar>
  );
}
