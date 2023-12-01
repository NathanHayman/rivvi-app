import { PortableText, PortableTextComponents } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";

import Accordion from "../modules/accordion";
import Callout from "../modules/callout";
import Grid from "../modules/grid";
import ImageModule from "../modules/image/module";
import LinkSwitcher from "./links";

export function CustomPortableText({
	paragraphClasses,
	value,
}: {
	paragraphClasses?: string;
	value: PortableTextBlock[];
}) {
	const components: PortableTextComponents = {
		block: {
			normal: ({ children }) => {
				return <p className={`${paragraphClasses} leading-7`}>{children}</p>;
			},
		},
		marks: {
			link: ({ children, value }) => {
				return (
					<a
						className="underline transition hover:opacity-50"
						href={value?.href ?? value?.url ?? "#"}
						rel="noreferrer noopener"
					>
						{children}
					</a>
				);
			},
			annotationLinkInternal: ({ children, value }) => {
				return (
					<LinkSwitcher data={value} type="body">
						{children}
					</LinkSwitcher>
				);
			},
			annotationLinkReference: ({ children, value }) => {
				return (
					<LinkSwitcher data={value} type="body">
						{children}
					</LinkSwitcher>
				);
			},
			annotationLinkEmail: ({ children, value }) => {
				return (
					<LinkSwitcher data={value} type="email">
						{children}
					</LinkSwitcher>
				);
			},
		},
		types: {
			"module.image": ({ value }) => {
				return <ImageModule data={value} />;
			},
			"module.callout": ({ value }) => {
				return (
					<div className="w-full">
						<Callout callout={value} />
					</div>
				);
			},
			"module.accordion": ({ value }) => {
				return (
					<div className="w-full">
						<Accordion data={value} />
					</div>
				);
			},
			"module.grid": ({ value }) => {
				return <Grid data={value} />;
			},
		},
	};

	return <PortableText components={components} value={value} />;
}
