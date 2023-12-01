import { BsXDiamondFill } from "react-icons/bs";
import { defineField } from "sanity";

export default defineField({
  name: "header",
  title: "Header",
  type: "document",
  icon: BsXDiamondFill,
  fields: [
    // Title
    defineField({
      name: "title",
      title: "Title",
      type: "text",
    }),
    // Link
    defineField({
      name: "links",
      title: "CTA (button)",
      type: "array",
      // @ts-ignore
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
  preview: {
    select: {
      title: "title",
      media: "image",
    },
    prepare({ title, media }) {
      return {
        title: title,
        media: media,
      };
    },
  },
});
