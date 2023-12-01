import { LuStar } from "react-icons/lu";
import { defineField, defineType } from "sanity";

export default defineType({
  name: "review",
  title: "Review",
  type: "object",
  icon: LuStar,
  fields: [
    // month and year date
    defineField({
      type: "date",
      name: "date",
      title: "Date",
      options: {
        dateFormat: "MMMM YYYY",
      },
      validation: (rule) => rule.required(),
    }),
    // 0 - 5 stars rating
    defineField({
      type: "number",
      name: "rating",
      title: "Rating",
      options: {
        list: [
          { title: "0", value: 0 },
          { title: "1", value: 1 },
          { title: "2", value: 2 },
          { title: "3", value: 3 },
          { title: "4", value: 4 },
          { title: "5", value: 5 },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      type: "text",
      name: "content",
      title: "Content",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    // return date as MONTH YEAR, e.g. January 2021
    // include rating
    select: {
      date: "date",
      rating: "rating",
    },
    prepare({ date, rating }) {
      const dateObj = new Date(date);
      const month = dateObj.toLocaleString("default", { month: "short" });
      const year = dateObj.getFullYear();
      return {
        title: `${month} ${year}`,
        subtitle: `${rating} stars`,
      };
    },
  },
});
