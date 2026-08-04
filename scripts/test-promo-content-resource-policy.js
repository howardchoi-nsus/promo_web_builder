const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { contentHash } = require("../api/_promo-content-resources-store");
const {
  localeSpecificity,
  ruleScore,
  selectResourceReferences,
  enrichCandidatesWithResourcePolicy,
} = require("../api/_promo-resource-policy");

const migration = fs.readFileSync(
  path.resolve(__dirname, "../db/migrations/052_content_resource_registry.sql"),
  "utf8",
);
const policySource = fs.readFileSync(
  path.resolve(__dirname, "../api/_promo-resource-policy.js"),
  "utf8",
);
const candidateSource = fs.readFileSync(
  path.resolve(__dirname, "../api/_promo-registry-composition-candidates.js"),
  "utf8",
);

assert.equal(localeSpecificity("ko-KR", "ko-KR"), 3);
assert.equal(localeSpecificity("ko", "ko-KR"), 2);
assert.equal(localeSpecificity("*", "ko-KR"), 1);
assert.equal(localeSpecificity("en", "ko-KR"), 0);
assert.ok(ruleScore({ marketCode: "KR", locale: "ko-KR", promotionPurpose: "이벤트", priority: 1 }, {
  market: "KR", locale: "ko-KR", promotionPurpose: "이벤트",
}) > ruleScore({ marketCode: "*", locale: "*", promotionPurpose: "*", priority: 1 }, {
  market: "KR", locale: "ko-KR", promotionPurpose: "이벤트",
}));

const rules = [{
  id: "rule-kr",
  resourceId: "terms",
  resourceKey: "common-terms",
  resourceType: "terms",
  marketCode: "KR",
  locale: "ko-KR",
  promotionPurpose: "*",
  sectionRole: "terms",
  isRequired: true,
  priority: 10,
}, {
  id: "rule-global",
  resourceId: "terms",
  resourceKey: "common-terms",
  resourceType: "terms",
  marketCode: "*",
  locale: "*",
  promotionPurpose: "*",
  sectionRole: "terms",
  isRequired: true,
  priority: 0,
}];
const versions = [{
  resourceVersionId: "terms-ko-v2",
  resourceId: "terms",
  locale: "ko-KR",
  version: 2,
  contentHash: "hash-ko-v2",
}, {
  resourceVersionId: "terms-global-v1",
  resourceId: "terms",
  locale: "*",
  version: 1,
  contentHash: "hash-global-v1",
}];
const resolved = selectResourceReferences({
  rules,
  versions,
  criteria: { market: "KR", locale: "ko-KR", promotionPurpose: "이벤트" },
});
assert.equal(resolved.references.length, 1);
assert.equal(resolved.references[0].marketRuleId, "rule-kr");
assert.equal(resolved.references[0].resourceVersionId, "terms-ko-v2");
assert.equal(Object.hasOwn(resolved.references[0], "content"), false, "candidate references must not expose resource body");

const enriched = enrichCandidatesWithResourcePolicy({
  sections: [{ sectionKey: "terms", sectionRole: "terms", rankScore: 10, sortOrder: 50 }],
  resources: resolved.references,
});
assert.equal(enriched.issues.length, 0);
assert.equal(enriched.sections[0].resolvedRequired, true);
assert.equal(enriched.sections[0].resourceReferences[0].resourceVersionId, "terms-ko-v2");

const missingSection = enrichCandidatesWithResourcePolicy({ sections: [], resources: resolved.references });
assert.equal(missingSection.issues[0].code, "REQUIRED_RESOURCE_SECTION_MISSING");
assert.equal(contentHash({ b: 2, a: 1 }), contentHash({ a: 1, b: 2 }));

assert.match(migration, /promo_content_resources/);
assert.match(migration, /promo_content_resource_versions/);
assert.match(migration, /promo_content_resource_market_rules/);
assert.match(migration, /promo_content_resource_histories/);
assert.match(migration, /effective_to is null or effective_to > effective_from/);
assert.match(migration, /Active content resource effective range overlaps/);
assert.match(migration, /version-effective-range-closed/);
assert.match(migration, /set effective_to = v_target\.effective_from/);
assert.match(policySource, /version\.effective_from <=/);
assert.doesNotMatch(policySource, /select[\s\S]{0,180}content_json/i);
assert.match(candidateSource, /resolveContentResourceReferences/);
assert.match(candidateSource, /enrichCandidatesWithResourcePolicy/);

console.log("Promo content Resource Registry and Policy Enricher tests passed");
