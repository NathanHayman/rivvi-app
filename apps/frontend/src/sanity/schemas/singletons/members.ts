import { LuUsers } from "react-icons/lu";
import { defineField, defineType } from "sanity";

export default defineType({
  type: "document",
  name: "members",
  title: "Members",
  icon: LuUsers,
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
      initialValue: "Members",
      validation: (rule) => rule.required(),
    }),
    defineField({
      type: "slug",
      name: "slug",
      title: "Slug",
      readOnly: true,
      initialValue: () => ({
        current: "members",
      }),
    }),
    defineField({
      type: "string",
      name: "header",
      title: "Header",
      group: "header",
      initialValue: "Our Providers",
      validation: (rule) => rule.required(),
    }),
    defineField({
      type: "string",
      name: "subheader",
      title: "Subheader",
      group: "header",
      description: "This field is optional",
      initialValue: "Meet our team of providers.",
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
