/**
 * This config is used to set up Sanity Studio that's mounted on the `app/studio/[[...index]]/Studio.tsx` route
 */

// eslint-disable-next-line simple-import-sort/imports
import { assist } from "@sanity/assist";
import { colorInput } from "@sanity/color-input";
import { googleMapsInput } from "@sanity/google-maps-input";
import { visionTool } from "@sanity/vision";
import { defaultTheme, defineConfig } from "sanity";
import { unsplashImageAsset } from "sanity-plugin-asset-source-unsplash";
import { media } from "sanity-plugin-media";
import { deskTool } from "sanity/desk";
import { presentationTool } from "sanity/presentation";

import { apiVersion, dataset, projectId, studioUrl } from "@/sanity/lib/api";
import { locate } from "@/sanity/plugins/locate";
import { pageStructure, singletonPlugin } from "@/sanity/plugins/settings";
import home from "@/sanity/schemas/singletons/home";
import settings from "@/sanity/schemas/singletons/settings";

import {
  embeddingsIndexDashboard,
  embeddingsIndexReferenceInput,
} from "@sanity/embeddings-index-ui";
import { schemaTypes } from "./src/sanity/schemas";
import about from "./src/sanity/schemas/singletons/about";
import careers from "./src/sanity/schemas/singletons/careers";
import contact from "./src/sanity/schemas/singletons/contact";
import locations from "./src/sanity/schemas/singletons/locations";
import members from "./src/sanity/schemas/singletons/members";
import news from "./src/sanity/schemas/singletons/news";
import patientCenter from "./src/sanity/schemas/singletons/patientCenter";
import services from "./src/sanity/schemas/singletons/services";

const title =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_TITLE || "Ruhe Health Studio";

export default defineConfig({
  basePath: studioUrl,
  projectId: projectId || "",
  dataset: dataset || "",
  title,
  theme: defaultTheme,
  schema: {
    types: schemaTypes,
  },
  document: {
    unstable_comments: true as any,
  },
  plugins: [
    deskTool({
      structure: pageStructure([
        home,
        settings,
        about,
        contact,
        careers,
        patientCenter,
        news,
        locations,
        members,
        services,
      ]),
    }),
    presentationTool({
      locate,
      previewUrl: {
        origin:
          typeof location === "undefined"
            ? "http://localhost:3000"
            : location.origin,
        draftMode: {
          enable: "/api/draft",
        },
      },
    }),
    // Configures the global "new document" button, and document actions, to suit the Settings document singleton
    singletonPlugin([
      home.name,
      settings.name,
      about.name,
      contact.name,
      careers.name,
      patientCenter.name,
      news.name,
      locations.name,
      members.name,
      services.name,
    ]),
    // Sanity AI Assist
    assist(),
    // Embeddings index reference input
    embeddingsIndexReferenceInput(),
    // Embeddings Dashboard
    process.env.NODE_ENV === "development"
      ? embeddingsIndexDashboard()
      : { name: "embeddings-index-dashboard-disabled" },
    // Add an image asset source for Unsplash
    unsplashImageAsset(),
    // Add a media library
    media(),
    // Add a Google Maps input
    googleMapsInput({
      apiKey: "AIzaSyBtX3imXvrbIcrcJmCVvinJ9C6kkg8WyzI",
    }),
    // Color input
    colorInput(),
    // Vision lets you query your content with GROQ in the studio
    // https://www.sanity.io/docs/the-vision-plugin
    visionTool({ defaultApiVersion: apiVersion }),
  ],

  tools: (prev, context) => {
    const enabledForRoles = ["developer"];
    const canManageEmbeddingsIndex = context.currentUser?.roles
      .map((role) => role.name)
      .some((roleName) => enabledForRoles.includes(roleName));
    return canManageEmbeddingsIndex
      ? prev
      : prev.filter((tool) => tool.name !== "embeddings-index");
  },
});
