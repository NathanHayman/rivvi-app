import { BsBack, BsFileEarmarkFill } from "react-icons/bs";
import { defineField } from "sanity";

export default defineField({
  name: "modal",
  title: "Modal",
  type: "document",
  icon: BsBack,
  groups: [
    { title: "Header", name: "header" },
    { title: "Content", name: "content", default: true },
    { title: "Layout", name: "layout" },
  ],
  fields: [
    defineField({
      name: "slug",
      title: "Slug",
      description: "This is the slug that will be used to access this page.",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "showTitle",
      title: "Show Title",
      type: "boolean",
      initialValue: false,
      group: "header",
    }),
    defineField({
      name: "showSubtitle",
      title: "Show Subtitle",
      type: "boolean",
      initialValue: false,
      group: "header",
    }),
    // Title
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "header",
      hidden: ({ document }) => !document?.showTitle,
    }),
    // Title
    defineField({
      name: "subtitle",
      title: "Subtitle",
      type: "string",
      group: "header",
      hidden: ({ document }) => !document?.showSubtitle,
    }),
    // Image
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      group: "content",
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    // Full Width ?
    defineField({
      name: "fullWidth",
      title: "Full Width",
      description:
        "This will quite literally make the entire modal full width.",
      type: "boolean",
      initialValue: false,
      group: "layout",
      validation: (Rule) => Rule.required(),
    }),
    // Link
    defineField({
      name: "links",
      title: "Buttons",
      description:
        "You can add up to 2 links. ** This will most likely be a Yes/No button **",
      type: "array",
      // @ts-ignore
      of: [
        { type: "linkInternal" },
        { type: "linkExternal" },
        { type: "linkAction" },
      ],
      group: "content",
      validation: (Rule) => Rule.max(2),
    }),
  ],
  preview: {
    select: {
      active: "active",
      title: "title",
      pageType: "pageType",
    },
    prepare(selection) {
      const { title, pageType } = selection;

      return {
        // render a different icon based on the page type, all types
        // except custom will have a default icon
        media: pageType === "custom" ? BsFileEarmarkFill : pageType,
        title,
        // subtitle: `Page Type: ${pageType}`
      };
    },
  },
});
