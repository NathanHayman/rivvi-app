import { defineArrayMember, defineField, defineType } from "sanity";

export default defineType({
  name: "homeMembers",
  title: "Highlighted Members",
  type: "object",
  fields: [
    defineField({
      name: "active",
      title: "Active",
      type: "boolean",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "header",
      title: "Header",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "subheader",
      title: "Subheader",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "highlightedMembers",
      title: "Highlighted Members",
      type: "array",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "member" }],
        }),
      ],
      validation: (rule) => rule.max(6).required(),
    }),
    defineField({
      name: "cta",
      title: "Call to Action",
      type: "cta",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "title",
    },
    prepare({ title }) {
      return {
        title: "Highlighted Members",
      };
    },
  },
});
