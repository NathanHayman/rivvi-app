"use client";

import { usePathname } from "next/navigation";

import { MenuItem, SocialMedia, TopMenuItem } from "@/types";

import { Menu } from "./NavbarMenu";
import { TopMenu } from "./NavbarTopMenu";

export interface NavbarProps {
  data:
    | {
        menuItems?: MenuItem[];
        topMenuItems?: TopMenuItem[];
        socialMedia?: SocialMedia[];
        logo?: {
          asset: {
            _ref: string;
            _type: string;
          };
        };
      }
    | null
    | undefined;
}

export default function NavbarLayout(data: NavbarProps) {
  const menuItems = data?.data?.menuItems;
  const topMenuItems = data?.data?.topMenuItems;
  const socialMedia = data?.data?.socialMedia;
  const logo = data?.data?.logo;
  const pathname = usePathname();

  return (
    <div className="sticky top-0 z-[99] w-full">
      <header className="w-full shadow">
        <TopMenu
          menuItems={menuItems as any}
          pathname={pathname}
          topMenuItems={topMenuItems}
          logo={logo}
          socialMedia={socialMedia}
        />
        <Menu menuItems={menuItems} pathname={pathname} />
      </header>
    </div>
  );
}
