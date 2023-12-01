import { ListItemBuilder } from "sanity/desk";

import defineStructure from "@/sanity/utils/defineStructure";

export default defineStructure<ListItemBuilder>((S) =>
  S.listItem()
    .title("Home")
    .schemaType("home")
    .child(S.document().title("Home").schemaType("home").documentId("home")),
);
