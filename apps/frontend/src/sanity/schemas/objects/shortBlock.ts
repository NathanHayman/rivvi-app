import { defineArrayMember, defineField } from "sanity";

export default defineField({
  name: "shortBlock",
  title: "Short Block Content",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      lists: [],
      styles: [{ title: "Normal", value: "normal" }],
      marks: {
        decorators: [
          { title: "Strong", value: "strong" },
          { title: "Emphasis", value: "em" },
          { title: "Underline", value: "underline" },
          { title: "Strike", value: "strike-through" },
        ],
        annotations: [
          {
            name: "link",
            type: "object",
            title: "URL",
            fields: [
              {
                title: "URL",
                name: "href",
                type: "url",
                validation: (rule) =>
                  rule.required().uri({
                    scheme: ["http", "https", "mailto", "tel"],
                  }),
              },
            ],
          },
        ],
      },
    }),
  ],
});
