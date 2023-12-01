import { IceCreamIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

import ContentLayoutPreview from "@/sanity/components/layouts/ContentLayout";

export default defineType({
	name: "contentLayout",
	title: "Content layout",
	type: "object",
	icon: IceCreamIcon,
	fields: [
		defineField({
			name: "layout",
			title: "Layout direction",
			type: "string",
			initialValue: "left",
			options: {
				direction: "horizontal",
				layout: "radio",
				list: [
					{
						title: "Image / Copy",
						value: "left",
					},
					{
						title: "Copy / Image",
						value: "right",
					},
				],
			},
		}),
	],
	preview: {
		select: {
			layout: "layout",
		},
		prepare({ layout }) {
			return {
				title: "Content layout",
				subtitle: layout,
				media: <ContentLayoutPreview layout={layout} />,
			};
		},
	},
});
