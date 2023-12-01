"use client";

import {
  DashIcons,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  IconMenu,
} from "@phunq/ui";
import { Monitor } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeSwitch() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="hover:text-foreground text-muted-foreground block w-full rounded-md p-2 text-base font-medium transition-all duration-75">
        <IconMenu text="Theme" icon={<DashIcons.moon className="h-4 w-4" />} />
      </DropdownMenuTrigger>
      <DropdownMenuContent side="right" className="">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <IconMenu text="Light" icon={<DashIcons.sun className="h-4 w-4" />} />
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <IconMenu text="Dark" icon={<DashIcons.moon className="h-4 w-4" />} />
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          <IconMenu text="Theme" icon={<Monitor className="h-4 w-4" />} />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
