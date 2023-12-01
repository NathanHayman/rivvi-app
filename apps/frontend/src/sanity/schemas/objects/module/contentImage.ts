import { BsFillImageFill, BsSquareHalf } from "react-icons/bs";
import { defineField } from "sanity";

export default defineField({
  name: "module.contentImage",
  title: "Text & Image",
  description:
    "Display an image and text side-by-side for a balanced presentation.",
  type: "object",
  icon: BsSquareHalf,
  fields: [
    // Layout
    defineField({
      name: "contentLayout",
      title: "Layout direction",
      type: "string",
      initialValue: "leftImage",
      options: {
        direction: "horizontal",
        layout: "radio",
        list: [
          {
            title: "Image <--> Content",
            value: "leftImage",
          },
          {
            title: "Content <--> Image",
            value: "rightImage",
          },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    // Image
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      icon: BsFillImageFill,
    }),
    // Body
    defineField({
      name: "contentImageBody",
      title: "Content",
      type: "bodyNoModules",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "header.title",
    },
    prepare(selection) {
      const { title } = selection;
      return {
        title: "Text & Image",
        subtitle: title,
        media: BsSquareHalf,
      };
    },
  },
});
