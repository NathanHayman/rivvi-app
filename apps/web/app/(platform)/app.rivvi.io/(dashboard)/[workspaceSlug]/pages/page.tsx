import SyncFromStudio from "@/components/sync-pages-button";
import { getPagesByWorkspace } from "@/lib/actions/workspace";
import { DataTable } from "@/ui/sites/pages";
import { columns } from "@/ui/sites/pages/columns";
import { Header } from "@/ui/layout/dashboard/header";
import { Main } from "@/ui/layout/dashboard/main";
import { Shell } from "@/ui/layout/dashboard/shell";

export const revalidate = 1;

export default async function WorkspacePagesPage({
	params,
}: {
	params: { workspaceSlug: string };
}) {
	const { workspaceSlug } = params as { workspaceSlug: string };
	const allPages = await getPagesByWorkspace({ workspaceSlug });

	if (!allPages) {
		return <div>loading...</div>;
	}

	const pages = allPages.map((page) => ({
		id: page.id,
		url:
			page.domain && `${page.domain}/${page.slug}`
				? `${page.domain}/${page.slug}`
				: page.siteDomainSlug && page.siteDomainSlug
				? `${page.siteDomainSlug}/${page.slug}`
				: (page.slug as string),
		title: page.title || "Untitled",
		label: "bug",
		status: page.published ? "published" : "draft",
		type: page.type,
	}));

	return (
		<>
			<Shell>
				<Header heading="All pages">
					<div className="flex items-center space-x-4">
						<SyncFromStudio />
					</div>
				</Header>
				<Main>
					<DataTable data={pages} columns={columns} />
				</Main>
			</Shell>
		</>
	);
}
