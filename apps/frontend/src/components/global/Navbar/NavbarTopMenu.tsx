"use client";

import {
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from "@nextui-org/react";
import Image from "next/image";
import { useState } from "react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { resolveHref, urlForImage } from "@/sanity/lib/utils";
import { MenuItem, SocialMedia, TopMenuItem } from "@/types";

interface TopMenuProps {
  menuItems?: MenuItem[];
  topMenuItems?: TopMenuItem[];
  socialMedia?: SocialMedia[];
  logo?: { asset?: any };
  pathname?: string;
}

export function TopMenu({
  topMenuItems,
  socialMedia,
  menuItems,
  logo,
  pathname,
}: TopMenuProps) {
  const currentPath = pathname || "";
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const logoUrl = logo && urlForImage(logo)?.url();

  if (!topMenuItems) {
    return null;
  }
  return (
    <Navbar
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      className="mx-auto w-full max-w-7xl"
    >
      {/* Logo */}
      {logoUrl && (
        <NavbarContent className="pr-3 lg:hidden" justify="start">
          <NavbarBrand>
            <Image
              className="block h-10 w-auto"
              src={logoUrl}
              alt="Logo"
              width={logo?.asset?.metadata?.dimensions?.width || 200}
              height={logo?.asset?.metadata?.dimensions?.height || 75}
            />
          </NavbarBrand>
        </NavbarContent>
      )}
      <NavbarContent
        className="hidden w-full gap-4 p-2 lg:flex lg:p-3"
        justify="end"
      >
        <NavbarBrand className="flex items-center">
          {logoUrl && (
            <Image
              className="block h-12 w-auto place-self-start"
              src={logoUrl}
              alt="Logo"
              width={logo?.asset?.metadata?.dimensions?.width || 200}
              height={logo?.asset?.metadata?.dimensions?.height || 75}
            />
          )}
        </NavbarBrand>
      </NavbarContent>
      <NavbarContent className="lg:hidden" justify="end">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        />
      </NavbarContent>
      <NavbarContent
        className="hidden w-full text-sm text-foreground lg:flex"
        justify="end"
      >
        {topMenuItems &&
          topMenuItems.map((item, key) => {
            if (item._type === "linkExternal") {
              if (item.type === "button") {
                return (
                  <NavbarItem key={key}>
                    <Link
                      className={cn(
                        buttonVariants({ variant: "default", size: "default" }),
                        "mr-2 hidden md:inline",
                      )}
                      href={item.url}
                      target={item.newWindow ? "_blank" : "_self"}
                    >
                      {item?.title || ""}
                    </Link>
                  </NavbarItem>
                );
              } else {
                return (
                  <NavbarItem key={item.url}>
                    <Link
                      href={item.url}
                      target={item.newWindow ? "_blank" : "_self"}
                      className={cn(
                        buttonVariants({ variant: "link", size: "sm" }),
                        "mr-2 hidden px-0 py-1 text-foreground/90 hover:text-primary/80 dark:text-foreground/60 dark:hover:text-primary/60 md:inline",
                      )}
                    >
                      <span className="hidden md:mr-2 md:inline">
                        {item?.title || ""}
                      </span>
                    </Link>
                  </NavbarItem>
                );
              }
            } else if (item._type === "linkReference") {
              const href = resolveHref(
                item?._type,
                item?.reference?.slug as any,
              );
              if (!href) {
                return null;
              }
              const isActive =
                currentPath === href ||
                currentPath === (item?.reference?.slug as any);

              return (
                <NavbarItem key={href}>
                  <Link
                    href={href}
                    className={cn(
                      buttonVariants({ variant: "link", size: "sm" }),
                      isActive ? "text-primary" : "text-foreground/90",
                      "mr-2 hidden px-0 py-1 text-foreground/90 hover:text-primary/80 dark:text-foreground/60 dark:hover:text-primary/60 md:inline",
                    )}
                  >
                    <span className="mr-2 hidden md:inline">
                      {item?.reference?.title || "d"}
                    </span>
                  </Link>
                </NavbarItem>
              );
            }
            return null; // To handle any unexpected items
          })}
      </NavbarContent>
      <NavbarMenu className="w-full items-start justify-start space-y-8 divide-y bg-white p-8 py-16 pb-4">
        <div className="grid w-full grid-cols-2 gap-8">
          <div className="flex w-full flex-col space-y-4">
            {menuItems?.map((item, index) => (
              <NavbarMenuItem key={`${item}-${index}`}>
                <Link
                  className="w-full"
                  color={"foreground"}
                  href={resolveHref(item?._type, item?.reference?.slug as any)}
                  size="lg"
                >
                  {item?.title || ""}
                </Link>
              </NavbarMenuItem>
            ))}
          </div>
          <div className="-mt-2 flex w-full flex-col space-y-4">
            {topMenuItems?.map((item, key) => {
              if (item._type === "linkReference") {
                const href = resolveHref(
                  item?._type,
                  item?.reference?.slug as any,
                );
                if (!href) {
                  return null;
                }
                const isActive =
                  currentPath === href ||
                  currentPath === (item?.reference?.slug as any);

                return (
                  <NavbarMenuItem key={href}>
                    <Link
                      color={"foreground"}
                      className={cn(
                        isActive ? "text-primary" : "text-foreground/90",
                      )}
                      href="#"
                      size="lg"
                    >
                      {item.reference?.title || "d"}
                    </Link>
                  </NavbarMenuItem>
                );
              } else {
                return null;
              }
            })}
          </div>
        </div>
        <div className="grid w-full grid-cols-1 gap-4 pt-8 sm:grid-cols-2">
          {topMenuItems?.map((item, key) => {
            if (item._type === "linkExternal") {
              if (item.type === "button") {
                return (
                  <NavbarMenuItem key={key} className="w-full">
                    <Link
                      className={cn(
                        buttonVariants({ variant: "default", size: "default" }),
                        "w-full font-bold",
                      )}
                      href={item.url}
                    >
                      {item?.title}
                    </Link>
                  </NavbarMenuItem>
                );
              } else {
                return (
                  <NavbarMenuItem key={item.url} className="w-full">
                    <Link
                      href={item.url}
                      className={cn(
                        buttonVariants({ variant: "link", size: "sm" }),
                        " inline w-full px-0 py-1 text-foreground/90 hover:text-primary/80 dark:text-foreground/60 dark:hover:text-primary/60",
                      )}
                    >
                      <span className="inline">{item?.title}</span>
                    </Link>
                  </NavbarMenuItem>
                );
              }
            } else {
              return null;
            }
          })}
        </div>
      </NavbarMenu>
    </Navbar>
  );
}

{
  /* <div className="hidden items-center lg:flex">
        {topMenuItems &&
          topMenuItems.map((item, key) => {
            if (item._type === "link") {
              if (item.type === "button") {
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-md bg-primary-700 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-600 dark:bg-primary-500 dark:hover:bg-primary-400 md:ml-2"
                  >
                    <span className="">{item.text}</span>
                  </Link>
                );
              } else {
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
                  >
                    <span className="hidden md:mr-2 md:inline">
                      {item.text}
                    </span>
                  </Link>
                );
              }
            } else if (item._type === "reference") {
              const href = resolveHref(item?._type, item?.slug || "");
              if (!href) {
                return null;
              }

              const isActive = currentPath === href;

              return (
                <Link
                  href={href}
                  key={href}
                  className={`mr-2 text-sm font-medium text-gray-900 hover:text-primary-500
                      ${isActive ? "text-primary-600" : ""}
                      `}
                >
                  <span className="mr-2 hidden md:inline">{item.title}</span>
                </Link>
              );
            }
            return null; // To handle any unexpected items
          })}
        <span className="ml-2 mr-0 h-5 w-px bg-gray-200 dark:bg-gray-600 lg:ml-5 lg:mr-3 lg:inline"></span>
        {socialMedia &&
          socialMedia.map((item, key) => {
            if (item._type === "facebook") {
              return (
                <Link
                  key={item.href ? item.href : key}
                  href={item.href ? item.href : "#"}
                  title="Facebook"
                  className="inline-flex items-center rounded-lg p-2 text-sm font-medium text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-600"
                >
                  <svg
                    className="h-4 w-4"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 320 512"
                  >
                    <path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z" />
                  </svg>
                </Link>
              );
            } else if (item._type === "twitter") {
              return (
                <Link
                  key={item.href ? item.href : key}
                  href={item.href ? item.href : "#"}
                  title="Twitter"
                  className="inline-flex items-center rounded-lg p-2 text-sm font-medium text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-600"
                >
                  <svg
                    className="h-4 w-4"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 448 512"
                  >
                    <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
                  </svg>
                </Link>
              );
            } else if (item._type === "instagram") {
              return (
                <Link
                  key={item.href ? item.href : key}
                  href={item.href ? item.href : "#"}
                  title="Instagram"
                  className="inline-flex items-center rounded-lg p-2 text-sm font-medium text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-600"
                >
                  <svg
                    className="h-4 w-4"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                  >
                    <path d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z" />
                  </svg>
                </Link>
              );
            } else if (item._type === "tiktok") {
              return (
                <Link
                  key={item.href ? item.href : key}
                  href={item.href ? item.href : "#"}
                  title="TikTok"
                  className="inline-flex items-center rounded-lg p-2 text-sm font-medium text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-600"
                >
                  <svg
                    className="h-4 w-4"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 448 512"
                  >
                    <path d="M448,209.91a210.06,210.06,0,0,1-122.77-39.25V349.38A162.55,162.55,0,1,1,185,188.31V278.2a74.62,74.62,0,1,0,52.23,71.18V0l88,0a121.18,121.18,0,0,0,1.86,22.17h0A122.18,122.18,0,0,0,381,102.39a121.43,121.43,0,0,0,67,20.14Z" />
                  </svg>
                </Link>
              );
            }
            return null;
          })}
      </div> */
}
