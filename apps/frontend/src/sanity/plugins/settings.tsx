/**
 * This plugin contains all the logic for setting up the singletons
 */

import {
  LuFolderEdit,
  LuLayers,
  LuLayoutTemplate,
  LuSettings,
} from "react-icons/lu";
import { type DocumentDefinition } from "sanity";
import { ListItemBuilder, type StructureResolver } from "sanity/desk";

export const singletonPlugin = (types: string[]) => {
  return {
    name: "singletonPlugin",
    document: {
      // Hide 'Singletons (such as Home)' from new document options
      // https://user-images.githubusercontent.com/81981/195728798-e0c6cf7e-d442-4e58-af3a-8cd99d7fcc28.png
      newDocumentOptions: (prev, { creationContext }) => {
        if (creationContext.type === "global") {
          return prev.filter(
            (templateItem) => !types.includes(templateItem.templateId),
          );
        }

        return prev;
      },
      // Removes the "duplicate" action on the Singletons (such as Home)
      actions: (prev, { schemaType }) => {
        if (types.includes(schemaType)) {
          return prev.filter(({ action }) => action !== "duplicate");
        }

        return prev;
      },
    },
  };
};

const hiddenDocTypes = (listItem: ListItemBuilder) => {
  const id = listItem.getId();

  if (!id) {
    return false;
  }

  return ![
    "theme",
    "home",
    "media.tag",
    "page",
    "productVariant",
    "collection",
    "settings",
    "footer",
    "header",
    "modal",
    "project",
  ].includes(id);
};

// The StructureResolver is how we're changing the DeskTool structure to linking to document (named Singleton)
// like how "Home" is handled.
export const pageStructure = (
  typeDefArray: DocumentDefinition[],
): StructureResolver => {
  return (S) => {
    // Goes through all of the singletons that were provided and translates them into something the
    // Desktool can understand
    const singletonItems = typeDefArray.map((typeDef) => {
      return S.listItem()
        .title(typeDef.title!)
        .icon(typeDef.icon)
        .child(
          S.editor()
            .id(typeDef.name)
            .schemaType(typeDef.name)
            .documentId(typeDef.name),
        );
    });

    // The default root list items (except custom ones)
    const defaultListItems = S.documentTypeListItems().filter(
      (listItem) =>
        !typeDefArray.find((singleton) => singleton.name === listItem.getId()),
    );

    const dynamicDocuments = [
      "post",
      "location",
      "member",
      "service",
      "insurance",
      "tier",
      "serviceType",
    ];

    const dynamic = S.documentTypeListItems().filter((listItem) =>
      dynamicDocuments.includes(listItem.getId() as string),
    );

    const hiddenListItems = defaultListItems.filter(hiddenDocTypes);

    return S.list()
      .title("Site Content")
      .items([
        S.listItem()
          .title("Dynamic")
          .icon(LuLayers)
          .child(S.list().title("Edit").items(dynamic).showIcons(true)),
        S.divider(),
        S.listItem()
          .title("Static")
          .icon(LuFolderEdit)
          .child(
            S.list()
              .title("Edit")
              .items(
                singletonItems.filter((item) => item.getTitle() !== "Settings"),
              ),
          ),
        S.divider(),
        S.listItem()
        .title("Custom")
        .icon(LuLayoutTemplate)
        .child(S.documentTypeList("page").title("Create A Page")),
        S.divider(),
        S.listItem()
          .title("Settings")
          .icon(LuSettings)
          .child(
            S.editor()
              .id("settings")
              .schemaType("settings")
              .documentId("settings"),
          ),
        S.divider(),
      ]);
  };
};
