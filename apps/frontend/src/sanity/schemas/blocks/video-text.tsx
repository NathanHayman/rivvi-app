import { defineField } from "sanity";

export default defineField({
  name: "videoText",
  title: "Video Text",
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
        ],
      },
      // Paragraphs
      type: "block",
    },
  ],
});
