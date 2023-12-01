import { ReactNode } from "react";

import Background from "@/ui/home/background";
import Footer from "@/ui/home/footer";
import Nav from "@/ui/home/nav";
import MobileNav from "@/ui/home/nav-mobile";

export default function MarketingLayout({ children }: { children: ReactNode }) {
	return (
		<div className="flex min-h-screen flex-col justify-between">
			<MobileNav />
			<Nav />
			{children}
			<Footer />
			<Background />
		</div>
	);
}
