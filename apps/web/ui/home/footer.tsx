"use client";

import { LinkedIn, LogoType, MaxWidthWrapper, Twitter } from "@phunq/ui";
import va from "@vercel/analytics";
import Link from "next/link";
import { useParams } from "next/navigation";

const navigation = {
	product: [
		{ name: "Blog", href: "/blog" },
		{ name: "Changelog", href: "/changelog" },
		{ name: "Customer Stories", href: "/customers" },
		{ name: "Help Center", href: "/help" },
		{ name: "Pricing", href: "/pricing" },
	],
	tools: [
		{ name: "Metatags API", href: "/tools/metatags" },
		{ name: "Link Inspector", href: "/tools/inspector" },
	],
	legal: [
		{ name: "Privacy", href: "/privacy" },
		{ name: "Terms", href: "/terms" },
		{ name: "Abuse", href: "/abuse" },
	],
};

export default function Footer() {
	const { domain = "rivvi.io" } = useParams() as { domain: string };

	const createHref = (href: string) =>
		domain === "rivvi.io" ? href : `https://rivvi.io${href}`;

	return (
		<footer className="z-10 border-t border-gray-200 bg-white/50 py-8 backdrop-blur-lg">
			<MaxWidthWrapper className="pt-10">
				<div className="xl:grid xl:grid-cols-5 xl:gap-8">
					<div className="space-y-8 xl:col-span-2">
						<Link
							href={createHref("/")}
							{...(domain !== "rivvi.io" && {
								onClick: () => {
									va.track("Referred from custom domain", {
										domain,
										medium: `footer item (logo)`,
									});
								},
							})}
						>
							<span className="sr-only">rivvi.io Logo</span>
							<LogoType className="h-7 text-gray-600" />
						</Link>
						<p className="max-w-xs text-sm text-gray-500">
							Giving modern marketing teams superpowers with short links that
							stand out.
						</p>
						<div className="flex items-center space-x-2">
							<a
								href="https://twitter.com/phunqHQ"
								target="_blank"
								rel="noreferrer"
								className="group rounded-md p-2 transition-colors hover:bg-gray-100 active:bg-gray-200"
							>
								<span className="sr-only">Twitter</span>
								<Twitter className="h-5 w-5 text-gray-600" />
							</a>
							<div className="h-8 border-l border-gray-200" />
							<a
								href="https://www.linkedin.com/company/phunqHQ/"
								target="_blank"
								rel="noreferrer"
								className="rounded-md p-2 transition-colors hover:bg-gray-100 active:bg-gray-200"
							>
								<span className="sr-only">LinkedIn</span>
								<LinkedIn className="h-5 w-5" fill="#52525B" />
							</a>
						</div>
					</div>
					<div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-3 xl:mt-0">
						<div className="md:grid md:grid-cols-2 md:gap-8">
							<div className="mt-10 md:mt-0">
								<h3 className="text-sm font-semibold text-gray-600">Product</h3>
								<ul role="list" className="mt-4 space-y-4">
									{navigation.product.map((item) => (
										<li key={item.name}>
											<Link
												href={createHref(item.href)}
												{...(domain !== "rivvi.io" && {
													onClick: () => {
														va.track("Referred from custom domain", {
															domain,
															medium: `footer item (${item.name})`,
														});
													},
												})}
												className="text-sm text-gray-500 hover:text-gray-900"
											>
												{item.name}
											</Link>
										</li>
									))}
								</ul>
							</div>
						</div>
						<div className="md:grid md:grid-cols-2 md:gap-8">
							<div>
								<h3 className="text-sm font-semibold text-gray-600">Tools</h3>
								<ul role="list" className="mt-4 space-y-4">
									{navigation.tools.map((item) => (
										<li key={item.name}>
											<Link
												href={createHref(item.href)}
												{...(domain !== "rivvi.io" && {
													onClick: () => {
														va.track("Referred from custom domain", {
															domain,
															medium: `footer item (${item.name})`,
														});
													},
												})}
												className="text-sm text-gray-500 hover:text-gray-900"
											>
												{item.name}
											</Link>
										</li>
									))}
								</ul>
							</div>
							<div className="mt-10 md:mt-0">
								<h3 className="text-sm font-semibold text-gray-600">Legal</h3>
								<ul role="list" className="mt-4 space-y-4">
									{navigation.legal.map((item) => (
										<li key={item.name}>
											<Link
												href={createHref(item.href)}
												{...(domain !== "rivvi.io" && {
													onClick: () => {
														va.track("Referred from custom domain", {
															domain,
															medium: `footer item (${item.name})`,
														});
													},
												})}
												className="text-sm text-gray-500 hover:text-gray-900"
											>
												{item.name}
											</Link>
										</li>
									))}
								</ul>
							</div>
						</div>
					</div>
				</div>
				<div className="mt-16 border-t border-gray-900/10 pt-8 sm:mt-20 lg:mt-24">
					<p className="text-sm leading-5 text-gray-500">
						© {new Date().getFullYear()} rivvi.io
					</p>
				</div>
			</MaxWidthWrapper>
		</footer>
	);
}
