import { BsDistributeVertical } from "react-icons/bs";
import { defineField } from "sanity";

export default defineField({
  name: "section",
  title: "Section",
  type: "object",
  icon: BsDistributeVertical,
  fields: [
    // Modules
    defineField({
      name: "modules",
      title: "Section Blocks",
      type: "array",
      of: [
        { type: "module.heading" },
        { type: "module.callout" },
        { type: "module.callToAction" },
        { type: "module.contentImage" },
        { type: "module.contentAll" },
        { type: "module.contentPlain" },
        { type: "module.image" },
        { type: "module.accordion" },
        { type: "module.grid" },
      ],
    }),
  ],
  preview: {
    select: {
      title: "header.title",
    },
    prepare(selection) {
      const { title } = selection;
      return {
        title: "Section",
        subtitle: title,
        media: BsDistributeVertical,
      };
    },
  },
});
