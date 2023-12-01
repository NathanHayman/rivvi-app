/**
 * Annotations are ways of marking up text in the block content editor.
 *
 * Read more: https://www.sanity.io/docs/customization#f924645007e1
 */
import { MousePointerClick } from "lucide-react";
import { defineField } from "sanity";

export default defineField({
  title: "Action",
  name: "linkAction",
  type: "object",
  icon: MousePointerClick,
  components: {
    annotation: (props) => (
      <span>
        <MousePointerClick
          style={{
            marginLeft: "0.05em",
            marginRight: "0.1em",
            width: "0.75em",
          }}
        />
        {props.renderDefault(props)}
      </span>
    ),
  },
  fields: [
    {
      name: "type",
      title: "Action type",
      // radio: true,
      type: "string",
      options: {
        list: [
          {
            title: "Go to next step",
            value: "next-step",
          },
          {
            title: "Accept Offer + Go to next step",
            value: "accept-offer_next-step",
          },
          {
            title: "Accept Offer + Close Modal",
            value: "add-to-cart_close-modal",
          },
          {
            title: "Close Modal",
            value: "close-modal",
          },
          {
            title: "Open Modal",
            value: "open-modal",
          },
          {
            title: "Decline Offer + Go to next step",
            value: "decline-offer_next-step",
          },
        ],
      },
    },
    {
      name: "modal",
      title: "Modal",
      description: "The modal that will be opened",
      type: "reference",
      to: [{ type: "modal" }],
      hidden: ({ parent }) => parent?.type !== "open-modal",
    },
    {
      name: "text",
      title: "Text",
      description:
        "The text that will be displayed. ** the action will be set inside the funnel editor **",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "link",
      title: "Link (optional)",
      description:
        "e.g. You might need a link for a button on top of an action",
      type: "url",
    },
  ],
  preview: {
    select: {
      type: "type",
      text: "text",
      link: "link",
    },
    prepare({ type, text, link }) {
      return {
        // render the title of the type instead of the value
        title: `${text}`,
        // keep the " + " between the type and the title if theres two (the _ would be a +)
        subtitle: `Action: ${type.split("_").join(" + ")}`,
        author: `${link ? "Action with link" : "Action without link"}`,
      };
    },
  },
});
