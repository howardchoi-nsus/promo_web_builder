import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "node:path";

export default defineConfig({
  root: resolve(__dirname, "../prototype"),
  plugins: [vue()],
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
  },
  build: {
    target: "es2022",
    outDir: resolve(__dirname, "../prototype/admin-assets"),
    emptyOutDir: true,
    lib: {
      entry: resolve(__dirname, "src/main.js"),
      formats: ["es"],
      fileName: () => "admin-app.js",
    },
    rollupOptions: {
      output: {
        codeSplitting: false,
      },
    },
  },
});
