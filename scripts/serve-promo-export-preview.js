const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const { htmlExport } = require("../api/_promo-builder-export-adapters");

const projectRoot = path.resolve(__dirname, "..");
const prototypeRoot = path.join(projectRoot, "prototype");
const port = Number(process.env.PORT || 4175);
const snapshot = {
  contractVersion: 3,
  layoutIdentity: { rendererKey: "default-promo-renderer", rendererVersion: 1 },
  appearance: { designTokenSetVersionId: "export-preview-tokens" },
  content: {
    contractVersion: 3,
    formTemplate: {
      id: "export-preview",
      templateKey: "shell:export-preview",
      version: 1,
      designTokenSetVersionId: "export-preview-tokens",
      designTokens: { values: { "--promo-accent": "#156b5b" } },
    },
    sectionOrder: ["hero"],
    sectionInputs: { hero: { title: "독립 Export 미리보기", description: "편집기 UI 없이 Renderer만 출력됩니다." } },
    resourceReferences: [],
    sectionSnapshot: [{
      sectionKey: "hero",
      name: "Hero",
      sortOrder: 0,
      items: [
        { itemKey: "title", name: "Title", fieldKind: "text", defaultValue: "독립 Export 미리보기" },
        { itemKey: "description", name: "Description", fieldKind: "text", defaultValue: "편집기 UI 없이 Renderer만 출력됩니다." },
      ],
    }],
  },
  designSpec: {
    theme: { backgroundColor: "#f5f7fb", textColor: "#172033", accentColor: "#156b5b", fontFamily: "Inter, sans-serif" },
    responsive: { contentMaxWidth: 1280, contentMinWidth: 320, mobileBreakpoint: 720 },
    itemStyles: {
      "hero.title": { xPct: 8, yPx: 90, widthPct: 84, heightPx: 64, fontSize: "42px", fontWeight: 800 },
      "hero.description": { xPct: 8, yPx: 180, widthPct: 84, heightPx: 52, fontSize: "20px" },
    },
    sectionStyles: { hero: { heightPx: 360 } },
    visibility: { items: {}, fields: {} },
    responsiveLayouts: { mobile: { itemStyles: {}, visibility: { items: {}, fields: {} } } },
  },
  motionSpec: { sections: {}, items: {} },
  assets: { contractVersion: 1, items: {} },
};

const mime = { ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".woff2": "font/woff2" };
http.createServer((request, response) => {
  const url = new URL(request.url, `http://127.0.0.1:${port}`);
  if (url.pathname === "/" || url.pathname === "/export-preview.html") {
    response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    return response.end(htmlExport(snapshot, { documentId: "preview", revision: 1, title: "Export Preview" }));
  }
  if (url.pathname.startsWith("/prototype/")) {
    const filePath = path.resolve(prototypeRoot, `.${url.pathname.slice("/prototype".length)}`);
    if (filePath.startsWith(prototypeRoot) && fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      response.writeHead(200, { "Content-Type": mime[path.extname(filePath)] || "application/octet-stream" });
      return fs.createReadStream(filePath).pipe(response);
    }
  }
  response.writeHead(404);
  response.end("Not found");
}).listen(port, "127.0.0.1", () => {
  console.log(`Promo export preview: http://127.0.0.1:${port}/export-preview.html`);
});
