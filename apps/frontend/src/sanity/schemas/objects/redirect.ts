import { FcAdvance } from "react-icons/fc";
import { defineField, defineType } from "sanity";

export default defineType({
  name: "redirect",
  title: "Redirect",
  type: "object",
  icon: FcAdvance,
  fields: [
    defineField({
      name: "from",
      title: "From",
      type: "string",
    }),
    defineField({
      name: "to",
      title: "To",
      type: "string",
    }),
    defineField({
      name: "permanent",
      title: "Permanent",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      from: "from",
      to: "to",
      permanent: "permanent",
    },
    prepare({ from, to, permanent }) {
      return {
        title: `${from} → ${to}`,
        subtitle: permanent ? "Permanent" : "Temporary",
      };
    },
  },
});
