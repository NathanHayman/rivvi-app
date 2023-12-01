import { LuNewspaper } from "react-icons/lu";
import { defineField, defineType } from "sanity";

export default defineType({
  type: "document",
  name: "news",
  title: "News",
  icon: LuNewspaper,
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
      initialValue: "News",
      validation: (rule) => rule.required(),
    }),
    defineField({
      type: "slug",
      name: "slug",
      title: "Slug",
      readOnly: true,
      initialValue: () => ({
        current: "news",
      }),
    }),
    defineField({
      type: "string",
      name: "header",
      title: "Header",
      group: "header",
      description: "This field is optional",
      initialValue: "News & Updates",
    }),
    defineField({
      type: "string",
      name: "subheader",
      title: "Subheader",
      group: "header",
      initialValue:
        "Stay up to date with the latest news and updates from our team.",
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
    prepare({ title }) {
      return {
        title,
        subtitle: "Page",
      };
    },
  },
});
