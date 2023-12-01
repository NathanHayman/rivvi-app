import { BsFillPlayBtnFill } from "react-icons/bs";
import { defineField, defineType } from "sanity";

export default defineType({
  name: "module.video",
  title: "Video",
  type: "object",
  icon: BsFillPlayBtnFill,
  fields: [
    defineField({
      title: "Make the video full width of the page?",
      name: "fullscreen",
      type: "boolean",
      description:
        "Turning this on will make the video the entire page width. (Main usage is for a VSL)",
      validation: (rule) => rule.required(),
    }),
    // Auto play
    defineField({
      name: "autoplay",
      title: "Autoplay",
      type: "boolean",
      description:
        "If enabled, the video will automatically start playing when the page loads.",
      validation: (rule) => rule.required(),
    }),
    // Loop
    defineField({
      title: "Video",
      name: "video",
      type: "object",
      options: {
        collapsed: true,
        collapsible: true,
      },
      fields: [
        defineField({
          title: "Desktop",
          name: "desktopVideo",
          type: "mux.video",
          options: {
            collapsed: false,
            collapsible: false,
          },
          validation: (rule) => rule.required(),
        }),
        defineField({
          title: "Mobile",
          name: "mobileVideo",
          type: "mux.video",
          options: {
            collapsed: false,
            collapsible: false,
          },
        }),
      ],
    }),
    // text + link below video (optional)
    defineField({
      name: "textBelowVideo",
      title: "Text below video",
      type: "videoText",
      description: "If you want to add text below the video, enter it here.",
    }),
  ],
  preview: {
    select: {
      title: "title",
    },
    prepare({ title }) {
      return {
        title: "Video",
      };
    },
  },
});
