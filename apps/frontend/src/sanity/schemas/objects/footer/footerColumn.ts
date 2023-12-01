import { BsXDiamondFill } from "react-icons/bs";
import { defineField } from "sanity";

export default defineField({
  name: "footerColumn",
  title: "Footer Column",
  type: "object",
  icon: BsXDiamondFill,
  fields: [
    // Column title
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    // Links
    defineField({
      name: "links",
      title: "Links",
      type: "array",
      of: [{ type: "linkReference" }, { type: "linkExternal" }],
      validation: (Rule) => Rule.max(4),
    }),
  ],
});
