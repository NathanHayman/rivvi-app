"use client";

import { Logo, LogoType, MaxWidthWrapper, useScroll } from "@phunq/ui";
import { APP_DOMAIN, SHOW_BACKGROUND_SEGMENTS, cn } from "@phunq/utils";
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import va from "@vercel/analytics";
import Link from "next/link";
import { useParams, useSelectedLayoutSegment } from "next/navigation";

export const navItems = [
	{
		name: "Customers",
		slug: "customers",
	},
	{
		name: "Changelog",
		slug: "changelog",
	},
	{
		name: "Help",
		slug: "help",
	},
	{
		name: "Pricing",
		slug: "pricing",
	},
];

export default function Nav() {
	const { domain = "rivvi.io" } = useParams() as { domain: string };
	const scrolled = useScroll(80);
	const selectedLayout = useSelectedLayoutSegment();
	const helpCenter = selectedLayout === "help";

	return (
		<div
			className={cn(`sticky inset-x-0 top-0 z-30 w-full transition-all`, {
				"border-b border-gray-200 bg-white/75 backdrop-blur-lg": scrolled,
				"border-b border-gray-200 bg-white":
					selectedLayout && !SHOW_BACKGROUND_SEGMENTS.includes(selectedLayout),
			})}
		>
			<MaxWidthWrapper
				{...(helpCenter && {
					className: "max-w-screen-lg",
				})}
			>
				<div className="flex h-14 items-center justify-between">
					<Link
						href={domain === "rivvi.io" ? "/" : `https://rivvi.io`}
						{...(domain !== "rivvi.io" && {
							onClick: () => {
								va.track("Referred from custom domain", {
									domain,
									medium: "logo",
								});
							},
						})}
						className="flex items-center"
					>
						<Logo className="h-6 w-auto" />
						<LogoType className="fill-primary text-primary" />
					</Link>
					<div className="flex items-center space-x-4">
						{helpCenter ? (
							<div className="flex items-center">
								<div className="mr-3 h-5 border-l-2 border-gray-400" />
								<Link
									href="/help"
									className="font-display text-lg font-bold text-gray-700"
								>
									Help Center
								</Link>
							</div>
						) : (
							<NavigationMenuPrimitive.Root
								delayDuration={0}
								className="relative hidden lg:block"
							>
								<NavigationMenuPrimitive.List className="flex flex-row space-x-2 p-4">
									{navItems.map(({ name, slug }) => (
										<NavigationMenuPrimitive.Item key={slug} asChild>
											<Link
												id={`nav-${slug}`}
												key={slug}
												href={
													domain === "rivvi.io"
														? `/${slug}`
														: `https://rivvi.io/${slug}`
												}
												{...(domain !== "rivvi.io" && {
													onClick: () => {
														va.track("Referred from custom domain", {
															domain,
															medium: `navbar item (${slug})`,
														});
													},
												})}
												className={cn(
													"rounded-md px-3 py-2 text-sm font-medium text-gray-500 transition-colors ease-out hover:text-black",
													{
														"text-black": selectedLayout === slug,
													}
												)}
											>
												{name}
											</Link>
										</NavigationMenuPrimitive.Item>
									))}
								</NavigationMenuPrimitive.List>

								<NavigationMenuPrimitive.Viewport className="data-[state=closed]:animate-scale-out-content data-[state=open]:animate-scale-in-content absolute left-0 top-full flex w-[var(--radix-navigation-menu-viewport-width)] origin-[top_center] justify-start rounded-lg border border-gray-200 bg-white shadow-lg" />
							</NavigationMenuPrimitive.Root>
						)}
					</div>

					<div className="hidden lg:block">
						<>
							<Link
								href={`${APP_DOMAIN}/login`}
								{...(domain !== "rivvi.io" && {
									onClick: () => {
										va.track("Referred from custom domain", {
											domain,
											medium: `navbar item (login)`,
										});
									},
								})}
								className="animate-fade-in rounded-full px-4 py-1.5 text-sm font-medium text-gray-500 transition-colors ease-out hover:text-black"
							>
								Log in
							</Link>
							<Link
								href={`${APP_DOMAIN}/register`}
								{...(domain !== "rivvi.io" && {
									onClick: () => {
										va.track("Referred from custom domain", {
											domain,
											medium: `navbar item (signup)`,
										});
									},
								})}
								className="animate-fade-in rounded-full border border-black bg-black px-4 py-1.5 text-sm text-white transition-all hover:bg-white hover:text-black"
							>
								Sign Up
							</Link>
						</>
					</div>
				</div>
			</MaxWidthWrapper>
		</div>
	);
}
