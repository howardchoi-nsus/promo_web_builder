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
      { id: "hero-title", itemKey: "title", name: "프로모션 타이틀", fieldKind: "text", textType: "title", isRequired: true, isLocked: false, isVisibleInWizard: true, defaultValue: "Limited-time welcome bonus" },
      { id: "hero-copy", itemKey: "description", name: "프로모션 설명", fieldKind: "text", textType: "multi", isRequired: true, isLocked: false, isVisibleInWizard: true, defaultValue: "Join today and discover a clear, responsive promotion experience." },
      { id: "hero-cta", itemKey: "button", name: "참여 버튼", fieldKind: "cta", isRequired: true, isLocked: false, isVisibleInWizard: true, defaultValue: "Join Now" },
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
      { id: "content-image", itemKey: "image", name: "프로모션 이미지", fieldKind: "image", isRequired: false, isLocked: false, isVisibleInWizard: true, image: { allowedSources: ["url", "file", "ai"], descriptionEnabled: true, altTextRequired: false } },
      { id: "content-copy", itemKey: "copy", name: "상세 설명", fieldKind: "text", textType: "multi", isRequired: false, isLocked: false, isVisibleInWizard: true, defaultValue: "Every content field remains editable and is rendered as real DOM." },
    ],
  },
];

let fixtureLayoutRevision = 1;
let fixtureLayout = {
  contractVersion: 1,
  specKey: "admin-default",
  theme: {
    backgroundColor: "#f5f7fb",
    backgroundImage: "",
    backgroundImageName: "",
    textColor: "#172033",
    accentColor: "#156b5b",
    fontFamily: "Inter, Pretendard, sans-serif",
  },
  responsive: { contentMaxWidth: 1440, contentMinWidth: 1140, mobileBreakpoint: 720 },
  itemStyles: {},
  sectionStyles: {},
};

const mime = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".jpg": "image/jpeg",
  ".png": "image/png",
};

function json(res, body, status = 200) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(body));
}

async function readJson(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  try { return JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}"); } catch { return {}; }
}

http.createServer(async (req, res) => {
  const requestUrl = new URL(req.url, `http://127.0.0.1:${port}`);
  if (useFixture && requestUrl.pathname === "/api/wizard-form-templates-public") {
    return json(res, { ok: true, templates: [template] });
  }
  if (useFixture && requestUrl.pathname === "/api/wizard-form-template-public") {
    return json(res, {
      ok: true,
      template,
      configRevision: "preview-v1",
      layoutRevision: fixtureLayoutRevision,
      renderer: { key: "default-promo-renderer", version: 1 },
      layoutIdentity: {
        contractVersion: 2,
        templateId: template.id,
        templateKey: template.templateKey,
        templateVersion: template.version,
        layoutId: "fixture-layout",
        layoutRevision: fixtureLayoutRevision,
        configRevision: "preview-v1",
        rendererKey: "default-promo-renderer",
        rendererVersion: 1,
      },
      defaultLayout: fixtureLayout,
      sections,
      configurationWarnings: [],
    });
  }
  if (useFixture && requestUrl.pathname === "/api/wizard-form-template-layout" && req.method === "GET") {
    return json(res, {
      ok: true,
      template: { ...template, status: "draft" },
      sections,
      layout: {
        id: "fixture-layout",
        layoutRevision: fixtureLayoutRevision,
        rendererKey: "default-promo-renderer",
        rendererVersion: 1,
        layoutSpec: fixtureLayout,
      },
    });
  }
  if (useFixture && requestUrl.pathname === "/api/wizard-form-template-layout" && req.method === "PATCH") {
    const body = await readJson(req);
    if (Number(body.expectedRevision) !== fixtureLayoutRevision) {
      return json(res, { error: "Layout revision conflict", currentRevision: fixtureLayoutRevision }, 409);
    }
    fixtureLayout = body.layoutSpec || fixtureLayout;
    fixtureLayoutRevision += 1;
    return json(res, {
      ok: true,
      layout: {
        id: "fixture-layout",
        layoutRevision: fixtureLayoutRevision,
        rendererKey: "default-promo-renderer",
        rendererVersion: 1,
        layoutSpec: fixtureLayout,
      },
    });
  }
  if (useFixture && requestUrl.pathname === "/api/wizard-layout-usage-events") {
    return json(res, { ok: true, event: { id: "fixture-event", createdAt: new Date().toISOString() } }, 201);
  }
  if (requestUrl.pathname === "/favicon.ico") {
    res.writeHead(204);
    return res.end();
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

  let pathname = requestUrl.pathname === "/" ? "/visual-editor.html" : requestUrl.pathname;
  if (pathname.startsWith("/prototype/")) {
    pathname = pathname.slice("/prototype".length);
  }
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
