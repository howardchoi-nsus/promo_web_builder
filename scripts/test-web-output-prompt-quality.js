const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const read = (...parts) => fs.readFileSync(path.join(root, ...parts), "utf8");

const migration = read("db", "migrations", "075_web_output_prompt_quality_pack.sql");
const pagePrompt = read("prompts", "promo-page-generation.md");
const composerReference = read("tmp", "promo-page-composer-prompt-runtime-compatible-v3.md");
const candidates = read("api", "_promo-registry-composition-candidates.js");
const assets = read("api", "_promo-builder-assets.js");

assert.equal((migration.match(/\$page_prompt\$/g) || []).length, 2);
assert.match(migration, /^begin;/);
assert.match(migration, /commit;\s*$/);

for (const type of [
  "promo_overview_parser",
  "promo_page_composer",
  "promo_composition_editor",
  "promo_page_generation",
]) {
  assert(migration.includes("'" + type + "'"), "Missing quality candidate: " + type);
}

assert.match(migration, /'draft'/);
assert.match(migration, /source_prompt_template_id/);
assert.match(migration, /prompt_template_histories/);
assert.match(migration, /where existing\.lineage_id/);
assert.match(migration, /Web Output prompt quality pack candidate/);

for (const gate of [
  "OVERVIEW_FACTS",
  "OVERVIEW_COPY",
  "OVERVIEW_LANGUAGE",
  "OVERVIEW_ENUMS",
  "OVERVIEW_DECISIONS",
  "OVERVIEW_SOURCES",
  "CONTRACT_V3_CONTENT_ITEMS",
  "CONTENT_FIDELITY",
  "SECTION_ORDER",
  "LAYOUT_RHYTHM",
  "RESPONSIVE",
  "DESIGN_REFERENCE",
  "ANTI_GENERIC",
  "EDIT_MINIMALITY",
  "EDIT_CONTENT_FIDELITY",
  "EDIT_STRUCTURE",
  "EDIT_RESPONSIVE",
  "EDIT_SUMMARY",
]) {
  assert(migration.includes("QUALITY GATE: " + gate), "Missing quality gate: " + gate);
}

assert.match(migration, /at most 20 Unicode characters/);
assert.match(migration, /Never infer market from language or locale/);
assert.match(migration, /smallest valid operation set/);
assert.match(migration, /Required, fixed, locked, and legal sections must remain present/);

for (const source of [migration, pagePrompt]) {
  assert.match(source, /1440px/);
  assert.match(source, /390px/);
  assert.match(source, /320px/);
  assert.match(source, /exactly one h1|one h1/i);
  assert.match(source, /focus-visible/);
  assert.match(source, /44px/);
  assert.match(source, /4\.5:1/);
  assert.match(source, /3:1/);
  assert.match(source, /prefers-reduced-motion/);
  assert.match(source, /horizontal (?:page )?scroll|horizontal overflow/i);
  assert.match(source, /fixed heights|fixed-height/i);
  assert.match(source, /unsupported amounts|unsupported.*percentages/i);
  assert.match(source, /duplicated benefit|duplicate filler/i);
  assert.match(source, /TEXT_FIRST_MVP/);
  assert.match(source, /background-image/);
  assert.match(source, /@import/);
  assert.match(source, /qualityChecks/);
  assert.match(source, /TOKEN_DISCIPLINE/);
  assert.match(source, /dominant promotion-input language/);
  for (const field of [
    "layoutPhilosophy",
    "visualMood",
    "spacingRhythm",
    "componentStyle",
    "depthAndEffects",
    "shapeAndRadius",
    "promoPageImplications",
    "dosApplied",
    "dontsAvoided",
    "notColorFontOnlyProof",
  ]) {
    assert(source.includes(`"${field}"`), `Missing mdComplianceMap field: ${field}`);
  }
}

assert.doesNotMatch(pagePrompt, /Generate for desktop first/i);
assert.doesNotMatch(pagePrompt, /@import for Pretendard/i);

assert.match(composerReference, /every included component must contain contentItems/i);
assert.match(composerReference, /repeatIndex from 0 through repeat-1/i);
assert.match(composerReference, /distinct, campaign-specific non-CTA copy/i);
assert.match(composerReference, /Respect every field\s+maxLength/);
assert.doesNotMatch(composerReference, /You do not write promotion copy/i);

for (const field of ["sortOrder", "fixedPosition", "rankScore", "matchedCapabilities", "maxLength"]) {
  assert(candidates.includes(field), "Planner snapshot is missing " + field);
}

assert.match(assets, /function sectionVisualSafeArea/);
assert.match(assets, /mediaSafeSide/);
assert.match(assets, /const safeArea = isComponent \? "none" : sectionVisualSafeArea\(section\)/);
assert.match(assets, /imageRequest:\s*\{[\s\S]*?safeArea,/);
assert.match(assets, /requestSnapshot = \{[\s\S]*?safeArea,/);

console.log("Web Output prompt quality tests passed.");
