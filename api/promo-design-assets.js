const { neon } = require("@neondatabase/serverless");
const { getDatabaseUrl } = require("./_db");

const MAX_IMAGE_BYTES = 12 * 1024 * 1024;

module.exports = async function handler(req, res) {
  try {
    if (req.method === "GET") return await getAsset(req, res);
    if (req.method === "POST") return await saveAsset(req, res);

    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    return res.status(500).json({
      error: "Promo design asset API failed",
      message: error.message,
      hint: hintForError(error),
    });
  }
};

async function getAsset(req, res) {
  const databaseUrl = getDatabaseUrl();
  if (!databaseUrl) return res.status(500).json({ error: "DATABASE_URL is not configured" });

  const runKey = String(req.query.runKey || req.query.id || "").trim();
  if (!runKey) return res.status(400).json({ error: "runKey is required" });

  const sql = neon(databaseUrl);
  const rows = await sql`
    select
      r.id::text as run_id,
      r.run_key,
      r.promo_title,
      r.status,
      r.result_type,
      r.image_prompt,
      r.layout_mapping,
      r.md_compliance_map,
      r.created_at,
      a.id::text as asset_id,
      a.asset_url,
      a.thumbnail_url,
      a.mime_type,
      a.width,
      a.height,
      a.file_size,
      a.storage_provider,
      a.storage_key,
      a.created_at as asset_created_at
    from promo_design_runs r
    left join promo_design_assets a on a.run_id = r.id and a.is_primary = true
    where r.run_key = ${runKey}
    limit 1
  `;

  if (!rows.length) return res.status(404).json({ error: "Design asset not found", runKey });

  return res.status(200).json({
    ok: true,
    run: rows[0],
  });
}

async function saveAsset(req, res) {
  const databaseUrl = getDatabaseUrl();
  if (!databaseUrl) return res.status(500).json({ error: "DATABASE_URL is not configured" });

  const body = parseBody(req.body);
  const runKey = String(body.runKey || body.id || body.payload?.id || "").trim();
  if (!runKey) return res.status(400).json({ error: "runKey is required" });

  const imageInput = await resolveImageInput(body);
  if (!imageInput) {
    return res.status(400).json({ error: "imageUrl or imageDataUrl is required" });
  }

  if (imageInput.bytes.length > MAX_IMAGE_BYTES) {
    return res.status(413).json({ error: "Image is too large", maxBytes: MAX_IMAGE_BYTES });
  }

  const { put } = await import("@vercel/blob");
  const storageKey = `promo-designs/${runKey}/${Date.now()}.${extensionForMime(imageInput.mimeType)}`;
  const blob = await put(storageKey, imageInput.bytes, {
    access: "public",
    contentType: imageInput.mimeType,
  });

  const payload = body.payload || {};
  const promo = payload.promo || body.promo || {};
  const md = payload.md || body.md || {};
  const template = payload.template || body.template || {};

  const sql = neon(databaseUrl);
  const runRows = await sql`
    insert into promo_design_runs (
      run_key,
      promo_title,
      market,
      selected_md_id,
      selected_md_name,
      style_source,
      style_source_label,
      template_id,
      template_name,
      generation_mode,
      input_mode,
      status,
      result_type,
      request_payload,
      simple_brief,
      section_inputs,
      design_tokens,
      source_design_tokens,
      image_prompt,
      layout_mapping,
      md_compliance_map,
      updated_at
    )
    values (
      ${runKey},
      ${promo.title || body.promoTitle || ""},
      ${promo.market || body.market || ""},
      ${md.id || body.selectedMdId || ""},
      ${md.brand || body.selectedMdName || ""},
      ${payload.styleSource || body.styleSource || ""},
      ${payload.styleSourceLabel || body.styleSourceLabel || ""},
      ${template.id || body.templateId || ""},
      ${template.name || body.templateName || ""},
      ${template.generationMode || body.generationMode || ""},
      ${template.inputMode || body.inputMode || ""},
      ${body.status || "generated"},
      ${body.resultType || "image"},
      ${JSON.stringify(payload || {})}::jsonb,
      ${JSON.stringify(payload.simpleBrief || body.simpleBrief || {})}::jsonb,
      ${JSON.stringify(payload.sectionInputs || body.sectionInputs || {})}::jsonb,
      ${JSON.stringify(payload.design || body.designTokens || {})}::jsonb,
      ${JSON.stringify(payload.sourceDesign || body.sourceDesignTokens || {})}::jsonb,
      ${body.imagePrompt || ""},
      ${JSON.stringify(body.layoutMapping || {})}::jsonb,
      ${JSON.stringify(body.mdComplianceMap || {})}::jsonb,
      now()
    )
    on conflict (run_key) do update set
      promo_title = excluded.promo_title,
      market = excluded.market,
      selected_md_id = excluded.selected_md_id,
      selected_md_name = excluded.selected_md_name,
      style_source = excluded.style_source,
      style_source_label = excluded.style_source_label,
      template_id = excluded.template_id,
      template_name = excluded.template_name,
      generation_mode = excluded.generation_mode,
      input_mode = excluded.input_mode,
      status = excluded.status,
      result_type = excluded.result_type,
      request_payload = excluded.request_payload,
      simple_brief = excluded.simple_brief,
      section_inputs = excluded.section_inputs,
      design_tokens = excluded.design_tokens,
      source_design_tokens = excluded.source_design_tokens,
      image_prompt = excluded.image_prompt,
      layout_mapping = excluded.layout_mapping,
      md_compliance_map = excluded.md_compliance_map,
      updated_at = now()
    returning id::text
  `;

  const runId = runRows[0].id;
  await sql`update promo_design_assets set is_primary = false where run_id = ${runId}::uuid and is_primary = true`;

  const assetRows = await sql`
    insert into promo_design_assets (
      run_id,
      asset_type,
      asset_url,
      thumbnail_url,
      storage_provider,
      storage_key,
      source_url,
      mime_type,
      file_size,
      metadata,
      is_primary
    )
    values (
      ${runId}::uuid,
      'generated_image',
      ${blob.url},
      '',
      'vercel_blob',
      ${storageKey},
      ${imageInput.sourceUrl || ""},
      ${imageInput.mimeType},
      ${imageInput.bytes.length},
      ${JSON.stringify({ pathname: blob.pathname, uploadedAt: new Date().toISOString() })}::jsonb,
      true
    )
    returning id::text
  `;

  const origin = getOrigin(req);
  return res.status(200).json({
    ok: true,
    runId,
    assetId: assetRows[0].id,
    runKey,
    assetUrl: blob.url,
    imageUrl: blob.url,
    designUrl: `${origin}/api/promo-design-view?id=${encodeURIComponent(runKey)}`,
  });
}

