import { LuFolderHeart } from "react-icons/lu";
import { defineField, defineType } from "sanity";

export default defineType({
  name: "serviceType",
  title: "Service Types",
  type: "document",
  icon: LuFolderHeart,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "subtitle",
      title: "Subtitle",
      type: "string",
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "subtitle",
    },
    prepare({ title, subtitle }) {
      return {
        title,
        subtitle,
      };
    },
  },
});
