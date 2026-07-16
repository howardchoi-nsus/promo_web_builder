import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "node:path";
import { readFileSync } from "node:fs";

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
  plugins: [localRouteAliases(), vue()],
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
    lib: {
      entry: resolve(__dirname, "src/main.js"),
      formats: ["es"],
      fileName: () => "visual-editor.js",
      cssFileName: "visual-editor",
    },
  },
});
