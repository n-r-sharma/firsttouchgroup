import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://www.firsttouchgroup.co.uk",
  compressHTML: true,
  build: {
    inlineStylesheets: "auto",
  },
});
