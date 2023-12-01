import { defineField } from "sanity";

export default defineField({
  name: "notFoundPage",
  title: "404 page",
  type: "object",
  group: "notFoundPage",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "text",
    }),
  ],
});
