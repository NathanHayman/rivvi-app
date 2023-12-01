import { BsBack, BsFileEarmarkFill } from "react-icons/bs";
import { defineField } from "sanity";

export default defineField({
  name: "page",
  title: "Page",
  type: "document",
  icon: BsBack,
  groups: [
    {
      default: true,
      name: "header",
      title: "Header",
    },
    {
      name: "content",
      title: "Content",
    },
    {
      name: "navigation",
      title: "Navigation",
    },
    {
      name: "seo",
      title: "SEO",
    },
  ],
  fields: [
    // Title
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    // Slug
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title" },
    }),
    // Header
    defineField({
      type: "string",
      name: "header",
      title: "Header",
      group: "header",
      initialValue: "Sample Header",
      validation: (rule) => rule.required(),
    }),
    defineField({
      type: "string",
      name: "subheader",
      title: "Subheader",
      description: "This field is optional",
      group: "header",
      initialValue: "Sample subheader",
    }),
    // Sections
    defineField({
      name: "sections",
      title: "Content Sections",
      type: "array",
      // @ts-ignore
      of: [
        {
          type: "section",
        },
      ],
      group: "content",
    }),
    // SEO
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo.page",
      group: "seo",
    }),
  ],
  preview: {
    select: {
      active: "active",
      title: "title",
      // pageType: 'pageType'
    },
    prepare(selection) {
      // const { title, pageType } = selection;
      const { title } = selection;

      return {
        // render a different icon based on the page type, all types
        // except custom will have a default icon
        media: BsFileEarmarkFill,
        title,
        // subtitle: `Page Type: ${pageType}`
      };
    },
  },
});
