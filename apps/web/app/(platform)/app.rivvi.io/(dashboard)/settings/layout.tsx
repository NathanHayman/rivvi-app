import { ReactNode } from "react";

import { Header } from "@/ui/layout/dashboard/header";
import { Main } from "@/ui/layout/dashboard/main";
import { Shell } from "@/ui/layout/dashboard/shell";

export default function PersonalSettingsLayout({
	children,
}: {
	children: ReactNode;
}) {
	return (
		<>
			<Shell>
				<Header heading="Settings" />
				<Main className="mt-8 flex flex-col">
					<div className="grid gap-5 md:col-span-4">{children}</div>
				</Main>
			</Shell>
		</>
	);
}
