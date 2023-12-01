import { LinkIcon } from "@sanity/icons";
import { defineField } from "sanity";

import { PAGE_REFERENCES } from "@/sanity/constants";

export default defineField({
  title: "Reference",
  name: "linkReference",
  type: "object",
  icon: LinkIcon,
  fields: [
    // Reference
    {
      name: "reference",
      type: "reference",
      weak: true,
      validation: (Rule) => Rule.required(),
      to: PAGE_REFERENCES,
    },
  ],
  preview: {
    select: {
      title: "reference.title",
      slug: "reference.slug.current",
    },
    prepare({ title, slug }) {
      return {
        title,
        subtitle: `/${slug === "/" ? "" : slug}` || "Reference",
      };
    },
  },
});
