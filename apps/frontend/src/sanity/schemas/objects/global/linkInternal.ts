import { LinkIcon } from "@sanity/icons";
import { defineField } from "sanity";

import { PAGE_REFERENCES } from "@/sanity/constants";

export default defineField({
  title: "Internal Link",
  name: "linkInternal",
  type: "object",
  icon: LinkIcon,
  fields: [
    // Title
    {
      title: "Title",
      name: "title",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    // Reference
    {
      name: "reference",
      type: "reference",
      weak: true,
      validation: (Rule) => Rule.required(),
      to: PAGE_REFERENCES,
      options: {
        filter: ({ document }) => ({
          filter:
            '(_type == "page" || _type == "home" || _type == "about") && _id != $currentId',
          params: { currentId: document._id },
        }),
      },
    },
  ],
  preview: {
    select: {
      title: "title",
      slug: "reference.slug.current",
    },
    prepare({ title, slug }) {
      return {
        title,
        subtitle: `/${slug}` || "Internal link",
      };
    },
  },
});
