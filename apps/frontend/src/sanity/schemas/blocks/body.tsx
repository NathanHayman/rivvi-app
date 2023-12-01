import { defineField } from "sanity";

export default defineField({
  name: "body",
  title: "Body",
  type: "array",
  of: [
    {
      lists: [
        { title: "Bullet", value: "bullet" },
        { title: "Numbered", value: "number" },
      ],
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
          // Email
          {
            name: "annotationLinkEmail",
            type: "annotationLinkEmail",
          },
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
    // Custom blocks
    // {
    //  type: 'module.video'
    // },
    {
      type: "module.accordion",
    },
    {
      type: "module.callout",
    },
    {
      type: "module.grid",
    },
    {
      type: "module.image",
    },
  ],
});
