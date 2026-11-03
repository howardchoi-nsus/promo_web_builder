import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const manifest = JSON.parse(readFileSync(join(root, "document", "manifest.json"), "utf8"));
const landing = readFileSync(join(root, "index.html"), "utf8");
const admin = readFileSync(join(root, "prototype", "index.html"), "utf8");
const documentPage = readFileSync(join(root, "document", "index.html"), "utf8");

assert.ok(manifest.count >= 300, "문서 후보가 누락되었습니다.");
assert.equal(manifest.count, manifest.documents.length);
assert.ok(manifest.documents.some((document) => document.category === "계획서"));
assert.ok(manifest.documents.some((document) => document.category === "프롬프트"));
assert.ok(manifest.documents.every((document) => existsSync(join(root, document.contentUrl))));
assert.ok(manifest.documents.every((document) => /^20\d{2}-\d{2}-\d{2}$/.test(document.updatedAt)));
assert.match(landing, /href="\/document\/"[^>]*>문서보기<\/a>/);
assert.match(admin, /href="\/document\/"[^>]*>문서보기<\/a>/);
assert.match(documentPage, /id="document-table-body"/);
assert.match(documentPage, /id="document-viewer"/);

console.log(`Document library contract passed (${manifest.count} documents)`);
