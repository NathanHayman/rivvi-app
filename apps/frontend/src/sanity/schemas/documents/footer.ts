import { BsXDiamondFill } from "react-icons/bs";
import { defineArrayMember, defineField } from "sanity";

export default defineField({
  name: "footer",
  title: "Footer",
  type: "document",
  icon: BsXDiamondFill,
  options: {
    aiWritingAssistance: { exclude: true },
  },
  fields: [
    defineField({
      name: "title",
      title: "Title",
      description:
        "For internal use only (This will not be displayed on the website)",
      type: "string",
    }),
    // Columns
    defineField({
      name: "columns",
      title: "Columns",
      type: "array",
      // @ts-ignore
      of: [{ type: "footerColumn" }],
      validation: (Rule) => Rule.max(4),
    }),
    // Text
    defineField({
      name: "text",
      title: "Text",
      type: "array",
      // @ts-ignore
      of: [
        defineArrayMember({
          lists: [],
          marks: {
            annotations: [
              // Email
              {
                title: "Email",
                name: "annotationLinkEmail",
                type: "annotationLinkEmail",
              },
              // Internal link
              {
                title: "Internal page",
                name: "annotationLinkInternal",
                type: "annotationLinkInternal",
              },
              // URL
              {
                title: "URL",
                name: "annotationLinkExternal",
                type: "annotationLinkExternal",
              },
            ],
            decorators: [],
          },
          // Block styles
          styles: [{ title: "Normal", value: "normal" }],
          type: "block",
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
    },
    prepare({ title }) {
      return {
        title: title || "Footer",
      };
    },
  },
});
