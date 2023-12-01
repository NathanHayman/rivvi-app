import { ReactNode, Suspense } from "react";

import { Nav } from "@/ui/layout/dashboard/nav";
import Sidebar from "@/ui/layout/dashboard/sidebar";
import WorkspaceSelect from "@/ui/layout/workspace-select";
import WorkspaceSelectPlaceholder from "@/ui/layout/workspace-select/placeholder";
import UserProfile from "@/ui/layout/dashboard/nav/user-profile";

export default function AppLayout({ children }: { children: ReactNode }) {
	return (
		<div className="flex h-screen">
			<nav className="border-border sticky top-0 z-[999] h-screen border-r">
				<Sidebar>
					<Suspense fallback={<WorkspaceSelectPlaceholder />}>
						<WorkspaceSelect />
					</Suspense>
					{/* <UpgradeBanner /> */}
				</Sidebar>
			</nav>
			<div className="w-full pb-20">
				<Nav>
					<Suspense fallback={<div>Loading...</div>}>
						<UserProfile />
					</Suspense>
				</Nav>
				{children}
			</div>
		</div>
	);
}
