import { defineField } from "sanity";

export default defineField({
  name: "bodyNoModules",
  title: "Body",
  type: "array",
  of: [
    {
      marks: {
        decorators: [
          {
            title: "Italic",
            value: "em",
          },
          {
            title: "Strong",
            value: "strong",
          },
          {
            title: "Underline",
            value: "underline",
          },
          {
            title: "Strike",
            value: "strike-through",
          },
        ],
        annotations: [
          // Internal link
          {
            name: "annotationLinkInternal",
            type: "annotationLinkInternal",
          },
          // URL
          {
            name: "annotationLinkExternal",
            type: "annotationLinkExternal",
          },
          {
            name: "annotationLinkEmail",
            type: "annotationLinkEmail",
          },
        ],
      },
      // Paragraphs
      type: "block",
    },
  ],
});
