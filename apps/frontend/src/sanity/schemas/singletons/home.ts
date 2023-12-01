import { HomeIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export default defineType({
  type: "document",
  name: "home",
  title: "Home",
  icon: HomeIcon,
  groups: [
    {
      default: true,
      name: "heroGroup",
      title: "Hero",
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
      initialValue: "Enter a title",
      validation: (rule) => rule.required(),
    }),
    defineField({
      type: "hero",
      name: "hero",
      title: "Hero",
      group: "heroGroup",
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
    prepare({ title }) {
      return {
        title,
        subtitle: "Page",
      };
    },
  },
});
