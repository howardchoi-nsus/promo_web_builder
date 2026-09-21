import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import http from "node:http";
import net from "node:net";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const snapshot = {
  contractVersion: 3,
  content: {
    contractVersion: 3,
    formTemplate: { designTokens: { values: { "--promo-background": "#fff" } } },
    sectionSnapshot: [{
      sectionKey: "hero", name: "Hero", sectionRole: "hero",
      items: [{ itemKey: "title", name: "Title", fieldKind: "text", textType: "title", isRequired: true }],
    }],
    sectionInputs: { hero: { title: "Nuxt server rendered promotion" } },
    sectionOrder: ["hero"],
  },
  designSpec: {
    contractVersion: 1,
    theme: { backgroundColor: "#fff", textColor: "#111", fontFamily: "sans-serif" },
    responsive: { contentMaxWidth: 1280, contentMinWidth: 0, mobileBreakpoint: 720 },
    itemStyles: {}, sectionStyles: {}, visibility: { items: {}, fields: {} },
    responsiveLayouts: { mobile: { itemStyles: {}, visibility: { items: {} } } },
  },
  assets: { contractVersion: 1, items: {} },
  motionSpec: { contractVersion: 2, sections: {}, items: {} },
};

function listen(server) {
  return new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => resolve(server.address().port));
  });
}

async function unusedPort() {
  const server = net.createServer();
  const port = await listen(server);
  await new Promise((resolve) => server.close(resolve));
  return port;
}

let sourceRequestCount = 0;
const sourceServer = http.createServer((request, response) => {
  const url = new URL(request.url || "/", "http://localhost");
  if (url.pathname === "/api/promo-publication-preview" && url.searchParams.get("token") === "valid-preview-token") {
    response.writeHead(200, {
      "Content-Type": "application/json",
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex, nofollow",
    });
    response.end(JSON.stringify({
      ok: true,
      publication: {
        contractVersion: 1,
        publication: {
          id: "publication-preview", documentId: "document-verified", slug: "verified-promo",
          locale: "ko-KR", status: "draft", publishedRevision: 7,
          publishedAt: "", updatedAt: "2026-09-21T00:00:00.000Z",
        },
        seo: {},
        renderer: { key: "default-promo-renderer", version: 1 },
        snapshot,
        manifest: {},
        cache: { etag: "preview-etag", revalidateSeconds: 0 },
      },
    }));
    return;
  }
  if (url.pathname !== "/api/promo-publication" || url.searchParams.get("slug") !== "verified-promo") {
    response.writeHead(404, { "Content-Type": "application/json" });
    response.end('{"error":"Published promotion not found"}');
    return;
  }
  sourceRequestCount += 1;
  response.writeHead(200, { "Content-Type": "application/json" });
  response.end(JSON.stringify({
    ok: true,
    publication: {
      contractVersion: 1,
      publication: {
        id: "publication-verified", documentId: "document-verified", slug: "verified-promo",
        locale: "ko-KR", status: "published", publishedRevision: 7,
        publishedAt: "2026-09-20T00:00:00.000Z", updatedAt: "2026-09-20T00:00:00.000Z",
      },
      seo: { title: "Verified Promo", description: "Nuxt SSR verification" },
      renderer: { key: "default-promo-renderer", version: 1 },
      snapshot,
      manifest: {},
      cache: { etag: "verified-etag", revalidateSeconds: 30 },
    },
  }));
});

const sourcePort = await listen(sourceServer);
const runtimePort = await unusedPort();
const runtime = spawn(process.execPath, ["apps/promo-runtime-nuxt/.output/server/index.mjs"], {
  cwd: repositoryRoot,
  env: {
    ...process.env,
    HOST: "127.0.0.1",
    PORT: String(runtimePort),
    NUXT_PROMO_API_BASE_URL: `http://127.0.0.1:${sourcePort}`,
    NUXT_REVALIDATE_SECRET: "e2e-revalidation-secret",
  },
  stdio: ["ignore", "pipe", "pipe"],
});

let logs = "";
runtime.stdout.on("data", (chunk) => { logs += chunk; });
runtime.stderr.on("data", (chunk) => { logs += chunk; });

try {
  let response;
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      response = await fetch(`http://127.0.0.1:${runtimePort}/promotions/verified-promo?locale=ko-KR`);
      if (response.ok) break;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  assert.ok(response?.ok, `Nuxt runtime did not become ready. ${logs}`);
  const html = await response.text();
  assert.match(html, /<title>Verified Promo<\/title>/);
  assert.match(html, /Nuxt server rendered promotion/);
  assert.match(html, /data-publication-slug="verified-promo"/);
  assert.match(html, /data-document-revision="7"/);

  const cached = await fetch(`http://127.0.0.1:${runtimePort}/promotions/verified-promo?locale=ko-KR`);
  assert.equal(cached.status, 200);
  assert.equal(sourceRequestCount, 1, "second page request should use the Nitro SWR cache");

  const unauthorized = await fetch(`http://127.0.0.1:${runtimePort}/api/revalidate-promotion`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ slug: "verified-promo", locale: "ko-KR" }),
  });
  assert.equal(unauthorized.status, 401);

  const revalidated = await fetch(`http://127.0.0.1:${runtimePort}/api/revalidate-promotion`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-promo-revalidate-secret": "e2e-revalidation-secret",
    },
    body: JSON.stringify({ slug: "verified-promo", locale: "ko-KR" }),
  });
  assert.equal(revalidated.status, 200);
  assert.equal((await revalidated.json()).scope, "promotion-routes");

  const afterRevalidation = await fetch(`http://127.0.0.1:${runtimePort}/promotions/verified-promo?locale=ko-KR`);
  assert.equal(afterRevalidation.status, 200);
  assert.equal(sourceRequestCount, 2, "cache clear should force a fresh publication read");

  const preview = await fetch(`http://127.0.0.1:${runtimePort}/preview/promotions/verified-promo?token=valid-preview-token`);
  assert.equal(preview.status, 200);
  assert.match(preview.headers.get("cache-control") || "", /no-store/);
  assert.match(preview.headers.get("x-robots-tag") || "", /noindex/);
  const previewHtml = await preview.text();
  assert.match(previewHtml, /data-preview="true"/);
  assert.match(previewHtml, /Nuxt server rendered promotion/);

  const missing = await fetch(`http://127.0.0.1:${runtimePort}/promotions/missing-promo`);
  assert.equal(missing.status, 404);
  console.log("Nuxt runtime end-to-end SSR, preview, and cache revalidation verification passed.");
} finally {
  runtime.kill("SIGTERM");
  await new Promise((resolve) => sourceServer.close(resolve));
}
