import { defineField } from "sanity";

export default defineField({
  name: "seo",
  title: "SEO",
  type: "object",
  group: "seo",
  options: {
    collapsed: false,
    collapsible: true,
  },
  fields: [
    defineField({
      name: "title",
      title: "Site title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 2,
      validation: (Rule) =>
        Rule.max(150).warning(
          "Longer descriptions may be truncated by search engines",
        ),
    }),
  ],
  validation: (Rule) => Rule.required(),
});
