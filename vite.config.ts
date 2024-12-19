import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";
import { visualizer } from "rollup-plugin-visualizer";
import { nodePolyfills } from "vite-plugin-node-polyfills";

const MODE = process.env.NODE_ENV;
const development = MODE === "development";

// https://vitejs.dev/config/
export default defineConfig({
  base: "",
  resolve: {
    alias: {
      crypto: "crypto-browserify",
      stream: "stream-browserify",
      assert: "assert",
    },
  },
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
    development &&
      nodePolyfills({
        include: ["http", "crypto"],
      }),
  ],
  build: {
    rollupOptions: {
      plugins: [
        nodePolyfills({
          include: ["http", "crypto"],
        }),
      ],
    },
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
});
