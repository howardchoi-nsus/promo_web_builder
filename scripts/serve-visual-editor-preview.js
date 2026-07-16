const fs = require("fs");
const http = require("http");
const path = require("path");

const root = path.resolve(__dirname, "..", "prototype");
const port = Number(process.env.PORT || 4174);
const apiOrigin = process.env.API_ORIGIN || "https://promo-web-builder.vercel.app";
const useFixture = process.env.USE_FIXTURE === "1";

const template = {
  id: "visual-editor-preview-template",
  templateKey: "default-preview",
  name: "Default Promotion Page",
  description: "Visual Editor preview fixture",
  version: 1,
  isDefault: true,
};

const sections = [
  {
    sectionId: "hero",
    sectionKey: "heroBanner",
    name: "Hero Banner",
    description: "Primary promotion message",
    sortOrder: 0,
    isRequired: true,
    userReorderAllowed: false,
    fixedPosition: "top",
    items: [
      { id: "hero-title", itemKey: "title", name: "프로모션 타이틀", fieldKind: "text", textType: "title", isRequired: true, isLocked: false, defaultValue: "Limited-time welcome bonus" },
      { id: "hero-copy", itemKey: "description", name: "프로모션 설명", fieldKind: "text", textType: "multi", isRequired: true, isLocked: false, defaultValue: "Join today and discover a clear, responsive promotion experience." },
      { id: "hero-cta", itemKey: "button", name: "참여 버튼", fieldKind: "cta", isRequired: true, isLocked: false, defaultValue: "Join Now" },
    ],
  },
  {
    sectionId: "content",
    sectionKey: "contentFeature",
    name: "Feature Content",
    description: "Supporting promotion content",
    sortOrder: 1,
    isRequired: false,
    userReorderAllowed: true,
    fixedPosition: null,
    items: [
      { id: "content-image", itemKey: "image", name: "프로모션 이미지", fieldKind: "image", isRequired: false, isLocked: false, image: { allowedSources: ["url", "file", "ai"], descriptionEnabled: true, altTextRequired: false } },
      { id: "content-copy", itemKey: "copy", name: "상세 설명", fieldKind: "text", textType: "multi", isRequired: false, isLocked: false, defaultValue: "Every content field remains editable and is rendered as real DOM." },
    ],
  },
];

const mime = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".jpg": "image/jpeg",
  ".png": "image/png",
};

function json(res, body) {
  res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(body));
}

http.createServer(async (req, res) => {
  const requestUrl = new URL(req.url, `http://127.0.0.1:${port}`);
  if (useFixture && requestUrl.pathname === "/api/wizard-form-templates-public") {
    return json(res, { ok: true, templates: [template] });
  }
  if (useFixture && requestUrl.pathname === "/api/wizard-form-template-public") {
    return json(res, { ok: true, template, configRevision: "preview-v1", sections, configurationWarnings: [] });
  }
  if (requestUrl.pathname.startsWith("/api/")) {
    try {
      const upstream = await fetch(`${apiOrigin}${requestUrl.pathname}${requestUrl.search}`);
      const body = Buffer.from(await upstream.arrayBuffer());
      res.writeHead(upstream.status, {
        "Content-Type": upstream.headers.get("content-type") || "application/json; charset=utf-8",
      });
      return res.end(body);
    } catch (error) {
      res.writeHead(502, { "Content-Type": "application/json; charset=utf-8" });
      return res.end(JSON.stringify({ error: "Preview API proxy failed", message: error.message }));
    }
  }

  const pathname = requestUrl.pathname === "/" ? "/visual-editor.html" : requestUrl.pathname;
  const filePath = path.resolve(root, `.${pathname}`);
  if (!filePath.startsWith(root) || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    res.writeHead(404);
    return res.end("Not found");
  }
  res.writeHead(200, { "Content-Type": mime[path.extname(filePath)] || "application/octet-stream" });
  fs.createReadStream(filePath).pipe(res);
}).listen(port, "127.0.0.1", () => {
  console.log(`Visual Editor preview: http://127.0.0.1:${port}/visual-editor.html`);
  console.log(useFixture ? "API mode: fixture" : `API proxy: ${apiOrigin}`);
});
