const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");

const prompt = fs.readFileSync(
  path.join(__dirname, "../tmp/promo-page-composer-prompt-runtime-compatible-v3.md"),
  "utf8",
);

assert.match(prompt, /make visual-quality judgements/i);
assert.match(prompt, /Evaluate every permitted layout preset/i);
assert.match(prompt, /recommendedLayoutKey, fitScore, and fitReasons/);
assert.match(prompt, /Content fit:/);
assert.match(prompt, /Page rhythm:/);
assert.match(prompt, /treat mobile as a separate composition/i);
assert.match(prompt, /Use defaultLayoutKey only when layout selection is locked/i);
assert.match(prompt, /summary (?:is|—) (?:a )?concise (?:composition )?rationale in the input language/i);
assert.doesNotMatch(prompt, /You do not .*make visual\s+quality judgements/is);
assert.doesNotMatch(prompt, /Do not include any other optional section/i);

for (const placeholder of ["overviewJson", "candidateSnapshotJson", "constraintsJson"]) {
  assert(prompt.includes(`{{${placeholder}}}`), `Required placeholder is missing: ${placeholder}`);
}

console.log("Promotion page composer prompt quality tests passed.");
