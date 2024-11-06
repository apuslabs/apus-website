import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";

// https://vitejs.dev/config/
export default defineConfig({
  base: "",
  plugins: [
    react(),
    visualizer({
      filename: "dist/bundle-analysis.html",
      open: false,
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("react")) {
            return "react";
          }
          if (id.includes("ant") || id.includes("rc")) {
            return "antd";
          }
          if (id.includes("node_modules")) {
            return "vendor";
          }
        },
      },
    },
  },
});
