import { defineField } from "sanity";

export default defineField({
  name: "menuLinks",
  title: "menuLinks",
  type: "array",
  of: [{ type: "linkInternal" }, { type: "linkExternal" }],
});
