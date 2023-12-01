import { getWorkspaces } from "@/lib/old-fetchers";
import NoWorkspacesPlaceholder from "@/ui/workspaces/no-workspaces-placeholder";
import WorkspaceCard from "@/ui/workspaces/workspace-card";

export default async function WorkspaceList() {
	const workspaces = await getWorkspaces();

	if (!workspaces || workspaces.length === 0) {
		return <NoWorkspacesPlaceholder />;
	}

	// @ts-expect-error
	return workspaces.map((d) => <WorkspaceCard key={d.slug} {...d} />);
}
