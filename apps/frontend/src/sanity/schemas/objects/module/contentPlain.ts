import { BsLayoutTextSidebarReverse } from "react-icons/bs";
import { defineField } from "sanity";

export default defineField({
  name: "module.contentPlain",
  title: "Plain Text",
  description: "Insert long-form sales copy with advanced formatting options.",
  type: "object",
  icon: BsLayoutTextSidebarReverse,
  fields: [
    // Body
    defineField({
      name: "contentPlainBody",
      title: "Body",
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
        title: "Plain Text",
        subtitle: title,
        media: BsLayoutTextSidebarReverse,
      };
    },
  },
});
