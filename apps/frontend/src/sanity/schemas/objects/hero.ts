import { defineField, defineType } from "sanity";

export default defineType({
  name: "hero",
  title: "Hero",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "buttonText1",
      title: "Button Text 1",
      type: "string",
    }),
    defineField({
      name: "buttonLink1",
      title: "Button Link 1",
      type: "url",
    }),
    defineField({
      name: "buttonText2",
      title: "Button Text 2",
      type: "string",
    }),
    defineField({
      name: "buttonLink2",
      title: "Button Link 2",
      type: "url",
    }),
  ],
  preview: {
    select: {
      title: "title",
    },
    prepare({ title }) {
      return {
        title,
      };
    },
  },
});
