const { neon } = require("@neondatabase/serverless");
const { getDatabaseUrl } = require("./_db");

const ALLOWED_TYPES = new Set(["design_prompt_markdown", "promo_input_markdown", "integrated_design_brief_markdown"]);

async function getPrivateBlob(urlOrPathname, options) {
  const { get } = await import("@vercel/blob");
  return get(urlOrPathname, options);
}

const defaultDependencies = {
  getDatabaseUrl,
  createSql: neon,
  getPrivateBlob,
};

function createHandler(overrides = {}) {
  const dependencies = { ...defaultDependencies, ...overrides };
  return async function handler(req, res) {
    if (req.method !== "GET") {
      res.setHeader("Allow", "GET");
      return res.status(405).json({ error: "Method not allowed" });
    }

    try {
      const promptGroupId = String(req.query.promptGroupId || req.query.prompt_group_id || "").trim();
      const runKey = String(req.query.runKey || req.query.id || "").trim();
      const assetType = String(req.query.type || "").trim();

      if (!promptGroupId && !runKey) {
        return res.status(400).json({ error: "promptGroupId or runKey is required" });
      }
      if (!ALLOWED_TYPES.has(assetType)) {
        return res.status(400).json({ error: "Invalid markdown asset type" });
      }

      const databaseUrl = dependencies.getDatabaseUrl();
      if (!databaseUrl) return res.status(500).json({ error: "DATABASE_URL is not configured" });

      const sql = dependencies.createSql(databaseUrl);
      const rows = await sql`
        select
          r.run_key,
          r.prompt_group_id,
          a.asset_type,
          a.asset_url,
          a.storage_key,
          a.mime_type,
          a.metadata
        from promo_design_runs r
        join promo_design_assets a on a.run_id = r.id
        where a.asset_type = ${assetType}
          and (
            (${promptGroupId} <> '' and (r.prompt_group_id = ${promptGroupId} or a.prompt_group_id = ${promptGroupId} or a.metadata->>'promptGroupId' = ${promptGroupId}))
            or
            (${runKey} <> '' and r.run_key = ${runKey})
          )
        order by a.created_at desc
        limit 1
      `;

      let asset = rows[0];
      let isIntegratedFallback = false;
      if (!hasBlobLocation(asset) && assetType === "integrated_design_brief_markdown") {
        const fallbackRows = await sql`
          select
            r.run_key,
            r.prompt_group_id,
            a.asset_type,
            a.asset_url,
            a.storage_key,
            a.mime_type,
            a.metadata
          from promo_design_runs r
          join promo_design_assets a on a.run_id = r.id
          where a.asset_type = 'design_prompt_markdown'
            and (
              (${promptGroupId} <> '' and (r.prompt_group_id = ${promptGroupId} or a.prompt_group_id = ${promptGroupId} or a.metadata->>'promptGroupId' = ${promptGroupId}))
              or
              (${runKey} <> '' and r.run_key = ${runKey})
            )
          order by a.created_at desc
          limit 1
        `;
        asset = fallbackRows[0];
        isIntegratedFallback = hasBlobLocation(asset);
      }

      const blobLocations = blobLocationsForAsset(asset);
      if (!blobLocations.length) {
        return res.status(404).json({ error: "Markdown asset not found", promptGroupId, runKey, assetType });
      }

      let blob;
      try {
        blob = await getFirstReadablePrivateBlob(blobLocations, dependencies.getPrivateBlob);
      } catch {
        return res.status(502).json({ error: "Failed to read markdown blob" });
      }
      if (!blob) return res.status(404).json({ error: "Markdown asset not found", promptGroupId, runKey, assetType });
      if (blob.statusCode !== 200 || !blob.stream) {
        return res.status(502).json({ error: "Failed to read markdown blob" });
      }

      const sourceMarkdown = await new Response(blob.stream).text();
      const markdown = isIntegratedFallback ? extractIntegratedDesignBrief(sourceMarkdown) : sourceMarkdown;
      if (isIntegratedFallback && !markdown) {
        return res.status(404).json({
          error: "Integrated design brief markdown not found in design prompt",
          promptGroupId,
          runKey,
        });
      }

      return res.status(200).json({
        ok: true,
        runKey: asset.run_key,
        promptGroupId: asset.prompt_group_id || asset.metadata?.promptGroupId || promptGroupId,
        assetType,
        storageKey: asset.storage_key,
        fallbackAssetType: isIntegratedFallback ? asset.asset_type : "",
        markdown,
      });
    } catch (error) {
      return res.status(500).json({
        error: "Promo design markdown API failed",
        message: error.message,
      });
    }
  };
}

function hasBlobLocation(asset) {
  return blobLocationsForAsset(asset).length > 0;
}

function blobLocationsForAsset(asset) {
  if (!asset) return [];
  return uniqueValues([
    asset.storage_key,
    asset.asset_url,
    asset.metadata?.downloadUrl,
    asset.metadata?.download_url,
    asset.metadata?.url,
  ]);
}

async function getFirstReadablePrivateBlob(locations, getBlob) {
  const options = {
    access: "private",
    ...(process.env.BLOB_READ_WRITE_TOKEN ? { token: process.env.BLOB_READ_WRITE_TOKEN } : {}),
  };
  let lastError = null;
  for (const location of locations) {
    try {
      const blob = await getBlob(location, options);
      if (blob) return blob;
    } catch (error) {
      lastError = error;
    }
  }
  if (lastError) throw lastError;
  return null;
}

function uniqueValues(values) {
  return Array.from(new Set(values.map((value) => String(value || "").trim()).filter(Boolean)));
}

const handler = createHandler();
handler.createHandler = createHandler;
module.exports = handler;

function extractIntegratedDesignBrief(markdown) {
  const source = String(markdown || "");
  const sectionMatch = source.match(/## Integrated Design Brief\s*\n([\s\S]*?)(?=\n## Integrated Design Brief JSON|\n## Layout Mapping|\n## MD Compliance Map|\n## [^\n]+|$)/);
  const extracted = sectionMatch?.[1]?.trim() || "";
  if (extracted && !/^_No integrated design brief markdown/i.test(extracted)) return extracted;

  const jsonMatch = source.match(/## Integrated Design Brief JSON\s*\n\s*```json\s*([\s\S]*?)```/);
  if (jsonMatch?.[1]) return jsonMatch[1].trim();

  return "";
}
