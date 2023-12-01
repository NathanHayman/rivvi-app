import {
  FacebookLogo,
  InstagramLogo,
  LinkedinLogo,
  TiktokLogo,
  TwitterLogo,
  YoutubeLogo,
} from "@phosphor-icons/react";
import { CogIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export default defineType({
  name: "settings",
  title: "Settings",
  type: "document",
  icon: CogIcon,
  groups: [
    { name: "appearance", title: "Appearance" },
    { name: "navigation", title: "Navigation" },
    { name: "alerts", title: "Alerts" },
    { name: "seo", title: "SEO" },
  ],
  // Uncomment below to have edits publish automatically as you type
  // liveEdit: true,
  fields: [
    defineField({
      name: "logo",
      title: "Logo",
      description: "Your site logo.",
      type: "image",
      options: {
        hotspot: true,
      },
      group: "appearance",
      validation: (rule) => rule.required(),
    }),
    // create a field for site color scheme where you can select a color scheme
    defineField({
      name: "colorScheme",
      title: "Color Scheme",
      description: "Your site color scheme.",
      type: "object",
      options: {
        modal: {
          type: "dialog",
          width: "auto",
        },
      },
      fields: [
        {
          name: "primary",
          title: "Primary",
          type: "color",
        },
        {
          name: "secondary",
          title: "Secondary",
          type: "color",
        },
        {
          name: "accent",
          title: "Accent",
          type: "color",
        },
      ],
      group: "appearance",
    }),
    defineField({
      name: "socialMedia",
      title: "Social Media",
      description: "Links to your social media profiles.",
      type: "array",
      of: [
        {
          title: "Facebook",
          type: "object",
          name: "facebook",
          icon: FacebookLogo,
          fields: [
            {
              name: "link",
              type: "url",
              title: "Url",
            },
          ],
        },
        {
          title: "Instagram",
          type: "object",
          name: "instagram",
          icon: InstagramLogo,
          fields: [
            {
              name: "link",
              type: "url",
              title: "Url",
            },
          ],
        },
        {
          title: "Linkedin",
          type: "object",
          name: "linkedin",
          icon: LinkedinLogo,
          fields: [
            {
              name: "link",
              type: "url",
              title: "Url",
            },
          ],
        },
        {
          title: "Twitter",
          type: "object",
          name: "twitter",
          icon: TwitterLogo,
          fields: [
            {
              name: "link",
              type: "url",
              title: "Url",
            },
          ],
        },
        {
          title: "Tiktok",
          type: "object",
          name: "tiktok",
          icon: TiktokLogo,
          fields: [
            {
              name: "link",
              type: "url",
              title: "Url",
            },
          ],
        },
        {
          title: "Youtube",
          type: "object",
          name: "youtube",
          icon: YoutubeLogo,
          fields: [
            {
              title: "Url",
              name: "link",
              type: "url",
            },
          ],
        },
      ],
      // group: "misc",
    }),
    defineField({
      name: "topMenuItems",
      title: "Top Menu Item list",
      description: "Links displayed on the header of your site.",
      type: "array",
      group: "navigation",
      of: [{ type: "linkReference" }, { type: "linkExternal" }],
      validation: (Rule) => Rule.max(6),
    }),
    defineField({
      name: "menuItems",
      title: "Menu Item list",
      type: "array",
      group: "navigation",
      of: [{ type: "linkReference" }, { type: "linkExternal" }],
      validation: (Rule) => Rule.max(6),
    }),
    defineField({
      name: "footerMenuItems",
      title: "Footer Items list",
      type: "array",
      group: "navigation",
      of: [
        defineArrayMember({
          name: "column",
          title: "Footer Column",
          type: "footerColumn",
        }),
      ],
    }),
    defineField({
      name: "footerText",
      description:
        "This is a block of text that will be displayed at the bottom of the page.",
      title: "Footer Text",
      type: "array",
      group: "navigation",
      of: [
        defineArrayMember({
          type: "block",
          marks: {
            annotations: [
              {
                name: "link",
                type: "object",
                title: "Link",
                fields: [
                  {
                    name: "href",
                    type: "url",
                    title: "Url",
                  },
                ],
              },
            ],
          },
        }),
      ],
    }),
    defineField({
      name: "ogImage",
      title: "Open Graph Image",
      type: "image",
      description: "Displayed on social cards and search engine results.",
      group: "seo",
      options: {
        hotspot: true,
      },
    }),
    // alert bar toggle, if so allow 'shortBlock' field
    defineField({
      name: "alertBar",
      title: "Alert Bar",
      type: "object",
      group: "alerts",
      fields: [
        {
          name: "active",
          title: "Active",
          type: "boolean",
          // description: 'If active, the alert bar will be displayed on the site.',
        },
        {
          name: "text",
          title: "Text",
          type: "shortBlock",
        },
      ],
    }),
  ],
  preview: {
    select: {
      socialMedia: "socialMedia",
    },
    prepare() {
      return {
        title: "Global",
        subtitle: "Settings",
      };
    },
  },
});
