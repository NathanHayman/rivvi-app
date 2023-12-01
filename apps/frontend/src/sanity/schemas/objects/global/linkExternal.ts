import { EarthGlobeIcon } from "@sanity/icons";
import { LuMousePointerClick, LuUnlink } from "react-icons/lu";
import { defineField } from "sanity";

export default defineField({
  title: "External Link",
  name: "linkExternal",
  type: "object",
  icon: EarthGlobeIcon,
  fields: [
    {
      name: "type",
      type: "string",
      title: "Type",
      options: {
        list: [
          {
            title: "Button",
            value: "button",
            icon: LuMousePointerClick,
          },
          { title: "Link", value: "link", icon: LuUnlink },
        ],
      },
      preview: {
        select: {
          title: "text",
          subtitle: "href",
          // show the icon of the type
          media: "type",
        },
        prepare({ title, subtitle, media }) {
          return {
            title,
            subtitle,
            media: media?.value === "button" ? LuUnlink : undefined,
          };
        },
      },
    },
    // Title
    {
      title: "Title",
      name: "title",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    // URL
    {
      name: "url",
      title: "URL",
      type: "url",
      validation: (Rule) => Rule.required().uri({ scheme: ["http", "https"] }),
    },
    // Open in a new window
    {
      title: "Open in a new window?",
      name: "newWindow",
      type: "boolean",
      initialValue: true,
    },
  ],
  preview: {
    select: {
      title: "title",
      url: "url",
    },
    prepare(selection) {
      const { title, url } = selection;

      let subtitle = [];
      if (url) {
        // subtitle.push(`→ ${url}`);
      }

      return {
        // media: image,
        subtitle: subtitle.join(" "),
        title,
      };
    },
  },
});