async function resolveImageInput(body) {
  const imageDataUrl = String(body.imageDataUrl || "").trim();
  if (imageDataUrl) {
    const match = /^data:([^;]+);base64,(.+)$/i.exec(imageDataUrl);
    if (!match) throw new Error("Invalid imageDataUrl");
    return {
      bytes: Buffer.from(match[2], "base64"),
      mimeType: match[1] || "image/png",
      sourceUrl: "",
    };
  }

  const imageUrl = String(body.imageUrl || "").trim();
  if (!imageUrl) return null;

  const response = await fetch(imageUrl);
  if (!response.ok) throw new Error(`Failed to fetch source image: ${response.status}`);
  const mimeType = response.headers.get("content-type") || "image/png";
  const bytes = Buffer.from(await response.arrayBuffer());
  return { bytes, mimeType, sourceUrl: imageUrl };
}

function parseBody(body) {
  if (!body) return {};
  if (typeof body === "string") {
    try {
      return JSON.parse(body);
    } catch {
      return {};
    }
  }
  if (typeof body === "object" && !Array.isArray(body)) return body;
  return {};
}

function extensionForMime(mimeType) {
  if (/jpe?g/i.test(mimeType)) return "jpg";
  if (/webp/i.test(mimeType)) return "webp";
  return "png";
}

function getOrigin(req) {
  const proto = req.headers["x-forwarded-proto"] || "https";
  const host = req.headers["x-forwarded-host"] || req.headers.host || "promo-web-builder.vercel.app";
  return `${proto}://${host}`;
}

function hintForError(error) {
  const message = String(error?.message || "");
  if (/promo_design_runs|promo_design_assets|does not exist/i.test(message)) {
    return "Apply db/migrations/004_promo_design_image_storage.sql to the target database.";
  }
  if (/BLOB_READ_WRITE_TOKEN|blob/i.test(message)) {
    return "Check BLOB_READ_WRITE_TOKEN in Vercel environment variables.";
  }
  if (/DATABASE_URL|database/i.test(message)) {
    return "Check DATABASE_URL or NEON_DATABASE_URL in Vercel environment variables.";
  }
  return "";
}
