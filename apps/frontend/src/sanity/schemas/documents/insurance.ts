import { LuShieldCheck } from "react-icons/lu";
import { defineField, defineType } from "sanity";

export default defineType({
  name: "insurance",
  title: "Insurances",
  type: "document",
  icon: LuShieldCheck,
  fields: [
    // Name of insurance
    defineField({
      type: "string",
      name: "name",
      title: "Name",
      validation: (rule) => rule.required(),
    }),
    defineField({
      type: "string",
      name: "plan",
      title: "Plan",
      validation: (rule) => rule.required(),
    }),
    // Logo of insurance
    defineField({
      type: "image",
      name: "logo",
      title: "Logo",
      options: {
        hotspot: true,
      },
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      name: "name",
      logo: "logo",
    },
    prepare({ name, logo }) {
      return {
        title: name,
        media: logo,
      };
    },
  },
});
