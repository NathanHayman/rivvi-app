import { BsEyeFill, BsPencilFill, BsStack } from "react-icons/bs";
import { ListItemBuilder } from "sanity/desk";

import defineStructure from "@/sanity/utils/defineStructure";

const dynamicDocuments = [
  "post",
  "location",
  "member",
  "service",
  "insurance",
  "serviceType",
];

export default defineStructure<ListItemBuilder>((S) =>
  S.listItem()
    .title("Manage Content")
    .icon(BsStack)
    .child(
      S.documentList()
        // render the dynamic document types
        .menuItems([
          { title: "View", icon: BsEyeFill },
          { title: "Edit", icon: BsPencilFill },
        ])
        .title("Manage Content")
        .filter("_type == $type")
        .params({ type: dynamicDocuments.join(",") })

        // Use a GROQ filter to get documents.
        .filter(
          '_type == "post" || _type == "location" || _type == "member" || _type == "service" || _type == "insurance" || _type == "tier" || _type == "serviceType"',
        )
        // When a document is created, automatically fill in a set of fields.
        .initialValueTemplates(
          dynamicDocuments.map((doc) => ({
            name: doc,
            title: doc,
            schemaType: doc,
            parameters: { type: doc },
            type: "initialValueTemplateItem", // Add type property
            id: `initialValueTemplateItem-${doc}`, // Add id property
            templateId: `initialValueTemplateItem-${doc}`, // Add templateId property
          })),
        ),
    ),
);
