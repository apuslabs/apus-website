import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";
import { visualizer } from "rollup-plugin-visualizer";

// https://vitejs.dev/config/
export default defineConfig({
  base: "",
  plugins: [
    react(),
    ViteImageOptimizer({
      png: {
        compressionLevel: 9,
        palette: true,
        effort: 10,
      },
    }),
    visualizer({
      filename: "dist/bundle-analysis.html",
      open: false,
    }),
  ],
});
