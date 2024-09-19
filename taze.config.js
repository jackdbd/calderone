import { defineConfig } from "taze";

export default defineConfig({
  exclude: [],
  install: true,
  interactive: true,
  packageMode: {
    // a regex starts and ends with '/'
    "/@types\\//": "latest",
    debug: "minor",
    taze: "latest",
  },
  recursive: true,
  write: true,
});
