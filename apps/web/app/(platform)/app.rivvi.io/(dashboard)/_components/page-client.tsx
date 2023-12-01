import { Suspense } from "react";

import { Header } from "@/ui/layout/dashboard/header";
import { Main } from "@/ui/layout/dashboard/main";
import { Shell } from "@/ui/layout/dashboard/shell";
import CreateWorkspaceButton from "@/ui/workspaces/create-workspace-button";
import WorkspaceCardPlaceholder from "@/ui/workspaces/workspace-card-placeholder";
import WorkspaceList from "@/ui/workspaces/workspace-list";

export default function AppPageClient() {
	return (
		<Shell>
			<Header heading={`My Workspaces`}>
				<CreateWorkspaceButton />
			</Header>
			<Main>
				<div className="my-10 grid w-full grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
					<Suspense
						fallback={Array.from({ length: 6 }).map((_, i) => (
							<WorkspaceCardPlaceholder key={i} />
						))}
					>
						<WorkspaceList />
					</Suspense>
				</div>
			</Main>
		</Shell>
	);
}
