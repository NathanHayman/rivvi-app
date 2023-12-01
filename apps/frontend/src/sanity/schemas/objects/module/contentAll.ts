import { BsGrid1X2Fill } from "react-icons/bs";
import { defineField } from "sanity";

export default defineField({
  name: "module.contentAll",
  title: "Mix & Match",
  description:
    "A flexible content block that allows you to combine various elements like text, images, buttons, and more. Customize the layout and order to fit your needs.",
  type: "object",
  icon: BsGrid1X2Fill,
  fields: [
    // Body
    defineField({
      name: "contentAllBody",
      title: "Content",
      type: "body",
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
        title: "All content block",
        subtitle: title,
        media: BsGrid1X2Fill,
      };
    },
  },
});
