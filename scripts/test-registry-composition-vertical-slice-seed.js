const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");
const { contentHash } = require("../api/_promo-content-resources-store");

const seed = fs.readFileSync(
  path.resolve(__dirname, "../db/seeds/005_seed_registry_composition_vertical_slice.sql"),
  "utf8",
);

assert.match(seed, /^begin;/);
assert.match(seed, /commit;\s*$/);
assert.match(seed, /Registry Composition migrations 029, 031, 044, and 047-053 are required/);
assert.match(seed, /Seed 004 active primitive components are required/);

[
  "registry-promo-card",
  "registry-terms-content",
  "registryHero",
  "registryCardGrid",
  "sharedTerms",
  "hero_centered",
  "hero_left_balanced",
  "hero_center_wide",
  "hero_right_balanced",
  "card_grid_3",
  "terms_default",
  "common-promotion-terms",
  "default-registry",
].forEach((key) => assert.match(seed, new RegExp(key)));

assert.match(seed, /"collection":\{"enabled":true,"minItems":1,"maxItems":3/);
assert.match(seed, /"desktopColumns":3,"mobileColumns":1/);
assert.match(seed, /composition_scope, section_role, composition_policy/);
assert.match(seed, /'registry','hero'/);
assert.match(seed, /'registry','benefit'/);
assert.match(seed, /'shared','terms'/);
assert.match(seed, /"selectionPolicy":"required-by-market"/);
assert.match(seed, /"contentLocked":true/);
assert.match(seed, /'requiredSectionRoles', jsonb_build_array\('hero','terms'\)/);
assert.match(seed, /sharedSectionVersionIds/);
assert.match(seed, /allowedTokenSetVersionIds/);
assert.match(seed, /An active Design Token Set version is required/);
assert.match(seed, /An active fallback Form Template is required/);
assert.match(seed, /activate_promo_composition_shell_version/);
assert.match(seed, /on conflict \(system_seed_code\) do update/);
assert.match(seed, /update wizard_item_component_versions version/);
assert.match(seed, /"slotKey":"cardShadow","semanticRole":"shadow"/);
assert.match(seed, /on conflict \(section_id, item_key\) do update/);
assert.match(seed, /join lateral \(\s+select active_version\.id/);
assert.match(seed, /order by active_version\.version desc/);
assert.match(seed, /on conflict \(section_id, layout_key\) do update/);
assert.match(seed, /where not exists/);
assert.match(seed, /component instance seed is incomplete/);
assert.match(seed, /Layout seed is incomplete/);
assert.doesNotMatch(seed, /imageTarget":"none/);
assert.match(seed, /"allowSectionBackground":true,"imageTarget":"section-background","imageTargetItemKeys":\[\]/);
assert.match(seed, /"imageAspectRatio":"4:3"/);
assert.match(seed, /"widthProfile":"compact"/);
assert.match(seed, /"widthProfile":"balanced"/);
assert.match(seed, /"widthProfile":"wide"/);
assert.match(seed, /"widthPct":76/);
assert.match(seed, /'Hero Key Visual','Concise copy over a Section-level Hero key visual\.'/);
assert.doesNotMatch(seed, /'registryHero','content-image','visual'/);
assert.match(seed, /"labelRequired":true,"linkRequired":true,"maxLength":20/);
assert.doesNotMatch(seed, /generic stock photograph[^]*generic stock photograph/);
assert.match(seed, /"backgroundColorToken":"--app-bg"/);
assert.match(seed, /"backgroundColorToken":"--app-surface"/);
assert.doesNotMatch(seed, /"backgroundColor":"#[0-9a-f]{6}"/i);
assert.doesNotMatch(seed, /wizard_section_components/);
assert.doesNotMatch(seed, /insert into wizard_content_sections \(\s*component_id,/);
assert.doesNotMatch(
  seed,
  /status = case\s+when promo_composition_shell_versions\.status = 'archived'/,
);
const termsContent = {
  components: {
    termsContent: {
      fields: {
        fld_20000000000000000000000000000001:
          "본 프로모션은 대상 고객과 운영 기간에 따라 혜택이 달라질 수 있으며, 세부 조건은 공지된 이용약관을 따릅니다.",
      },
    },
  },
};
const expectedHash = contentHash(termsContent);
assert.equal(expectedHash.length, 64);
assert.match(seed, /encode\(digest\(v_canonical, 'sha256'\), 'hex'\)/);
assert.equal(JSON.stringify(termsContent), '{"components":{"termsContent":{"fields":{"fld_20000000000000000000000000000001":"본 프로모션은 대상 고객과 운영 기간에 따라 혜택이 달라질 수 있으며, 세부 조건은 공지된 이용약관을 따릅니다."}}}}');

console.log("Registry Composition vertical slice Seed contract passed");
