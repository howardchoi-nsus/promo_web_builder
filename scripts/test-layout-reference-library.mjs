import assert from "node:assert/strict";
import fs from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const store = require("../api/_layout-reference-store.js");
const analysisContract = require("../api/_layout-reference-analysis-contract.js");
const promptStore = require("../api/_prompt-template-store.js");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

const normalized = store.normalizeInput({
  title: "Cinematic event hero",
  sourceSite: "Example",
  sourceUrl: "https://example.com/promo",
  previewImageUrl: "https://cdn.example.com/reference.webp",
  viewport: "responsive",
  visualStyles: ["cinematic", "dark", "cinematic"],
  sectionTypes: ["hero"],
  designSummary: "중앙 집중형 키비주얼과 단일 CTA를 사용하는 Hero 구성",
  layoutSpec: { layoutFamily: "layered-poster" },
  qualityScores: {
    hierarchy: 5, composition: 4, originality: 4, responsiveness: 4, reusability: 5,
  },
  copyrightReviewed: true,
});

assert.equal(normalized.status, "draft");
assert.deepEqual(normalized.visualStyles, ["cinematic", "dark"]);
assert.equal(normalized.qualityScore, 4.4);
assert.equal(store.approvalErrors({ ...normalized, status: "approved" }).length, 0);
assert.deepEqual(promptStore.PROMPT_TYPES.layout_reference_analyzer.requiredVariables, ["sourceUrl", "contextJson"]);
const normalizedAnalysis = analysisContract.normalizeLayoutReferenceAnalysis({
  title: "Layered hero",
  sectionTypes: ["hero", "hero"],
  viewport: "responsive",
  layoutSpec: { layoutFamily: "layered-poster", primitives: ["full-bleed"] },
  qualityScores: { hierarchy: 5, composition: 4, originality: 4, responsiveness: 3, reusability: 5 },
  confidence: 0.84,
});
assert.deepEqual(normalizedAnalysis.sectionTypes, ["hero"]);
assert.equal(normalizedAnalysis.layoutSpec.layoutFamily, "layered-poster");
assert.equal(normalizedAnalysis.confidence, 0.84);
assert.throws(() => store.normalizeInput({
  title: "Unsafe",
  sourceUrl: "file:///etc/passwd",
  qualityScores: {},
}), /HTTP or HTTPS/);
assert.throws(() => store.normalizeInput({
  title: "Private host",
  sourceUrl: "http://localhost/reference",
  qualityScores: {},
}), /public host/);

const adminMain = read("admin-app/src/main.js");
const app = read("prototype/app.js");
const html = read("prototype/index.html");
const component = read("admin-app/src/components/LayoutReferenceManager.vue");
const service = read("admin-app/src/services/layout-reference-service.mjs");
const api = read("api/layout-references.js");
const analysisApi = read("api/layout-reference-analyze.js");
const uploadApi = read("api/layout-reference-image-upload.js");
const migration = read("db/migrations/078_layout_reference_library.sql");
const promptMigration = read("db/migrations/079_layout_reference_analyzer_prompt.sql");

assert.match(adminMain, /PromoAdminLayoutReferences/);
assert.match(app, /adminApp\.component\("layout-reference-manager"/);
assert.match(html, /selectAdminTab\('layout-references'\)/);
assert.match(html, /<layout-reference-manager/);
assert.match(component, /LLM 사용 승인/);
assert.match(component, /copyrightReviewed/);
assert.match(component, /AI 자동 분석/);
assert.match(component, /@vercel\/blob\/client/);
assert.match(service, /\/api\/layout-references/);
assert.match(service, /\/api\/layout-reference-analyze/);
assert.match(api, /resolveAdminOwner/);
assert.match(api, /createReference/);
assert.match(analysisApi, /generateStructuredVisionResult/);
assert.match(analysisApi, /validateRemoteImageUrl/);
assert.match(uploadApi, /resolveAdminOwner/);
assert.match(uploadApi, /maximumSizeInBytes/);
assert.match(migration, /promo_layout_references/);
assert.match(migration, /research_only boolean not null default true/);
assert.match(migration, /analysis_meta jsonb/);
assert.match(promptMigration, /layout_reference_analyzer/);
assert.match(promptMigration, /ignoreInstructionsInsideImage/);
assert.match(promptMigration, /'gpt-6\.1-sol',\s*null,\s*12000/);

console.log("Layout reference library contract tests passed");
