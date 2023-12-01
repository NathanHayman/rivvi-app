"use client";

import { Button } from "@phunq/ui";
import { cn } from "@phunq/utils";
import Link from "next/link";
import { useParams, useSelectedLayoutSegment } from "next/navigation";

export default function WorkspaceSettingsNav() {
  const segment = useSelectedLayoutSegment();
  const { workspaceSlug } = useParams() as { workspaceSlug: string };

  const navItems = [
    {
      name: "General",
      href: `/${workspaceSlug}/settings`,
      segment: null,
    },
    {
      name: "People",
      href: `/${workspaceSlug}/settings/people`,
      segment: "people",
    },
    {
      name: "Billing",
      href: `/${workspaceSlug}/settings/billing`,
      segment: "billing",
    },
    {
      name: "Credentials",
      href: `/${workspaceSlug}/settings/credentials`,
      segment: "credentials",
    },
  ];

  return (
    <div className="mb-4 flex space-x-4 pb-4 pt-2 lg:mb-8">
      {navItems.map((item) => (
        <Link key={item.name} href={item.href}>
          <Button
            variant="ghost"
            className={cn(
              "hover:bg-secondary-foreground/10 hover:text-secondary-foreground/50 text-muted-foreground inline-flex h-8 cursor-pointer select-none items-center rounded-md px-2 text-sm font-medium transition-all focus:outline-none",
              segment === item.segment &&
                "bg-secondary-foreground/10 border-border text-foreground",
            )}
            text={item.name}
          />
        </Link>
      ))}
    </div>
  );
}
