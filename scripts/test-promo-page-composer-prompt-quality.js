const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const migration = fs.readFileSync(
  path.join(__dirname, "../db/migrations/075_web_output_prompt_quality_pack.sql"),
  "utf8",
);

assert.match(migration, /'promo_page_composer'/);
assert.match(migration, /AI Promotion Page Composer — Web Output Quality/);
assert.match(migration, /QUALITY GATE: CONTRACT_V3_CONTENT_ITEMS/);
assert.match(migration, /overrides any earlier instruction that says not to create content/i);
assert.match(migration, /every component object must include contentItems/i);
assert.match(migration, /contentLocked, aiEditable false, component-locked, or image-only components/i);
assert.match(migration, /repeatIndex from 0 through repeat-1/i);
assert.match(migration, /distinct, campaign-specific copy/i);
assert.match(migration, /QUALITY GATE: CONTENT_FIDELITY/);
assert.match(migration, /Respect each field maxLength/);
assert.match(migration, /QUALITY GATE: SECTION_ORDER/);
assert.match(migration, /Preserve each selected section sortOrder/);
assert.match(migration, /fixedPosition as a binding ordering constraint/);
assert.match(migration, /do not emit fixedPosition when it is not a response-schema field/);
assert.match(migration, /QUALITY GATE: LAYOUT_RHYTHM/);
assert.match(migration, /recommendedLayoutKey, fitScore, fitReasons/);
assert.match(migration, /QUALITY GATE: RESPONSIVE/);
assert.match(migration, /mobileStrategy as a separate composition decision/);
assert.match(migration, /QUALITY GATE: DESIGN_REFERENCE/);
assert.match(migration, /QUALITY GATE: ANTI_GENERIC/);

// Contract repair must repair authored contentItems instead of repeating the
// legacy instruction that prohibited all content creation.
assert.match(migration, /Every component must contain contentItems/);
assert.match(migration, /For editable non-image fields, write grounded campaign copy/i);
assert.doesNotMatch(migration, /Do not create content,/i);

// The candidate remains governed: deployment creates a reviewable draft and
// keeps source lineage/history instead of silently replacing the active prompt.
assert.match(migration, /prepared\.next_body,[\s\S]*?'draft'/);
assert.match(migration, /source_prompt_template_id/);
assert.match(migration, /prompt_template_histories/);
assert.match(migration, /where existing\.lineage_id/);

console.log("Promotion page composer prompt quality tests passed.");
