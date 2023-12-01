import { getWorkspaces } from "@/lib/old-fetchers";

import WorkspaceSelectClient from "./client";

export default async function WorkspaceSelect() {
	const workspaces = await getWorkspaces();
	return <WorkspaceSelectClient workspaces={workspaces || ([] as any)} />;
}
