import { LuMessagesSquare } from "react-icons/lu";
import { defineField, defineType } from "sanity";

export default defineType({
  name: "faq",
  title: "FAQ",
  type: "object",
  icon: LuMessagesSquare,
  fields: [
    defineField({
      name: "question",
      title: "Question",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "answer",
      title: "Answer",
      type: "blockContent",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      question: "question",
    },
    prepare({ question }) {
      return {
        title: question,
      };
    },
  },
});
