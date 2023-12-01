"use client";

import { APP_DOMAIN, cn } from "@phunq/utils";
import { ChevronDown, Menu, X } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

import { navItems } from "./nav";

export default function MobileNav() {
	const { domain = "rivvi.io" } = useParams() as { domain: string };
	const [open, setOpen] = useState(false);

	return (
		<>
			<button
				onClick={() => setOpen(!open)}
				className={cn(
					"absolute right-3 top-3 z-40 rounded-full p-2 transition-colors duration-200 hover:bg-gray-200 focus:outline-none active:bg-gray-300 lg:hidden",
					open && "hover:bg-gray-100 active:bg-gray-200"
				)}
			>
				{open ? (
					<X className="h-5 w-5 text-gray-600" />
				) : (
					<Menu className="h-5 w-5 text-gray-600" />
				)}
			</button>
			<nav
				className={cn(
					"fixed inset-0 z-20 hidden w-full bg-white px-5 py-16",
					open && "block"
				)}
			>
				<ul className="grid divide-y divide-gray-200">
					{navItems.map(({ name, slug }) => (
						<li key={slug} className="py-3">
							<Link
								href={
									domain === "rivvi.io"
										? `/${slug}`
										: `https://rivvi.io/${slug}?utm_source=${domain}&utm_medium=referral&utm_campaign=custom-domain`
								}
								onClick={() => setOpen(false)}
								className="flex w-full font-semibold capitalize"
							>
								{name}
							</Link>
						</li>
					))}
					<>
						<li className="py-3">
							<Link
								href={`${APP_DOMAIN}/login`}
								className="flex w-full font-semibold capitalize"
							>
								Log in
							</Link>
						</li>

						<li className="py-3">
							<Link
								href={`${APP_DOMAIN}/register`}
								className="flex w-full font-semibold capitalize"
							>
								Sign Up
							</Link>
						</li>
					</>
				</ul>
			</nav>
		</>
	);
}
