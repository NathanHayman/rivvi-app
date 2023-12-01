import { LuInfo } from "react-icons/lu";
import { defineField, defineType } from "sanity";

export default defineType({
  type: "document",
  name: "about",
  title: "About",
  icon: LuInfo,
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
      name: "seo",
      title: "SEO",
    },
  ],
  fields: [
    defineField({
      type: "string",
      name: "title",
      title: "Title",
      initialValue: "About",
      validation: (rule) => rule.required(),
    }),
    defineField({
      type: "slug",
      name: "slug",
      title: "Slug",
      readOnly: true,
      initialValue: () => ({
        current: "about",
      }),
    }),
    defineField({
      type: "string",
      name: "header",
      title: "Header",
      group: "header",
      initialValue: "Our Story",
      validation: (rule) => rule.required(),
    }),
    defineField({
      type: "string",
      name: "subheader",
      title: "Subheader",
      group: "header",
      initialValue:
        "Our journey, mission, and commitment to redefining healthcare.",
      description: "This field is optional",
    }),
    // Sections
    defineField({
      name: "sections",
      title: "Sections",
      type: "array",
      of: [
        {
          type: "section",
        },
      ],
      group: "content",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
      group: "seo",
      options: {
        collapsible: true,
        collapsed: true,
      },
    }),
  ],
  preview: {
    select: {
      title: "title",
    },
    prepare({ title }: { title: string }) {
      return {
        title,
        subtitle: "Page",
      };
    },
  },
});
