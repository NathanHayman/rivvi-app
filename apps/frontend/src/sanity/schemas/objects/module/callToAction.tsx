import { BsFillImageFill, BsFillLightningChargeFill } from "react-icons/bs";
import { defineField } from "sanity";

export default defineField({
  name: "module.callToAction",
  title: "Highlight Box",
  type: "object",
  icon: BsFillLightningChargeFill,
  fieldsets: [
    {
      name: "copy",
      title: "Copy",
    },
  ],
  fields: [
    // Layout
    defineField({
      name: "layout",
      title: "Layout direction",
      type: "string",
      options: {
        layout: "radio",
        direction: "horizontal",
        list: [
          {
            title: "Copy (left) - Content (right)",
            value: "left",
          },
          {
            title: "Copy (right) - Content (left)",
            value: "right",
          },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    // Title
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
      fieldset: "copy",
    }),
    // Body
    defineField({
      name: "body",
      title: "Body",
      type: "text",
      rows: 2,
      fieldset: "copy",
    }),
    // Link
    defineField({
      name: "links",
      title: "Link",
      type: "array",
      of: [{ type: "linkInternal" }, { type: "linkExternal" }],
      validation: (Rule) => Rule.max(1),
      fieldset: "copy",
    }),
    // Content
    defineField({
      name: "content",
      title: "Content",
      type: "array",
      validation: (Rule) => Rule.required().max(1),
      of: [
        {
          icon: BsFillImageFill,
          type: "image",
          title: "Image",
          options: { hotspot: true },
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
    },
    prepare(selection) {
      const { title } = selection;
      return {
        subtitle: "Highlight Box",
        title,
        media: BsFillLightningChargeFill,
      };
    },
  },
});
