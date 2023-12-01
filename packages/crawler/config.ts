import { Config } from "./src/config";

export const defaultConfig: Config = {
  url: "https://platform.openai.com/docs/guides",
  match: "https://platform.openai.com/docs/**",
  maxPagesToCrawl: 50,
  outputFileName: "output9.json",
};
