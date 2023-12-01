"use client";

import { Card, Skeleton } from "@phunq/ui";
import { formatDated } from "@phunq/utils";
import { Site } from "@prisma/client";
import Link from "next/link";
import { useParams } from "next/navigation";

import { SiteOps } from "./ops";

export default function SiteCard({ data }: { data: Site }) {
	const { workspaceSlug } = useParams() as { workspaceSlug: string };
	return (
		<Card className="border-accent hover:bg-secondary/10 bg-card hover:shadow-primary/40 flex cursor-pointer items-center justify-between p-4 shadow-sm transition-shadow hover:shadow-md">
			<Link href={`/${workspaceSlug}/sites/${data.key}`} className="w-full">
				<div className="grid gap-1">
					<h3 className="text-foreground text-lg font-semibold tracking-tight">
						{data.name ?? "Untitled"}
					</h3>
					<div>
						<p className="text-muted-foreground text-sm">
							{data.createdAt ? formatDated(data.createdAt as any) : "No date"}
						</p>
					</div>
				</div>
			</Link>
			<SiteOps key={data.key as string} site={data} />
		</Card>
	);
}

SiteCard.Skeleton = function SiteCardSkeleton() {
	return (
		<div className="p-4">
			<div className="space-y-3">
				<Skeleton className="h-5 w-2/5" />
				<Skeleton className="h-4 w-4/5" />
			</div>
		</div>
	);
};
