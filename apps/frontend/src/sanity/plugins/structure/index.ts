/**
 * Desk structure overrides
 */
import { ListItemBuilder, StructureResolver } from "sanity/desk";

import dynamicStructure from "./dynamicStructure";
import pageStructure from "./pageStructure";
import settingStructure from "./settingStructure";

/**
 * Desk structure overrides
 *
 * Sanity Studio automatically lists document types out of the box.
 * With this custom desk structure we achieve things like showing the `home`
 * and `settings` document types as singletons, and grouping product details
 * and variants for easy editorial access.
 *
 * You can customize this even further as your schemas progress.
 * To learn more about structure builder, visit our docs:
 * https://www.sanity.io/docs/overview-structure-builder
 */

// If you add document types to desk structure manually, you can add them to this function to prevent duplicates in the root pane
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
    "project",
    "ai.context",
  ].includes(id);
};

export const structure: StructureResolver = (S, context) =>
  S.list()
    .title(`"Struture Title"` || "Studio")
    .items([
      dynamicStructure(S, context),
      pageStructure(S, context),
      S.divider(),
      settingStructure(S, context),
      S.divider(),
      ...S.documentTypeListItems().filter(hiddenDocTypes),
    ]);
