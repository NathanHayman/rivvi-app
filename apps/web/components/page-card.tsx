"use client";

import BlurImage from "@/components/blur-image";
import { placeholderBlurhash, random } from "@/lib/utils";
import { Badge, Card } from "@phunq/ui";
import { Page, Site } from "@prisma/client";
import { BarChart, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function PageCard({
	data,
}: {
	data: Page & { site: Site | null };
}) {
	const url = `${data.site?.subdomain}.${process.env.NEXT_PUBLIC_USER_SUBDOMAIN}/${data.slug}`;

	return (
		<Card className="border-accent hover:bg-secondary/10 bg-card hover:shadow-primary/40 relative flex w-fit cursor-pointer flex-col items-start justify-between space-y-6 p-4 shadow-sm transition-shadow hover:shadow-md lg:col-span-2">
			<Link href={`/page/${data.id}`} className="flex flex-col ">
				<div className="relative h-44 overflow-hidden">
					<BlurImage
						alt={data.title ?? "Card thumbnail"}
						width={500}
						height={400}
						className="h-full object-cover"
						src={data.image ?? "/placeholder.png"}
						placeholder="blur"
						blurDataURL={data.imageBlurhash ?? placeholderBlurhash}
					/>
					{!data.published && (
						<Badge variant="secondary" className="absolute top-4 left-4">
							Draft
						</Badge>
					)}
				</div>
				<div className="border-t p-4">
					<h3 className="text-foreground text-lg font-semibold tracking-tight">
						{data.title}
					</h3>
					<p className="text-muted-foreground text-sm">{data.description}</p>
				</div>
			</Link>
			<div className="absolute bottom-4 flex w-full px-4">
				<a
					href={
						process.env.NEXT_PUBLIC_VERCEL_ENV
							? `https://${url}`
							: `http://${data.site?.subdomain}.localhost:3000/${data.slug}`
					}
					target="_blank"
					rel="noreferrer"
				>
					{url} ↗
				</a>
			</div>
		</Card>
	);
}
