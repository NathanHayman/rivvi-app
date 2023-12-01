"use client";

import { Badge, Card, Skeleton } from "@phunq/ui";
import { Page } from "@prisma/client";
import Link from "next/link";
import { useParams } from "next/navigation";

import PageOps from "./ops";

export default function PageCard({
  data,
  ops,
}: {
  data: Page | any;
  ops: boolean;
}) {
  const { id, title, published, slug } = data as Page;
  const { key } = useParams() as { key: string };
  return (
    <Card className="border-border hover:bg-secondary/10 bg-card hover:shadow-primary/40 flex cursor-pointer items-center justify-between p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="grid gap-1">
        <Link href={`/funnel/${slug}`} className="hover:underline">
          <h3 className="text-foreground text-lg font-semibold tracking-tight">
            {title || "Untitled"}
          </h3>
        </Link>
        <div>
          {published && key ? (
            <Badge variant="success">Published</Badge>
          ) : (
            <Badge variant="gray">Draft</Badge>
          )}{" "}
        </div>
      </div>
      {ops && <PageOps id={id} page={data as any} />}
    </Card>
  );
}

PageCard.Skeleton = function PageCardSkeleton() {
  return (
    <div className="p-4">
      <div className="space-y-3">
        <Skeleton className="h-5 w-2/5" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    </div>
  );
};
