import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import {
  EXPECTED_MIGRATION_SHA256,
  MIGRATION_URL,
  assertApprovedPreviewTarget,
  databaseRedactionSecrets,
  migrationPlan,
  parseArgs,
  redactSecrets,
  resolvePreviewTarget,
  stripOuterTransaction,
  targetFingerprint,
  validateCandidateTransition,
} from "./apply-web-output-prompt-quality-pack.mjs";

const scriptUrl = new URL("./apply-web-output-prompt-quality-pack.mjs", import.meta.url);
const planRun = spawnSync(process.execPath, [scriptUrl.pathname], {
  cwd: new URL("..", import.meta.url),
  encoding: "utf8",
  env: {},
});
assert.equal(planRun.status, 0, planRun.stderr);
const planOutput = JSON.parse(planRun.stdout);
assert.equal(planOutput.mode, "plan");
assert.equal(planOutput.networkAccess, false);
assert.equal(planOutput.migrationSha256, EXPECTED_MIGRATION_SHA256);

assert.deepEqual(parseArgs([]), {
  mode: "plan",
  target: "",
  confirmTarget: "",
  backupConfirmed: false,
});
assert.equal(parseArgs(["--check", "--target=preview"]).mode, "check");
assert.equal(parseArgs([
  "--apply",
  "--target=preview",
  "--confirm-target=abc123",
  "--backup-confirmed",
]).mode, "apply");
assert.throws(() => parseArgs(["--check", "--apply", "--target=preview"]), /either --check or --apply/);
assert.throws(() => parseArgs(["--check"]), /requires --target=preview/);
assert.throws(() => parseArgs(["--apply", "--target=production"]), /requires --target=preview/);
assert.throws(() => parseArgs(["--sql=other.sql"]), /Unknown argument/);

