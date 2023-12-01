import { ReactNode } from "react";

import WorkspaceAuth from "./_components/auth";

export default function WorkspaceLayout({ children }: { children: ReactNode }) {
	return <WorkspaceAuth>{children}</WorkspaceAuth>;
}
