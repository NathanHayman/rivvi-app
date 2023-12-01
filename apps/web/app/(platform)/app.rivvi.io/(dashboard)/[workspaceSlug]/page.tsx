import { Suspense } from "react";
import Sites from "@/components/sites";
import OverviewStats from "@/components/overview-stats";
import Pages from "@/components/pages";
import { Header } from "@/ui/layout/dashboard/header";
import { Main } from "@/ui/layout/dashboard/main";
import { Shell } from "@/ui/layout/dashboard/shell";
import PlaceholderCard from "@/components/placeholder-card";

export default function Overview() {
	return (
		<Shell>
			<Header heading="Home" />
			<Main>
				<div className="flex flex-col space-y-6">
					<h1 className="font-cal text-3xl font-bold dark:text-white">
						Overview
					</h1>
					<OverviewStats />
				</div>

				<div className="flex flex-col space-y-6">
					<h1 className="font-cal text-3xl font-bold dark:text-white">
						Recent Pages
					</h1>
					<Suspense
						fallback={
							<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
								{Array.from({ length: 8 }).map((_, i) => (
									<PlaceholderCard key={i} />
								))}
							</div>
						}
					>
						<Pages limit={8} />
					</Suspense>
				</div>
			</Main>
		</Shell>
	);
}

// import WorkspaceClient from "./page-client";
// import { getSites } from "@/lib/fetchers";

// export default async function Workspace({
// 	params,
// }: {
// 	params: {
// 		workspaceSlug: string;
// 	};
// }) {
// 	const { workspaceSlug } = params || ({} as { workspaceSlug: string });
// 	const sites = await getSites({ workspaceSlug });

// 	if (!sites) return null;

// 	return <WorkspaceClient sites={sites} />;
// }
