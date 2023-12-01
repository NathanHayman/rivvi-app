import { BsStack } from "react-icons/bs";
import { ListItemBuilder } from "sanity/desk";

import defineStructure from "@/sanity/utils/defineStructure";

export default defineStructure<ListItemBuilder>((S) =>
  S.listItem()
    .title("Dynamic Content")
    .icon(BsStack)
    // this includes:
    // - post
    // - location
    // - member
    // - service
    // - insurance
    // - tier
    // - serviceType

    // example for cutom pages structure
    //   S.listItem()
    // .title("Pages")
    // .icon(BsStack)
    // .schemaType("page")
    // .child(
    //   S.documentList()
    //     .title("Pages")
    //     .menuItems(S.documentTypeList("page").getMenuItems())
    //     .apiVersion("2021-03-25")
    //     .filter('_type == "page"')
    //     .defaultOrdering([{ field: "title", direction: "asc" }])
    //     .child((documentId) =>
    //       S.document().documentId(documentId).schemaType("page"),
    //     ),
    // ),

    .child(
      S.documentList()
        .title("Dynamic Content")
        .menuItems(S.documentTypeList("post").getMenuItems())
        .apiVersion("2021-03-25")
        .filter(
          '_type == "post" || _type == "location" || _type == "member" || _type == "service" || _type == "insurance" || _type == "tier" || _type == "serviceType"',
        )
        .defaultOrdering([{ field: "title", direction: "asc" }])
        .child((documentId) =>
          S.document().documentId(documentId).schemaType("post"),
        ),
    ),
);
