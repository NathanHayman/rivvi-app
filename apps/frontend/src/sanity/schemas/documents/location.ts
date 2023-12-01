import {
  LuCalendarClock,
  LuCross,
  LuMapPin,
  LuPhoneCall,
} from "react-icons/lu";
import { defineField, defineType } from "sanity";

export default defineType({
  type: "document",
  name: "location",
  title: "Locations",
  icon: LuMapPin,
  groups: [
    {
      title: "Content",
      name: "content",
    },
    {
      title: "Team",
      name: "team",
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
      validation: (rule) => rule.required(),
    }),
    defineField({
      type: "slug",
      name: "slug",
      title: "Slug",
      options: {
        source: "name",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "overview",
      description: "Brief description of the location.",
      title: "Description",
      type: "blockContent",
      group: "content",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      group: "media",
      options: {
        hotspot: true,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "imageGallery",
      type: "array",
      title: "Image Gallery",
      group: "media",
      // @ts-ignore
      of: [
        {
          type: "image",
          options: {
            hotspot: true,
          },
        },
      ],
      options: {
        layout: "grid",
      },
    }),
    defineField({
      name: "awards",
      type: "array",
      title: "Awards",
      group: "media",
      // @ts-ignore
      of: [
        {
          type: "object",
          fields: [
            {
              name: "awardTitle",
              type: "string",
              title: "Award Title",
            },
            {
              name: "awardImage",
              type: "image",
              title: "Award Image",
              options: {
                hotspot: true,
              },
            },
          ],
        },
      ],
      options: {
        layout: "grid",
      },
    }),
    defineField({
      name: "address",
      type: "object",
      title: "Address",
      group: "info",
      options: {
        collapsible: true,
        collapsed: false,
        columns: 1,
      },
      // @ts-ignore
      fields: [
        defineField({
          name: "geoLocation",
          title: "Geo Location",
          type: "geopoint",
          description: "Input the latitude and longitude",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "fullAddress",
          title: "Full Address",
          type: "object",
          description: "Input the street address, city, state, and zip code",
          options: {
            columns: 1,
          },
          fields: [
            {
              name: "street",
              title: "Street",
              type: "string",
            },
            {
              name: "suite",
              title: "Suite",
              type: "string",
              description: 'Do not include "Suite"',
            },
            {
              name: "city",
              title: "City",
              type: "string",
            },
            {
              name: "state",
              title: "State",
              type: "string",
            },
            {
              name: "zip",
              title: "Zip",
              type: "string",
            },
          ],
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
    defineField({
      name: "contactInfo",
      title: "Contact Info",
      type: "array",
      group: "info",
      // @ts-ignore
      of: [
        {
          type: "object",
          icon: LuPhoneCall,
          fields: [
            {
              name: "contactType",
              title: "Type of Contact",
              type: "string",
              description:
                'E.g., "Main Number", "Fax", "Appointment Scheduling"',
            },
            {
              name: "contactDetail",
              title: "Contact Detail",
              type: "string",
              description: 'E.g., "(123) 456-7890"',
            },
          ],
        },
      ],
    }),
    defineField({
      name: "hours",
      title: "Hours",
      type: "object",
      icon: LuCalendarClock,
      group: "info",
      description:
        'Specify the operating hours. E.g., "Monday - Friday: 8:00 AM - 5:00 PM"',
      // @ts-ignore
      fields: [
        {
          name: "regularHours",
          title: "Regular Hours",
          type: "array",
          // @ts-ignore
          of: [
            {
              type: "object",
              icon: LuCalendarClock,
              fields: [
                {
                  name: "days",
                  title: "Days",
                  type: "string",
                  description: 'E.g., "Monday - Friday" or "Saturday"',
                },
                {
                  name: "hours",
                  title: "Operating Hours",
                  type: "string",
                  description: 'E.g., "8:00 AM - 5:00 PM"',
                },
              ],
            },
          ],
        },
        {
          name: "holidayHours",
          title: "Holiday Hours",
          type: "text",
          description:
            'Specify any special hours for holidays. E.g., "Closed on Christmas and New Year\'s Day"',
        },
      ],
    }),
    defineField({
      name: "members",
      title: "Members",
      type: "array",
      // @ts-ignore
      of: [{ type: "reference", to: [{ type: "member" }] }],
      group: "team",
      options: {
        layout: "grid",
      },
    }),
    defineField({
      name: "services",
      title: "Services",
      type: "array",
      // @ts-ignore
      of: [{ type: "reference", to: [{ type: "service" }], icon: LuCross }],
      options: {
        layout: "grid",
      },
      group: "info",
      description: "Make sure to type the service name exact",
    }),
    defineField({
      name: "reviews",
      title: "Reviews",
      type: "array",
      group: "content",
      // @ts-ignore
      of: [
        {
          type: "review",
        },
      ],
    }),
    defineField({
      name: "faqs",
      title: "FAQs",
      type: "array",
      group: "content",
      // @ts-ignore
      of: [{ type: "faq" }],
    }),
    defineField({
      name: "socialMedia",
      title: "Social Media",
      type: "object",
      group: "content",
      options: {
        collapsible: true,
        collapsed: true,
        columns: 2,
      },
      description: "Input the social media links, if applicable",
      // @ts-ignore
      fields: [
        {
          name: "facebook",
          title: "Facebook",
          type: "url",
        },
        {
          name: "instagram",
          title: "Instagram",
          type: "url",
        },
        {
          name: "twitter",
          title: "Twitter",
          type: "url",
        },
        {
          name: "youtube",
          title: "Youtube",
          type: "url",
        },
      ],
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
      group: "seo",
    }),
  ],
  initialValue: {
    // _type: 'page',
    // _template: 'page',
    // _hideChildren: false,
    // _meta: {
    //     title: 'New Page',
    //     description: '',
    //     keywords: [],
    //     noindex: false,
    //     nofollow: false,
    //     canonical: null,
    //     shareImage: null,
    // },
  },
  preview: {
    select: {
      title: "name",
      subtitle: "slug.current",
      media: "image",
    },
    prepare({ title, subtitle, media }) {
      return {
        title: title,
        subtitle: subtitle ? `/${subtitle}` : "(slug not set)",
        media: media,
      };
    },
  },
});
