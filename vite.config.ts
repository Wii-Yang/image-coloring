import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import path from "node:path";

// https://vite.dev/config/
export default defineConfig({
  base: "/image-coloring",
  plugins: [
    vue(),
    AutoImport({
      dts: "types/auto-imports.d.ts",
      resolvers: ElementPlusResolver(),
    }),
    Components({
      dts: "types/components.d.ts",
      resolvers: ElementPlusResolver(),
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@types": path.resolve(__dirname, "types"),
    },
  },
  server: { open: false, host: true, port: 80 },
});
