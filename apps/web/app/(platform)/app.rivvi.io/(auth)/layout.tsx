import { ReactNode } from "react";

export const runtime = "edge";

export default function AuthLayout({ children }: { children: ReactNode }) {
	return <div className="relative flex flex-col">{children}</div>;
}
