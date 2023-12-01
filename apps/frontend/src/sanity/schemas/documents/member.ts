import { ImageIcon } from "@sanity/icons";
import { LuGraduationCap, LuUserPlus } from "react-icons/lu";
import { defineArrayMember, defineField, defineType } from "sanity";

export default defineType({
  type: "document",
  name: "member",
  title: "Members",
  icon: LuUserPlus,
  groups: [
    {
      title: "Content",
      name: "content",
    },
    {
      title: "Education",
      name: "education",
    },
    {
      title: "Info",
      name: "info",
    },
    {
      title: "Media",
      name: "media",
    },
    {
      title: "SEO",
      name: "seo",
    },
  ],
  fields: [
    defineField({
      type: "string",
      name: "name",
      title: "Name",
      group: "content",
      validation: (rule) => rule.required(),
    }),
    defineField({
      type: "slug",
      name: "slug",
      title: "Slug",
      group: "content",
      options: {
        source: "name",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      type: "image",
      name: "image",
      title: "Image",
      group: "media",
      options: {
        hotspot: true,
      },
      icon: ImageIcon,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "content",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "specialties",
      title: "Specialties",
      type: "array",
      // @ts-ignore
      of: [
        defineArrayMember({
          type: "string",
        }),
      ],
      options: {
        layout: "tags",
      },
      group: "info",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "accepting",
      title: "Accepting New Patients",
      type: "boolean",
      group: "info",
    }),
    defineField({
      name: "languages",
      title: "Languages",
      type: "array",
      group: "info",
      // @ts-ignore
      of: [
        defineArrayMember({
          type: "string",
        }),
      ],
      options: {
        layout: "tags",
      },
    }),
    defineField({
      name: "bio",
      description: "Short bio for the member.",
      title: "Description",
      type: "blockContent",
      group: "content",
    }),
    defineField({
      name: "insurances",
      title: "Insurances",
      type: "array",
      group: "info",
      // @ts-ignore
      of: [
        defineArrayMember({
          type: "reference",
          to: [
            {
              type: "insurance",
            },
          ],
        }),
      ],
      options: {
        layout: "grid",
      },
    }),
    defineField({
      name: "affiliatedLocations",
      title: "Affiliated Locations",
      type: "array",
      group: "info",
      // @ts-ignore
      of: [
        defineArrayMember({
          type: "reference",
          to: [
            {
              type: "location",
            },
          ],
        }),
      ],
      options: {
        layout: "grid",
      },
    }),
    defineField({
      name: "services",
      title: "Services",
      type: "array",
      // @ts-ignore
      of: [{ type: "reference", to: [{ type: "service" }], icon: () => "🛠️" }],
      options: {
        layout: "grid",
      },
      group: "info",
      description: "Make sure to type the service name exact",
    }),
    defineField({
      name: "education",
      title: "Education",
      type: "array",
      group: "education",
      // @ts-ignore
      of: [
        defineArrayMember({
          type: "object",
          name: "educationItem",
          title: "Education Item",
          icon: LuGraduationCap,
          fields: [
            {
              name: "educationType",
              title: "Education Type",
              type: "string",
              description: "e.g. Clinical Fellowship, Medical School, etc.",
            },
            {
              name: "schools",
              title: "School(s)",
              type: "array",
              // @ts-ignore
              of: [{ type: "string" }],
              options: {
                layout: "tags",
              },
            },
          ],
        }),
      ],
    }),
    defineField({
      name: "boardCertifications",
      title: "Board Certifications",
      type: "array",
      group: "education",
      // @ts-ignore
      of: [
        defineArrayMember({
          type: "string",
        }),
      ],
      options: {
        layout: "tags",
      },
    }),
    defineField({
      name: "proffesionalAffiliations",
      title: "Proffesional Affiliations",
      type: "array",
      group: "education",
      // @ts-ignore
      of: [
        defineArrayMember({
          type: "string",
        }),
      ],
      options: {
        layout: "tags",
      },
    }),
    defineField({
      name: "reviews",
      title: "Reviews",
      type: "array",
      group: "content",
      // @ts-ignore
      of: [
        defineArrayMember({
          type: "review",
        }),
      ],
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
      group: "seo",
      options: {
        collapsible: true,
        collapsed: false,
        columns: 1,
      },
    }),
  ],
  preview: {
    select: {
      title: "name",
      media: "image",
      author: "title",
    },
    prepare({ title, media, author }) {
      return {
        title,
        media,
        subtitle: `${author.charAt(0).toUpperCase() + author.slice(1)}`,
      };
    },
  },
});
