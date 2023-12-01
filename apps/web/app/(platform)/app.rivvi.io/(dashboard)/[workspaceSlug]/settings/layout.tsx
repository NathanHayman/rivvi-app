import { ReactNode } from "react";

import { Header } from "@/ui/layout/dashboard/header";
import { Main } from "@/ui/layout/dashboard/main";
import { Shell } from "@/ui/layout/dashboard/shell";
import WorkspaceSettingsNav from "@/ui/workspaces/nav";

export default async function WorkspaceSettingsLayout({
	children,
}: {
	children: ReactNode;
}) {
	return (
		<>
			<Shell className="h-full">
				<Header heading="Settings" />
				<Main className="flex flex-col">
					<WorkspaceSettingsNav />
					<div className="grid gap-5 md:col-span-4">{children}</div>
				</Main>
			</Shell>
		</>
	);
}
