import { LuBriefcase } from "react-icons/lu";
import { defineField, defineType } from "sanity";

export default defineType({
  type: "document",
  name: "careers",
  title: "Careers",
  icon: LuBriefcase,
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
      initialValue: "Careers",
      validation: (rule) => rule.required(),
    }),
    defineField({
      type: "slug",
      name: "slug",
      title: "Slug",
      readOnly: true,
      initialValue: () => ({
        current: "careers",
      }),
    }),
    defineField({
      type: "string",
      name: "header",
      title: "Header",
      group: "header",
      initialValue: "Join Our Team",
      validation: (rule) => rule.required(),
    }),
    defineField({
      type: "string",
      name: "subheader",
      title: "Subheader",
      group: "header",
      description: "This field is optional",
      initialValue:
        "We are always looking for talented people to join our team.",
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
