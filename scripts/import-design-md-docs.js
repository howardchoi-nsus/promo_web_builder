const fs = require("fs");
const path = require("path");
const { getDatabaseUrl } = require("../api/_db");
const { extractDesignMdData, persistDesignMdData, markExtractionFailed } = require("../api/_design-md-data");

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9.]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function walkDesignFiles(rootDir) {
  if (!fs.existsSync(rootDir)) return [];
  return fs.readdirSync(rootDir, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(rootDir, entry.name);
    if (entry.isDirectory()) return walkDesignFiles(entryPath);
    return /^DESIGN\.md$/i.test(entry.name) ? [entryPath] : [];
  });
}

function brandNameFromFile(filePath, markdown, rootDir) {
  const title = String(markdown || "").match(/^#\s+Design System Inspired by\s+(.+?)\s*$/im);
  if (title?.[1]) return title[1].trim();
  const relative = path.relative(rootDir, path.dirname(filePath));
  return relative.split(path.sep).filter(Boolean).pop() || "Untitled Brand";
}

function countUnknown(value) {
  if (value === "unknown") return { unknown: 1, total: 1 };
  if (Array.isArray(value)) {
    return value.reduce(
      (acc, item) => {
        const next = countUnknown(item);
        return { unknown: acc.unknown + next.unknown, total: acc.total + next.total };
      },
      { unknown: 0, total: 0 }
    );
  }
  if (value && typeof value === "object") {
    return Object.values(value).reduce(
      (acc, item) => {
        const next = countUnknown(item);
        return { unknown: acc.unknown + next.unknown, total: acc.total + next.total };
      },
      { unknown: 0, total: 0 }
    );
  }
  return { unknown: 0, total: 1 };
}

function summarizeExtraction(filePath, markdown, extracted) {
  const unknownStats = countUnknown(extracted.normalizedSchema);
  const classification = extracted.styleClassificationJson || {};
  return {
    file: filePath.replace(/\\/g, "/"),
    sourceHash: extracted.sourceHash,
    tokens: extracted.tokenItems.length,
    metadata: extracted.metadataItems.length,
    components: extracted.componentPatterns.length,
    layouts: extracted.layoutPatterns.length,
    guidelines: extracted.guidelineItems.length,
    unknown: unknownStats.unknown,
    unknownTotal: unknownStats.total,
    unknownRate: unknownStats.total ? Number((unknownStats.unknown / unknownStats.total).toFixed(3)) : 0,
    group: classification.primaryGroup?.slug || "unknown",
    colorMode: classification.colorMode || "unknown",
    depthModel: classification.depthModel || "unknown",
    shapeModel: classification.shapeModel || "unknown",
    typographyTone: classification.typographyTone || "unknown",
    warnings: extracted.warnings || [],
  };
}

async function upsertDocument(sql, item) {
  const rows = await sql`
    with b as (
      insert into brands (name, slug, category, website_url, updated_at)
      values (${item.brandName}, ${item.slug}, 'design-reference', null, now())
      on conflict (slug) do update
        set name = excluded.name,
            category = excluded.category,
            updated_at = now()
      returning id, name, slug
    ),
    d as (
      insert into design_documents (
        brand_id,
        source_type,
        original_filename,
        original_blob_url,
        status,
        raw_markdown,
        extraction_status,
        updated_at
      )
      select id, 'markdown_seed', ${item.sourceName}, null, 'extracting', ${item.markdown}, 'extracting', now()
      from b
      on conflict (brand_id, original_filename) do update
        set status = 'extracting',
            raw_markdown = excluded.raw_markdown,
            extraction_status = 'extracting',
            extraction_error = null,
            archived_at = null,
            updated_at = now()
      returning id, brand_id, original_filename, status, raw_markdown, updated_at
    )
    select d.id::text as id, b.name as brand_name, b.slug, d.original_filename
    from d
    join b on b.id = d.brand_id
  `;
  return rows[0];
}

async function main() {
  const args = new Set(process.argv.slice(2));
  const apply = args.has("--apply");
  const rootArg = Array.from(args).find((arg) => arg.startsWith("--root="));
  const rootDir = path.resolve(process.cwd(), rootArg ? rootArg.slice("--root=".length) : "docs/design-md");
  const files = walkDesignFiles(rootDir).sort((a, b) => a.localeCompare(b));

  const items = files.map((file) => {
    const markdown = fs.readFileSync(file, "utf8");
    const brandName = brandNameFromFile(file, markdown, rootDir);
    const slug = slugify(path.basename(path.dirname(file)) || brandName);
    const extracted = extractDesignMdData({ markdown, brandName, sourceName: path.relative(rootDir, file) });
    return {
      file,
      brandName,
      slug,
      sourceName: path.relative(process.cwd(), file).replace(/\\/g, "/"),
      markdown,
      extracted,
      summary: summarizeExtraction(file, markdown, extracted),
    };
  });

  const aggregate = items.reduce(
    (acc, item) => {
      acc.tokens += item.summary.tokens;
      acc.metadata += item.summary.metadata;
      acc.components += item.summary.components;
      acc.layouts += item.summary.layouts;
      acc.guidelines += item.summary.guidelines;
      acc.unknown += item.summary.unknown;
      acc.unknownTotal += item.summary.unknownTotal;
      acc.groups[item.summary.group] = (acc.groups[item.summary.group] || 0) + 1;
      return acc;
    },
    { tokens: 0, metadata: 0, components: 0, layouts: 0, guidelines: 0, unknown: 0, unknownTotal: 0, groups: {} }
  );

  const report = {
    mode: apply ? "apply" : "dry-run",
    rootDir,
    fileCount: items.length,
    aggregate: {
      ...aggregate,
      unknownRate: aggregate.unknownTotal ? Number((aggregate.unknown / aggregate.unknownTotal).toFixed(3)) : 0,
    },
    samples: items.slice(0, 8).map((item) => item.summary),
  };

  if (!apply) {
    console.log(JSON.stringify(report, null, 2));
    return;
  }

  const databaseUrl = getDatabaseUrl();
  if (!databaseUrl) throw new Error("DATABASE_URL is not configured");
  const { neon } = require("@neondatabase/serverless");
  const sql = neon(databaseUrl);
  let ok = 0;
  const failed = [];

  for (const item of items) {
    let doc = null;
    try {
      doc = await upsertDocument(sql, item);
      await persistDesignMdData(sql, doc.id, item.extracted);
      ok += 1;
      console.log(`[ok] ${item.slug} ${doc.id}`);
    } catch (error) {
      failed.push({ file: item.summary.file, error: error.message || String(error) });
      if (doc?.id) await markExtractionFailed(sql, doc.id, error);
      console.error(`[failed] ${item.summary.file}: ${error.message || error}`);
    }
  }

  console.log(JSON.stringify({ ...report, applied: ok, failed }, null, 2));
}

main().catch((error) => {
  console.error(error.message || error);
  process.exitCode = 1;
});
