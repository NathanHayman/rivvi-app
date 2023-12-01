import { BlockElementIcon } from "@sanity/icons";
import { defineField } from "sanity";

export default defineField({
  name: "module.content",
  title: "Content",
  type: "object",
  icon: BlockElementIcon,
  fieldsets: [
    {
      name: "copy",
      title: "Copy",
      options: {
        collapsible: true,
        collapsed: false,
      },
    },
  ],
  fields: [
    defineField({
      name: "type",
      title: "Type",
      type: "string",
      initialValue: "module.contentImage",
      options: {
        direction: "horizontal",
        layout: "radio",
        list: [
          {
            title: "Content - Image Layout",
            value: "module.contentImage",
          },
          {
            title: "Content - All",
            value: "module.contentBody",
          },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    {
      name: "contentImage",
      title: "Content - Image Layout",
      type: "module.contentImage",
      hidden: ({ parent }) => parent?.type !== "module.contentImage",
    },
    {
      name: "contentBody",
      title: "Content - All",
      type: "module.contentBody",
      hidden: ({ parent }) => parent?.type !== "module.contentBody",
    },
  ],
  preview: {
    select: {
      title: "header.title",
    },
    prepare(selection) {
      const { title } = selection;
      return {
        subtitle: "Content module",
        title,
        media: BlockElementIcon,
      };
    },
  },
});
