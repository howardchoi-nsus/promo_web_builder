import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const landing = readFileSync(resolve(root, "index.html"), "utf8");
const v3 = readFileSync(resolve(root, "v3/index.html"), "utf8");

assert.match(landing, /data-version="v3"[^>]*>V3<\/button>/);
assert.match(landing, /href="\/v3\/"[^>]*data-entry="07"[^>]*data-versions="v3"/);
assert.match(landing, /supportedVersions = \["v1", "v2", "v3"\]/);
assert.match(landing, /V3 서비스 계약 구현 현황과 연결된 도구/);
assert.match(v3, /Service contract v3/i);
assert.match(v3, /\/api\/promo-builder-capabilities/);
assert.match(v3, /serviceContractV3/);
assert.match(v3, /V3 준비 완료 · 비활성/);

console.log("Landing V3 version contract passed");
