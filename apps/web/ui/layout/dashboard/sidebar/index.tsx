"use client";

import { DashIcons, dButton as Button } from "@phunq/ui";
import { cn } from "@phunq/utils";
import Link from "next/link";
import { useParams, useSelectedLayoutSegments } from "next/navigation";
import { useMemo } from "react";
import UpgradeBanner from "../../upgrade-banner";

const Sidebar = ({ children }: { children: React.ReactNode }) => {
	const segments = useSelectedLayoutSegments();
	const { workspaceSlug, key } = useParams() as {
		workspaceSlug?: string;
		key?: string;
	};

	const tabs = useMemo(() => {
		if (key && segments[0] === "site" && segments.length === 2) {
			return [
				{
					name: "Back to All Sites",
					href: `/${workspaceSlug}`,
					icon: "arrowLeft",
				},
			];
		} else if (key) {
			return [
				{
					name: "Back to All Sites",
					href: `/${workspaceSlug}`,
					icon: "arrowLeft",
				},
				{
					name: "Pages",
					href: `/${workspaceSlug}/sites/${key}/pages`,
					isActive: segments[segments.length - 1] === "pages",
					icon: "funnelPage",
					group: 1,
				},
				{
					name: "Tracking",
					href: `/${workspaceSlug}/sites/${key}/tracking`,
					isActive: segments.includes("tracking"),
					icon: "domain",
					group: 2,
				},
				{
					name: "Settings",
					href: `/${workspaceSlug}/sites/${key}/settings`,
					isActive: segments.includes("settings"),
					icon: "settings",
					group: 3,
				},
			];
		} else if (workspaceSlug) {
			return [
				{
					name: "Overview",
					href: `/${workspaceSlug}`,
					isActive: segments.length === 0,
					icon: "layoutDashboard",
					group: 1,
				},
				{
					name: "Pages",
					href: `/${workspaceSlug}/pages`,
					isActive: segments[segments.length - 1] === "pages",
					icon: "funnelPage",
					group: 1,
				},
				{
					name: "Domains",
					href: `/${workspaceSlug}/domains`,
					isActive: segments.includes("domains"),
					icon: "domain",
					group: 1,
				},
				{
					name: "Analytics",
					href: `/${workspaceSlug}/analytics`,
					isActive: segments[segments.length - 1] === "analytics",
					icon: "funnelAnalytics",
					group: 1,
				},
				{
					name: "Settings",
					href: `/${workspaceSlug}/settings`,
					isActive: segments.includes("settings"),
					icon: "settings",
					group: 3,
				},
			];
		}
		return [
			{
				name: "Workspaces",
				href: "/",
				isActive: segments.length === 0,
				icon: "funnel",
				group: 1,
			},
			{
				name: "Settings",
				href: "/settings",
				isActive: segments[0] === "settings",
				icon: "funnelSettings",
				group: 2,
			},
		];
	}, [segments, key, workspaceSlug]);

	return (
		<div
			className={cn(
				"w-44 lg:w-[265px] hidden h-full flex-shrink-0 flex-col justify-between md:flex"
			)}
		>
			<div className="space-y-4 py-4">
				{children}
				<div className="flex items-center">
					<UpgradeBanner />
				</div>
				<div
					className={cn(
						"flex w-full items-start  justify-start px-6 py-2space-x-2"
					)}
				></div>
				<div className={cn("px-3 py-2 flex flex-col space-y-2")}>
					<div className="flex flex-col space-y-2">
						{tabs.map((item, index) => {
							const Icon = DashIcons[item.icon as keyof typeof DashIcons];
							return (
								item.href && (
									<Link key={index} href={item.href}>
										<Button
											variant="ghost"
											className={cn(
												"hover:bg-muted/50 hover:text-foreground text-muted-foreground w-full rounded-md font-medium transition-all focus:outline-none",
												item.isActive &&
													"bg-muted/50 border-border text-foreground justify-start  px-3 py-1"
											)}
										>
											<Icon className={cn("h-5 w-5 mr-2")} />
											<span className={cn("inline-block")}>{item.name}</span>
										</Button>
									</Link>
								)
							);
						})}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Sidebar;
