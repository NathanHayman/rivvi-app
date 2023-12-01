import { ListItemBuilder } from "sanity/desk";

import defineStructure from "@/sanity/utils/defineStructure";

export default defineStructure<ListItemBuilder>((S) =>
  S.listItem()
    .title("Settings")
    .schemaType("settings")
    .child(
      S.editor()
        .title("Settings")
        .schemaType("settings")
        .documentId("settings"),
    ),
);
