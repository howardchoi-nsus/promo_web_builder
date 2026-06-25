const fs = require("fs");
const path = require("path");

const root = process.cwd();
const docsDir = path.join(root, "docs", "design-md");
const outFile = path.join(root, "db", "seeds", "001_seed_design_md.sql");
const chunkDir = path.join(root, "db", "seeds", "chunks");

const categories = [
  "overview",
  "colors",
  "typography",
  "layout",
  "elevation",
  "shapes",
  "components",
  "responsive_guidelines",
  "dos_and_donts",
  "known_gaps",
  "other",
];

function titleCase(slug) {
  return slug
    .split(/[-.]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function sql(value) {
  if (value === null || value === undefined) return "null";
  return `'${String(value).replace(/'/g, "''")}'`;
}

function jsonb(value) {
  return `${sql(JSON.stringify(value))}::jsonb`;
}

function normalizeCategory(title) {
  const raw = title.toLowerCase().replace(/^\d+\.\s*/, "");
  if (raw.includes("color") || raw.includes("palette")) return "colors";
  if (raw.includes("typography") || raw.includes("font")) return "typography";
  if (raw.includes("layout") || raw.includes("spacing") || raw.includes("grid")) return "layout";
  if (raw.includes("elevation") || raw.includes("depth") || raw.includes("shadow")) return "elevation";
  if (raw.includes("shape") || raw.includes("radius") || raw.includes("geometry")) return "shapes";
  if (raw.includes("component") || raw.includes("styling")) return "components";
  if (raw.includes("responsive") || raw.includes("breakpoint")) return "responsive_guidelines";
  if (raw.includes("do's") || raw.includes("don't") || raw.includes("dos")) return "dos_and_donts";
  if (raw.includes("gap")) return "known_gaps";
  if (raw.includes("overview") || raw.includes("theme") || raw.includes("atmosphere")) return "overview";
  return "other";
}

function stripFrontmatter(markdown) {
  if (!markdown.startsWith("---")) return { frontmatter: "", body: markdown };
  const end = markdown.indexOf("\n---", 3);
  if (end === -1) return { frontmatter: "", body: markdown };
  return {
    frontmatter: markdown.slice(3, end).trim(),
    body: markdown.slice(end + 4).replace(/^\r?\n/, ""),
  };
}

function readFrontmatterValue(frontmatter, key) {
  const pattern = new RegExp(`^${key}:\\s*(.+)$`, "im");
  const match = frontmatter.match(pattern);
  if (!match) return "";
  return match[1].trim().replace(/^["']|["']$/g, "");
}

function splitSections(markdown) {
  const lines = markdown.split(/\r?\n/);
  const sections = [];
  let current = null;

  for (const line of lines) {
    const match = /^(#{1,4})\s+(.+)$/.exec(line);
    if (match && match[1].length <= 2) {
      if (current) sections.push(current);
      current = {
        level: match[1].length,
        title: match[2].trim(),
        content: [line],
      };
    } else if (current) {
      current.content.push(line);
    }
  }

  if (current) sections.push(current);
  return sections.map((section, index) => ({
    sortOrder: index + 1,
    originalTitle: section.title,
    normalizedTitle: normalizeCategory(section.title),
    contentMarkdown: section.content.join("\n").trim(),
  }));
}

function extractColors(markdown) {
  return Array.from(new Set(markdown.match(/#[0-9a-fA-F]{6}\b/g) || [])).slice(0, 40);
}

function extractFonts(markdown) {
  const fonts = new Set();
  const patterns = [
    /fontFamily:\s*["']([^"']+)["']/gi,
    /font-family:\s*["']?([^"'\n`]+(?:sans-serif|serif|monospace|Arial|Inter|Helvetica|Georgia))["']?/gi,
    /(?:Primary|Heading|Body|Display):\s*`?([^`\n]+(?:sans-serif|serif|monospace|Arial|Inter|Helvetica|Georgia))`?/gi,
  ];

  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(markdown))) {
      fonts.add(match[1].trim());
    }
  }

  return Array.from(fonts).slice(0, 20);
}

function buildDoc(slug) {
  const filePath = path.join(docsDir, slug, "DESIGN.md");
  const markdown = fs.readFileSync(filePath, "utf8");
  const { frontmatter, body } = stripFrontmatter(markdown);
  const name = readFrontmatterValue(frontmatter, "name") || `${titleCase(slug)} Design System`;
  const description = readFrontmatterValue(frontmatter, "description");
  const sections = splitSections(body);
  const colors = extractColors(markdown);
  const fonts = extractFonts(markdown);

  return {
    slug,
    brandName: titleCase(slug),
    name,
    description,
    originalFilename: `docs/design-md/${slug}/DESIGN.md`,
    markdown,
    sections,
    tokens: [
      ...colors.map((color, index) => ({
        tokenType: "color",
        tokenName: `color_${index + 1}`,
        tokenValue: color,
        role: index === 0 ? "primary_detected" : "detected",
        usageNote: "Extracted from DESIGN.md",
      })),
      ...fonts.map((font, index) => ({
        tokenType: "typography",
        tokenName: `font_${index + 1}`,
        tokenValue: font,
        role: index === 0 ? "primary_detected" : "detected",
        usageNote: "Extracted from DESIGN.md",
      })),
    ],
  };
}

function buildSqlForDoc(doc) {
  const sectionRows = doc.sections.length
    ? doc.sections
        .map(
          (section) =>
            `((select id from d), ${sql(section.normalizedTitle)}, ${sql(section.originalTitle)}, ${sql(section.normalizedTitle)}, ${sql(section.contentMarkdown)}, ${jsonb({ sourcePath: doc.originalFilename, category: section.normalizedTitle })}, 0.75, ${section.sortOrder})`
        )
        .join(",\n")
    : "";

  const tokenRows = doc.tokens.length
    ? doc.tokens
        .map(
          (token) =>
            `((select id from design_documents where original_filename = ${sql(doc.originalFilename)}), ${sql(token.tokenType)}, ${sql(token.tokenName)}, ${sql(token.tokenValue)}, ${sql(token.role)}, ${sql(token.usageNote)})`
        )
        .join(",\n")
    : "";

  return `
-- ${doc.brandName}
with b as (
  insert into brands (name, slug, category, website_url, updated_at)
  values (${sql(doc.brandName)}, ${sql(doc.slug)}, 'design-reference', null, now())
  on conflict (slug) do update
    set name = excluded.name,
        category = excluded.category,
        updated_at = now()
  returning id
),
d as (
  insert into design_documents (
    brand_id,
    source_type,
    original_filename,
    original_blob_url,
    status,
    raw_markdown,
    updated_at
  )
  select id, 'markdown_seed', ${sql(doc.originalFilename)}, null, 'seeded', ${sql(doc.markdown)}, now()
  from b
  on conflict (brand_id, original_filename) do update
    set status = 'seeded',
        raw_markdown = excluded.raw_markdown,
        updated_at = now()
  returning id
),
deleted_sections as (
  delete from design_sections where document_id = (select id from d)
),
deleted_tokens as (
  delete from design_tokens where document_id = (select id from d)
)
${sectionRows ? `insert into design_sections (document_id, category, original_title, normalized_title, content_markdown, content_json, confidence, sort_order)\nvalues\n${sectionRows};` : "select 1;"}

${tokenRows ? `insert into design_tokens (document_id, token_type, token_name, token_value, role, usage_note)\nvalues\n${tokenRows};` : ""}

delete from analysis_runs
where document_id = (select id from design_documents where original_filename = ${sql(doc.originalFilename)})
  and model = 'seed-script';

insert into analysis_runs (document_id, model, status, error_message, completed_at)
select id, 'seed-script', 'completed', null, now()
from design_documents
where original_filename = ${sql(doc.originalFilename)};
`;
}

function main() {
  fs.mkdirSync(chunkDir, { recursive: true });
  const slugs = fs
    .readdirSync(docsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((slug) => fs.existsSync(path.join(docsDir, slug, "DESIGN.md")))
    .sort();

  const docs = slugs.map(buildDoc);
  const sqlText = `-- Generated from docs/design-md/*/DESIGN.md
-- Run this in Neon SQL Editor after the initial schema is created.
-- Documents: ${docs.length}

create extension if not exists pgcrypto;

alter table design_documents
  add column if not exists raw_markdown text;

create unique index if not exists design_documents_brand_filename_uidx
  on design_documents (brand_id, original_filename);

${docs.map(buildSqlForDoc).join("\n")}

-- Verification
select
  (select count(*) from brands where category = 'design-reference') as seeded_brands,
  (select count(*) from design_documents where source_type = 'markdown_seed') as seeded_documents,
  (select count(*) from design_sections) as total_sections,
  (select count(*) from design_tokens) as total_tokens;
`;

  fs.writeFileSync(outFile, sqlText, "utf8");

  for (const file of fs.readdirSync(chunkDir)) {
    if (file.endsWith(".sql")) fs.unlinkSync(path.join(chunkDir, file));
  }

  const chunkSize = 10;
  for (let index = 0; index < docs.length; index += chunkSize) {
    const chunk = docs.slice(index, index + chunkSize);
    const chunkNo = String(index / chunkSize + 1).padStart(2, "0");
    const chunkSql = `-- Generated seed chunk ${chunkNo}
-- Run 000_prepare.sql once before running these chunks.
-- Documents: ${chunk.length}

${chunk.map(buildSqlForDoc).join("\n")}
`;
    fs.writeFileSync(path.join(chunkDir, `${chunkNo}_seed_design_md.sql`), chunkSql, "utf8");
  }

  fs.writeFileSync(
    path.join(chunkDir, "000_prepare.sql"),
    `-- Run this once before the chunk files.
create extension if not exists pgcrypto;

alter table design_documents
  add column if not exists raw_markdown text;

create unique index if not exists design_documents_brand_filename_uidx
  on design_documents (brand_id, original_filename);
`,
    "utf8"
  );

  fs.writeFileSync(
    path.join(chunkDir, "999_verify.sql"),
    `select
  (select count(*) from brands where category = 'design-reference') as seeded_brands,
  (select count(*) from design_documents where source_type = 'markdown_seed') as seeded_documents,
  (select count(*) from design_sections) as total_sections,
  (select count(*) from design_tokens) as total_tokens;
`,
    "utf8"
  );

  console.log(JSON.stringify({
    output: path.relative(root, outFile),
    chunks: path.relative(root, chunkDir),
    documents: docs.length,
    sections: docs.reduce((sum, doc) => sum + doc.sections.length, 0),
    tokens: docs.reduce((sum, doc) => sum + doc.tokens.length, 0),
  }, null, 2));
}

main();
