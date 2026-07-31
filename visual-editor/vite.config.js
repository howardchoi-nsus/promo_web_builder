import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "node:path";
import { readFileSync } from "node:fs";

function emitStandaloneCssAssets() {
  return {
    name: "emit-standalone-css-assets",
    apply: "build",
    generateBundle() {
      [
        ["promo-renderer.css", "src/promo-renderer.css"],
        ["visual-output.css", "src/visual-output.css"],
      ].forEach(([fileName, sourcePath]) => {
        this.emitFile({
          type: "asset",
          fileName,
          source: readFileSync(resolve(__dirname, sourcePath), "utf8"),
        });
      });
    },
  };
}

function localRouteAliases() {
  return {
    name: "local-route-aliases",
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        const pathname = String(request.url || "").split("?")[0];
        if (pathname === "/") {
          response.setHeader("Content-Type", "text/html; charset=utf-8");
          response.end(readFileSync(resolve(__dirname, "../index.html"), "utf8"));
          return;
        }
        if (pathname.startsWith("/prototype/")) {
          request.url = request.url.replace(/^\/prototype/, "");
        }
        next();
      });
    },
  };
}

export default defineConfig({
  root: resolve(__dirname, "../prototype"),
  base: "/prototype/visual-editor-assets/",
  plugins: [localRouteAliases(), vue(), emitStandaloneCssAssets()],
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
  },
  server: {
    proxy: {
      "/api": {
        target: "https://promo-web-builder.vercel.app",
        changeOrigin: true,
        secure: true,
      },
    },
  },
  build: {
    outDir: resolve(__dirname, "../prototype/visual-editor-assets"),
    emptyOutDir: true,
    cssCodeSplit: true,
    rollupOptions: {
      input: {
        "visual-editor": resolve(__dirname, "src/main.js"),
        "ai-builder": resolve(__dirname, "src/builder/main.js"),
      },
      output: {
        entryFileNames: "[name].js",
        chunkFileNames: "chunks/[name]-[hash].js",
        assetFileNames: "[name][extname]",
      },
    },
  },
});
