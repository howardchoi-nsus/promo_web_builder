const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const targets = [
  "prototype/index.html",
  "prototype/app.js",
  "prototype/shared-shell.js",
  "prototype/admin/template-layout-manager.js",
];
const koreanPattern = /[가-힣][가-힣\s·/(){}:+&.,!?0-9A-Za-z_-]*/g;
const labels = new Map();

targets.forEach((relativePath) => {
  const source = fs.readFileSync(path.join(root, relativePath), "utf8");
  const values = [...source.matchAll(koreanPattern)]
    .map((match) => match[0].replace(/\s+/g, " ").trim())
    .filter((value) => value.length >= 2);
  [...new Set(values)].forEach((value) => {
    const locations = labels.get(value) || [];
    locations.push(relativePath);
    labels.set(value, locations);
  });
});

const sorted = [...labels.entries()].sort(([left], [right]) => left.localeCompare(right, "ko"));
console.log(JSON.stringify({
  generatedAt: new Date().toISOString(),
  targets,
  uniqueLabelCount: sorted.length,
  labels: sorted.map(([value, files]) => ({ value, files: [...new Set(files)] })),
}, null, 2));
