"use client";
import { Badge, buttonVariants, Card, Tooltip } from "@phunq/ui";
// import { Badge } from "appui";
import { cn, nFormatter } from "@phunq/utils";
import { ExternalLink, Globe } from "lucide-react";
import Link from "next/link";

import { DomainProps, WorkspaceWithDomainProps } from "@/lib/types";

import { CheckCircleFill, XCircleFill } from "../shared/icons";
import PlanBadge from "./plan-badge";
import { GlobeIcon } from "@radix-ui/react-icons";

export default function WorkspaceCard({
	name,
	slug,
	plan,
	domains,
	primaryDomain,
}: WorkspaceWithDomainProps & { id: string }) {
	return (
		<Link key={slug} href={`/${slug}`} className="w-full">
			<Card className="border-accent hover:bg-secondary/10 bg-card hover:shadow-primary/40 relative flex w-full cursor-pointer flex-col items-start justify-between space-y-6 p-4 shadow-sm transition-shadow hover:shadow-md lg:col-span-2">
				<div className="flex items-start justify-between">
					<div className="flex items-center space-x-3">
						<div>
							<h3 className="text-foreground text-lg font-semibold tracking-tight">
								{name}
							</h3>
							<div className="text-foreground flex items-center">
								<p className="text-muted-foreground text-sm">
									{primaryDomain?.slug}
								</p>
								<Tooltip
									content={
										<DomainsTooltip
											domains={domains}
											title={
												domains.length > 1
													? "Here are all the domains for this workspace."
													: primaryDomain?.verified
													? "Your domain is verified. You can start adding funnels."
													: "Please verify your domain to start adding funnels."
											}
											cta={
												domains.length > 1
													? "Manage Domains"
													: primaryDomain?.verified
													? "Manage Domain"
													: "Verify Domain"
											}
											href={`/${slug}/domains`}
										/>
									}
								>
									<div className="text-muted-foreground ml-1 flex items-center">
										{domains.length > 1 ? (
											<Badge variant="success" className="">
												+{domains.length - 1}
											</Badge>
										) : primaryDomain?.verified ? (
											<CheckCircleFill className="h-4 w-4 text-blue-500" />
										) : (
											<XCircleFill className="text-muted-foreground h-4 w-4" />
										)}
									</div>
								</Tooltip>
							</div>
						</div>
					</div>
					<div className="absolute right-4 top-4">
						<PlanBadge plan={plan} />
					</div>
				</div>
				<div className="flex items-center space-x-4">
					<div className="text-muted-foreground flex items-center space-x-2">
						<GlobeIcon className="h-4 w-4" />
						<h2 className="whitespace-nowrap text-sm">
							{nFormatter(domains.length)} domain{domains.length > 1 && "s"}
						</h2>
					</div>
				</div>
			</Card>
		</Link>
	);
}

const DomainsTooltip = ({
	domains,
	title,
	cta,
	href,
}: {
	domains: DomainProps[];
	title: string;
	cta?: string;
	href: string;
}) => {
	return (
		<div
			className="bg-popover border-border flex w-full flex-col items-center space-y-2 p-4 md:w-60"
			onClick={(e) => e.stopPropagation()}
		>
			<p className="text-muted-foreground px-2 text-sm">{title}</p>
			<div className="flex w-full flex-col">
				{domains.map(({ slug, verified }) => (
					<a
						key={slug}
						href={`https://${slug}`}
						target="_blank"
						rel="noopener noreferrer"
						className="hover:bg-accent group flex items-center justify-between rounded-md p-2 transition-all"
					>
						<div className="flex items-center space-x-1">
							{verified ? (
								<CheckCircleFill className="h-4 w-4 text-blue-500" />
							) : (
								<XCircleFill className="text-muted-foreground h-4 w-4" />
							)}
							<p className="text-foreground text-sm font-semibold">{slug}</p>
						</div>
						<ExternalLink className="text-muted-foreground h-4 w-4 md:invisible md:group-hover:visible" />
					</a>
				))}
			</div>

			<div className="mt-2 w-full px-2">
				<Link
					href={href}
					className={cn(buttonVariants({ variant: "default" }), "w-full")} // TODO: Fix this
				>
					{cta}
				</Link>
			</div>
		</div>
	);
};
