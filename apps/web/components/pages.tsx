import prisma from "@/lib/prisma";
import PageCard from "./page-card";
import Image from "next/image";

export default async function Pages({
	siteId,
	limit,
}: {
	siteId?: string;
	limit?: number;
}) {
	const pages = await prisma.page.findMany({
		where: {
			siteId: siteId,
		},
		orderBy: {
			updatedAt: "desc",
		},
		include: {
			site: true,
		},
		...(limit ? { take: limit } : {}),
	});

	return pages.length > 0 ? (
		<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
			{pages.map((page) => (
				<PageCard key={page.id} data={page} />
			))}
		</div>
	) : (
		<div className="flex flex-col items-center space-x-4">
			<h1 className="text-4xl">No Pages Yet</h1>
			<Image
				alt="missing page"
				src="https://illustrations.popsy.co/gray/graphic-design.svg"
				width={400}
				height={400}
			/>
			<p className="text-lg text-muted-foreground">
				You do not have any pages yet. Create one to get started.
			</p>
		</div>
	);
}
