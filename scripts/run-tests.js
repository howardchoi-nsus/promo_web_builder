const { spawnSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const scriptsDir = __dirname;
const testFiles = fs.readdirSync(scriptsDir)
  .filter((name) => /^test-.*\.(?:js|mjs)$/.test(name))
  .sort();

for (const testFile of testFiles) {
  console.log(`\n> ${testFile}`);
  const result = spawnSync(process.execPath, [path.join(scriptsDir, testFile)], {
    cwd: path.resolve(scriptsDir, ".."),
    stdio: "inherit",
    env: process.env,
  });
  if (result.status !== 0) process.exit(result.status || 1);
}

console.log(`\nAll ${testFiles.length} test files passed`);
