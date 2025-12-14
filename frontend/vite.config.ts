import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import * as path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      include: "**/*.tsx",
    }),
  ],
  resolve: {
    alias: [
      { find: "@", replacement: path.resolve(__dirname, "src") },
      {
        find: "@services",
        replacement: path.resolve(__dirname, "src/services"),
      },
      {
        find: "@components",
        replacement: path.resolve(__dirname, "src/components"),
      },
      {
        find: "@interfaces",
        replacement: path.resolve(__dirname, "src/interfaces"),
      },
    ],
  },
});
