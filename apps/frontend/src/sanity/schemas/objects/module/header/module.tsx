import { LuText } from "react-icons/lu";
import { defineField } from "sanity";

export default defineField({
  name: "module.heading",
  title: "Header",
  type: "object",
  icon: LuText,
  fields: [
    // Title
    defineField({
      name: "title",
      type: "string",
      title: "Title",
    }),
    // Subtitle
    defineField({
      type: "string",
      name: "subtitle",
      title: "Subtitle",
    }),
    // Options
    defineField({
      name: "centered",
      title: "Centered",
      type: "boolean",
    }),
  ],
});