const migrationSql = readFileSync(MIGRATION_URL, "utf8");
const rolloutSource = readFileSync(scriptUrl, "utf8");
assert.match(rolloutSource, /\$\{lock \? "for update" : ""\}/);
const checkedPlan = migrationPlan();
assert.equal(checkedPlan.migrationSha256, EXPECTED_MIGRATION_SHA256);
assert.equal(checkedPlan.contract.qualityInstructions.promo_page_composer.length, 7);
assert.match(checkedPlan.contract.pagePromptBody, /# QUALITY GATE: TEXT_FIRST_MVP/);
assert.match(checkedPlan.contract.composerRepairPrompt, /Previous validation error/);
const body = stripOuterTransaction(migrationSql);
assert.doesNotMatch(body, /^begin\s*;/i);
assert.doesNotMatch(body, /commit\s*;\s*$/i);
assert.match(body, /with ranked_source as/i);
assert.throws(() => stripOuterTransaction("select 1;"), /BEGIN\/COMMIT/);

const previewUrl = "postgresql://preview-user:preview-password@preview.example.test:5432/promo_preview?sslmode=require";
const productionUrl = "postgresql://prod-user:prod-password@production.example.test:5432/promo_prod?sslmode=require";
const target = resolvePreviewTarget({ PREVIEW_DATABASE_URL: previewUrl, DATABASE_URL: productionUrl });
assert.equal(target.fingerprint, targetFingerprint(previewUrl));
assert.equal(target.fingerprint.length, 12);
assert.throws(
  () => resolvePreviewTarget({ DATABASE_URL: productionUrl }),
  /production database fallbacks are intentionally disabled/,
);
assert.throws(
  () => resolvePreviewTarget({ VERCEL_ENV: "production", PREVIEW_DATABASE_URL: previewUrl }),
  /VERCEL_ENV=production/,
);
assert.throws(
  () => resolvePreviewTarget({ PREVIEW_DATABASE_URL: previewUrl, DATABASE_URL: previewUrl }),
  /same database target as DATABASE_URL/,
);
assert.throws(
  () => resolvePreviewTarget({
    PREVIEW_DATABASE_URL: "postgresql://user:pass@ep-shared-pooler.example.test/promo",
    POSTGRES_URL_NON_POOLING: "postgresql://user:pass@ep-shared.example.test/promo",
  }),
  /same database target as POSTGRES_URL_NON_POOLING/,
);
const redacted = redactSecrets(`Could not connect to ${previewUrl}`, [previewUrl]);
assert.doesNotMatch(redacted, /preview-user|preview-password|preview\.example/);
assert.match(redacted, /REDACTED_DB_TARGET/);
const componentRedacted = redactSecrets(
  "DNS lookup failed for preview.example.test as preview-user on promo_preview",
  databaseRedactionSecrets({ PREVIEW_DATABASE_URL: previewUrl }),
);
assert.doesNotMatch(componentRedacted, /preview\.example|preview-user|promo_preview/);
assert.throws(
  () => assertApprovedPreviewTarget(target, { confirmTarget: target.fingerprint }, {}),
  /separately approved/,
);
assert.throws(
  () => assertApprovedPreviewTarget(target, { confirmTarget: target.fingerprint }, {
    PROMPT_QUALITY_PREVIEW_FINGERPRINT: "000000000000",
  }),
  /does not match/,
);
assert.doesNotThrow(() => assertApprovedPreviewTarget(target, { confirmTarget: target.fingerprint }, {
  PROMPT_QUALITY_PREVIEW_FINGERPRINT: target.fingerprint,
}));

const baseRows = [
  ["promo_overview_parser", "Promotion Overview Parser — Web Output Quality"],
  ["promo_page_composer", "AI Promotion Page Composer — Web Output Quality"],
  ["promo_composition_editor", "AI Promotion Composition Editor — Web Output Quality"],
  ["promo_page_generation", "Promo Page Generation — Responsive Text-first Quality"],
].map(([type, name], index) => {
  const sourceBody = `source body ${type}`;
  const candidateBody = type === "promo_page_generation"
    ? checkedPlan.contract.pagePromptBody
    : sourceBody;
  const promptLayers = {
    schemaVersion: 2,
    postInstructions: checkedPlan.contract.qualityInstructions[type],
    ...(type === "promo_page_composer"
      ? { repairPrompts: { contractV3: checkedPlan.contract.composerRepairPrompt } }
      : {}),
  };
  return {
  id: `candidate-${index}`,
  type,
  name,
  status: "draft",
  version: 1,
  source_prompt_template_id: `source-${index}`,
  body: candidateBody,
  source_body: sourceBody,
  source_model_options: {},
  model_options: { promptLayers },
  provider_matches: true,
  model_matches: true,
  temperature_matches: true,
  max_tokens_match: true,
  response_format_matches: true,
  required_variables_match: true,
  optional_variables_match: true,
  history_count: 1,
  migration_history_count: 1,
  migration_history_matches: true,
  };
});
assert.doesNotThrow(() => validateCandidateTransition([], baseRows));
assert.doesNotThrow(() => validateCandidateTransition(baseRows, baseRows));
assert.doesNotThrow(() => validateCandidateTransition(
  baseRows.map((row) => ({ ...row, status: "validated" })),
  baseRows.map((row) => ({ ...row, status: "validated" })),
));
assert.throws(
  () => validateCandidateTransition(
    baseRows.map((row) => ({ ...row, status: "archived" })),
    baseRows.map((row) => ({ ...row, status: "archived" })),
  ),
  /must be draft or validated/,
);
assert.throws(
  () => validateCandidateTransition(
    baseRows.map((row) => ({ ...row, status: "inactive" })),
    baseRows.map((row) => ({ ...row, status: "inactive" })),
  ),
  /must be draft or validated/,
);
assert.throws(() => validateCandidateTransition(baseRows.slice(0, 2), baseRows), /partial candidate set/);
assert.throws(
  () => validateCandidateTransition([], baseRows.map((row) => row.type === "promo_page_composer"
    ? { ...row, model_options: { promptLayers: { schemaVersion: 2, postInstructions: [] } } }
    : row)),
  /quality instructions/,
);

const applyWithoutTarget = spawnSync(process.execPath, [
  scriptUrl.pathname,
  "--apply",
  "--target=preview",
  "--confirm-target=not-a-real-target",
  "--backup-confirmed",
], {
  cwd: new URL("..", import.meta.url),
  encoding: "utf8",
  env: { DATABASE_URL: productionUrl },
});
assert.notEqual(applyWithoutTarget.status, 0);
assert.match(applyWithoutTarget.stderr, /PREVIEW_DATABASE_URL is required/);
assert.doesNotMatch(applyWithoutTarget.stderr, /production\.example|prod-password/);

console.log("Web Output prompt quality rollout safety tests passed.");
