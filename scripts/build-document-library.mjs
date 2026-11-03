import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { basename, extname, join, relative, resolve, sep } from "node:path";

const root = resolve(import.meta.dirname, "..");
const outputRoot = join(root, "document");
const contentRoot = join(outputRoot, "content");
const sourceRoots = [
  "README.md",
  "design-qa.md",
  "docs",
  "prompts",
  "data",
  "보고서 산출물",
];
const textExtensions = new Set([".md", ".mdx", ".txt"]);
const excludedDirectoryNames = new Set(["node_modules", ".git", "tmp", "document"]);

function walk(entryPath) {
  const absolutePath = join(root, entryPath);
  if (!existsSync(absolutePath)) return [];
  const stats = statSync(absolutePath);
  if (stats.isFile()) return isDocumentFile(absolutePath) ? [absolutePath] : [];
  return readdirSync(absolutePath, { withFileTypes: true })
    .flatMap((entry) => {
      if (entry.isDirectory() && excludedDirectoryNames.has(entry.name)) return [];
      const child = join(absolutePath, entry.name);
      if (entry.isDirectory()) return walk(relative(root, child));
      return isDocumentFile(child) ? [child] : [];
    });
}

function isDocumentFile(filePath) {
  const extension = extname(filePath).toLowerCase();
  if (textExtensions.has(extension)) return true;
  return relative(root, filePath).split(sep)[0] === "prompts" && extension === "";
}

function firstHeading(source, fallback) {
  const match = source.match(/^#\s+(.+)$/m);
  return String(match?.[1] || fallback)
    .replace(/[*_`]/g, "")
    .trim();
}

function categoryFor(sourcePath) {
  const normalized = sourcePath.replaceAll("\\", "/").toLowerCase();
  if (normalized.startsWith("prompts/") || /prompt|프롬프트/.test(normalized)) return "프롬프트";
  if (/\/계획\/|development-plan|roadmap|plan-/.test(normalized)) return "계획서";
  if (/\/기획(?:-source)?\/|product-plan|proposal/.test(normalized)) return "기획서";
  if (/\/설계\/|architecture|technical-design|service-flow/.test(normalized)) return "설계서";
  if (/\/handoff\/|handoff-|인수인계/.test(normalized)) return "인수인계";
  if (/\/qa\/|audit|quality|test-scenario/.test(normalized)) return "QA 보고서";
  if (/\/정책\/|policy/.test(normalized)) return "정책";
  if (/\/구현\/|implementation/.test(normalized)) return "구현 문서";
  if (/보고서 산출물|report|review/.test(normalized)) return "보고서";
  if (/design-md|\/data\//.test(normalized)) return "디자인 참고자료";
  if (/readme\.md$/.test(normalized)) return "안내서";
  return "기술 문서";
}

function updatedDateFor(sourcePath) {
  const fileNameDate = sourcePath.match(/(20\d{2})-(\d{2})-(\d{2})/);
  if (fileNameDate) return fileNameDate[0];
  try {
    const date = execFileSync("git", ["log", "-1", "--format=%cs", "--", sourcePath], {
      cwd: root,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
    if (/^20\d{2}-\d{2}-\d{2}$/.test(date)) return date;
  } catch {
    // Fall back to the filesystem date outside a Git checkout.
  }
  return statSync(join(root, sourcePath)).mtime.toISOString().slice(0, 10);
}

function assertNoSecrets(source, sourcePath) {
  const secretPatterns = [
    ["private key", /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/],
    ["OpenAI API key", /\bsk-[A-Za-z0-9_-]{20,}\b/],
    ["GitHub token", /\bgh[pousr]_[A-Za-z0-9]{20,}\b/],
    ["AWS access key", /\bAKIA[0-9A-Z]{16}\b/],
    ["JWT", /\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b/],
  ];
  const hit = secretPatterns.find(([, pattern]) => pattern.test(source));
  if (hit) throw new Error(`Refusing to publish ${sourcePath}: detected ${hit[0]}`);
  const credentialUrl = source.match(/\b(?:postgres(?:ql)?|mysql|mongodb(?:\+srv)?):\/\/[^\s:@/]+:[^\s@/]+@[^\s]+/i)?.[0] || "";
  const usesPlaceholders = /[<>{}$]/.test(credentialUrl) || /example|your-|replace/i.test(credentialUrl);
  if (credentialUrl && !usesPlaceholders) {
    throw new Error(`Refusing to publish ${sourcePath}: detected credential URL`);
  }
}

const sourceFiles = [...new Set(sourceRoots.flatMap(walk))]
  .map((absolutePath) => relative(root, absolutePath))
  .sort((a, b) => a.localeCompare(b, "ko"));

const existingManifestPath = join(outputRoot, "manifest.json");
let existingDocuments = [];
if (existsSync(existingManifestPath)) {
  try {
    existingDocuments = JSON.parse(readFileSync(existingManifestPath, "utf8")).documents || [];
  } catch {
    // A malformed or missing manifest should not block rebuilding the library.
  }
}
const existingDocumentBySourcePath = new Map(
  existingDocuments.map((document) => [document.sourcePath, document]),
);
let nextDocumentNumber = existingDocuments.reduce((largest, document) => {
  const number = Number.parseInt(String(document.id || "").replace(/^doc-/, ""), 10);
  return Number.isFinite(number) ? Math.max(largest, number) : largest;
}, 0) + 1;

rmSync(contentRoot, { recursive: true, force: true });
mkdirSync(contentRoot, { recursive: true });

const documents = sourceFiles.map((sourcePath) => {
  const absoluteSourcePath = join(root, sourcePath);
  const source = readFileSync(absoluteSourcePath, "utf8");
  assertNoSecrets(source, sourcePath);
  const sourceExtension = extname(sourcePath).toLowerCase();
  const outputExtension = textExtensions.has(sourceExtension) ? sourceExtension : ".txt";
  const normalizedSourcePath = sourcePath.replaceAll("\\", "/");
  const existingDocument = existingDocumentBySourcePath.get(normalizedSourcePath);
  const id = existingDocument?.id || `doc-${String(nextDocumentNumber++).padStart(4, "0")}`;
  const outputFileName = `${id}${outputExtension}`;
  const publicSource = `${source.replace(/[ \t]+$/gm, "").replace(/\n+$/, "")}\n`;
  writeFileSync(join(contentRoot, outputFileName), publicSource);
  const fallbackTitle = basename(sourcePath, extname(sourcePath)).replaceAll(/[-_]+/g, " ");
  return {
    id,
    title: firstHeading(source, fallbackTitle),
    category: categoryFor(sourcePath),
    updatedAt: updatedDateFor(sourcePath),
    sourcePath: normalizedSourcePath,
    contentUrl: `/document/content/${outputFileName}`,
  };
});

const manifest = {
  generatedAt: `${documents.reduce((latest, document) => document.updatedAt > latest ? document.updatedAt : latest, "1970-01-01")}T00:00:00.000Z`,
  count: documents.length,
  documents,
};

writeFileSync(join(outputRoot, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Document library generated: ${documents.length} documents`);
