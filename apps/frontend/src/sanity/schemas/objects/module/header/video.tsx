import { defineField } from "sanity";

export default defineField({
  name: "header.video",
  title: "Video Header",
  type: "object",
  fields: [
    // Title
    defineField({
      name: "title",
      title: "Title",
      type: "text",
      rows: 3,
    }),
    // Link
    defineField({
      name: "links",
      title: "Link",
      type: "array",
      of: [{ type: "linkInternal" }, { type: "linkExternal" }],
      validation: (Rule) => Rule.max(1),
    }),
    // Image (logo)
    defineField({
      name: "image",
      title: "Image (logo)",
      description: "Logo image for the header (max 100px height)",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
  ],
});
