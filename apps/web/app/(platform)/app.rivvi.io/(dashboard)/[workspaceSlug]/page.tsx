import WorkspaceClient from "./_components/page-client";
import { getSites } from "@/lib/fetchers";

export default async function Workspace({
	params,
}: {
	params: {
		workspaceSlug: string;
	};
}) {
	const { workspaceSlug } = params || ({} as { workspaceSlug: string });
	const sites = await getSites({ workspaceSlug });

	if (!sites) return null;

	return <WorkspaceClient sites={sites} />;
}
