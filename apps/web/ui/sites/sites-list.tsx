import SitesContainer from "./sites-container";
import { getSites } from "@/lib/fetchers";

export default async function SitesList({
	workspaceSlug,
}: {
	workspaceSlug: string;
}) {
	const sites = await getSites({ workspaceSlug });

	// @ts-expect-error
	return <SitesContainer sites={sites} />;
}
