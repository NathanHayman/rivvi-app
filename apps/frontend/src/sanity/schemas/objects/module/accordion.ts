import pluralize from "pluralize-esm";
import { BsMenuButtonFill } from "react-icons/bs";
import { defineField } from "sanity";

export default defineField({
  name: "module.accordion",
  title: "Collapsible",
  description:
    "Toggleable sections ideal for FAQs to address customer objections and questions.",
  type: "object",
  icon: BsMenuButtonFill,
  fields: [
    // Groups
    defineField({
      name: "groups",
      title: "Groups",
      type: "array",
      of: [
        {
          type: "accordionGroup",
        },
      ],
    }),
  ],
  preview: {
    select: {
      groups: "groups",
    },
    prepare(selection) {
      const { groups } = selection;
      return {
        subtitle: "Collapsible",
        title:
          groups?.length > 0
            ? pluralize("group", groups.length, true)
            : "No groups",
      };
    },
  },
});
