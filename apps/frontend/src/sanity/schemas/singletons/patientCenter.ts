import { LuCross } from "react-icons/lu";
import { defineArrayMember, defineField, defineType } from "sanity";

export default defineType({
  type: "document",
  name: "patientCenter",
  title: "Patient Center",
  icon: LuCross,
  groups: [
    {
      default: true,
      name: "header",
      title: "Header",
    },
    {
      name: "content",
      title: "Content",
    },
    {
      name: "seo",
      title: "SEO",
    },
  ],
  fields: [
    defineField({
      type: "string",
      name: "title",
      title: "Title",
      initialValue: "Patient Center",
      validation: (rule) => rule.required(),
    }),
    defineField({
      type: "slug",
      name: "slug",
      title: "Slug",
      readOnly: true,
      initialValue: () => ({
        current: "patient-center",
      }),
    }),
    defineField({
      type: "string",
      name: "header",
      title: "Header",
      group: "header",
      initialValue: "About Your Appointment",
      validation: (rule) => rule.required(),
    }),
    defineField({
      type: "string",
      name: "subheader",
      title: "Subheader",
      group: "header",
      description: "This field is optional",
      initialValue:
        "Access Resources, Book Appointments, and Manage Your Health Records.",
    }),
    // Forms
    defineField({
      name: "forms",
      title: "Forms",
      type: "array",
      of: [defineArrayMember({ type: "patientForm" })],
    }),
    // Sections
    defineField({
      name: "sections",
      title: "Content Sections",
      type: "array",
      of: [
        {
          type: "section",
        },
      ],
      group: "content",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
      group: "seo",
      options: {
        collapsible: true,
        collapsed: true,
      },
    }),
  ],
  preview: {
    select: {
      title: "title",
    },
    prepare({ title }: { title: string }) {
      return {
        title,
        subtitle: "Page",
      };
    },
  },
});
