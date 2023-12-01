"use client";

import { Card, Skeleton } from "@phunq/ui";
import { Page } from "@prisma/client";

export default function AddPageItem({ data }: { data: Page | any }) {
  const { id, title, published, slug } = data as Page;
  return (
    <Card className="border-card bg-card relative flex w-full items-center justify-between p-3">
      <div className="grid gap-1">
        <p className="text-foreground text-sm">{title || "Untitled"}</p>
        <p className="text-muted-foreground text-xs">/{slug}</p>
      </div>
    </Card>
  );
}

AddPageItem.Skeleton = function PageItemSkeleton() {
  return (
    <div className="p-4">
      <div className="space-y-3">
        <Skeleton className="h-5 w-2/5" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    </div>
  );
};
