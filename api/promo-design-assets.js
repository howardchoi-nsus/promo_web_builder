const { neon } = require("@neondatabase/serverless");
const { getDatabaseUrl } = require("./_db");
const {
  buildDesignPromptMarkdown,
  buildPromoInputMarkdown,
  formatTimestamp,
} = require("./_promo-markdown-builders");

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
  const promptGroupId = String(req.query.promptGroupId || req.query.prompt_group_id || "").trim();
  if (!runKey && !promptGroupId) return res.status(400).json({ error: "runKey or promptGroupId is required" });

  const sql = neon(databaseUrl);
  if (promptGroupId) {
    const rows = await sql`
      select
        r.id::text as run_id,
        r.run_key,
        r.prompt_group_id,
        r.promo_title,
        r.status,
        r.result_type,
        r.image_prompt,
        r.layout_mapping,
        r.md_compliance_map,
        r.created_at,
        a.id::text as asset_id,
        a.asset_type,
        a.asset_url,
        a.thumbnail_url,
        a.mime_type,
        a.width,
        a.height,
        a.file_size,
        a.storage_provider,
        a.storage_key,
        a.metadata,
        a.is_primary,
        a.created_at as asset_created_at
      from promo_design_runs r
      left join promo_design_assets a on a.run_id = r.id
        and (a.prompt_group_id = ${promptGroupId} or a.metadata->>'promptGroupId' = ${promptGroupId})
      where r.prompt_group_id = ${promptGroupId}
         or exists (
           select 1
           from promo_design_assets matching_asset
           where matching_asset.run_id = r.id
             and (
               matching_asset.prompt_group_id = ${promptGroupId}
               or matching_asset.metadata->>'promptGroupId' = ${promptGroupId}
             )
         )
      order by a.is_primary desc, a.created_at asc
    `;

    if (!rows.length) return res.status(404).json({ error: "Design asset group not found", promptGroupId });

    const first = rows[0];
    return res.status(200).json({
      ok: true,
      promptGroupId,
      run: {
        run_id: first.run_id,
        run_key: first.run_key,
        prompt_group_id: first.prompt_group_id,
        promo_title: first.promo_title,
        status: first.status,
        result_type: first.result_type,
        image_prompt: first.image_prompt,
        layout_mapping: first.layout_mapping,
        md_compliance_map: first.md_compliance_map,
        created_at: first.created_at,
      },
      assets: rows
        .filter((row) => row.asset_id)
        .map((row) => ({
          asset_id: row.asset_id,
          asset_type: row.asset_type,
          asset_url: row.asset_url,
          thumbnail_url: row.thumbnail_url,
          mime_type: row.mime_type,
          width: row.width,
          height: row.height,
          file_size: row.file_size,
          storage_provider: row.storage_provider,
          storage_key: row.storage_key,
          metadata: row.metadata,
          is_primary: row.is_primary,
          created_at: row.asset_created_at,
        })),
    });
  }

  const rows = await sql`
    select
      r.id::text as run_id,
      r.run_key,
      r.prompt_group_id,
      r.promo_title,
      r.status,
      r.result_type,
      r.image_prompt,
      r.layout_mapping,
      r.md_compliance_map,
      r.created_at,
      a.id::text as asset_id,
      a.prompt_group_id as asset_prompt_group_id,
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

  const run = rows[0];
  const assetRows = await sql`
    select
      a.id::text as asset_id,
      a.asset_type,
      a.asset_url,
      a.thumbnail_url,
      a.mime_type,
      a.width,
      a.height,
      a.file_size,
      a.storage_provider,
      a.storage_key,
      a.metadata,
      a.is_primary,
      a.created_at as asset_created_at
    from promo_design_assets a
    where a.run_id = ${run.run_id}::uuid
      and (
        a.asset_type = 'generated_image'
        or a.prompt_group_id = ${run.prompt_group_id || ""}
        or a.metadata->>'promptGroupId' = ${run.prompt_group_id || ""}
      )
    order by a.is_primary desc, a.created_at desc
  `;

  return res.status(200).json({
    ok: true,
    run,
    assets: assetRows.map((row) => ({
      asset_id: row.asset_id,
      asset_type: row.asset_type,
      asset_url: row.asset_url,
      thumbnail_url: row.thumbnail_url,
      mime_type: row.mime_type,
      width: row.width,
      height: row.height,
      file_size: row.file_size,
      storage_provider: row.storage_provider,
      storage_key: row.storage_key,
      metadata: row.metadata,
      is_primary: row.is_primary,
      created_at: row.asset_created_at,
    })),
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
  const generatedAt = new Date();
  const storageKey = `promo-designs/${runKey}/${generatedAt.getTime()}.${extensionForMime(imageInput.mimeType)}`;
  const blobAccess = String(process.env.BLOB_ACCESS || "private").toLowerCase() === "public" ? "public" : "private";
  const blob = await put(storageKey, imageInput.bytes, {
    access: blobAccess,
    contentType: imageInput.mimeType,
  });

  const payload = body.payload || {};
  const promo = payload.promo || body.promo || {};
  const md = payload.md || body.md || {};
  const template = payload.template || body.template || {};
  const fileStamp = formatTimestamp(generatedAt);
  const promptGroupId = uniqueToken();
  const designPromptMarkdown = buildDesignPromptMarkdown({
    runKey,
    promptGroupId,
    generatedAt,
    payload,
  });
  const promoInputMarkdown = buildPromoInputMarkdown({
    runKey,
    promptGroupId,
    generatedAt,
    payload,
    promo,
    md,
    template,
  });
  const integratedDesignBriefMarkdown = String(body.integratedDesignBriefMarkdown || "").trim();
  const designPromptFileName = `design prompt -${promptGroupId}-${fileStamp}.md`;
  const promoInputFileName = `promo input -${promptGroupId}-${fileStamp}.md`;
  const integratedBriefFileName = `integrated design brief -${promptGroupId}-${fileStamp}.md`;
  const designPromptKey = `data/Design/${designPromptFileName}`;
  const promoInputKey = `data/Promo/${promoInputFileName}`;
  const integratedBriefKey = `data/Design/${integratedBriefFileName}`;
  const designPromptBlob = await uploadTextAsset(put, designPromptKey, designPromptMarkdown, blobAccess);
  const promoInputBlob = await uploadTextAsset(put, promoInputKey, promoInputMarkdown, blobAccess);
  const integratedBriefBlob = integratedDesignBriefMarkdown
    ? await uploadTextAsset(put, integratedBriefKey, integratedDesignBriefMarkdown, blobAccess)
    : null;

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
      prompt_group_id,
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
      ${promptGroupId},
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
      prompt_group_id = excluded.prompt_group_id,
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
      prompt_group_id,
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
      ${promptGroupId},
      ${JSON.stringify({ access: blobAccess, pathname: blob.pathname, promptGroupId, uploadedAt: generatedAt.toISOString() })}::jsonb,
      true
    )
    returning id::text
  `;

  const designPromptAssetRows = await sql`
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
      prompt_group_id,
      metadata,
      is_primary
    )
    values (
      ${runId}::uuid,
      'design_prompt_markdown',
      ${designPromptBlob.url},
      '',
      'vercel_blob',
      ${designPromptKey},
      '',
      'text/markdown; charset=utf-8',
      ${textByteLength(designPromptMarkdown)},
      ${promptGroupId},
      ${JSON.stringify({ access: blobAccess, pathname: designPromptBlob.pathname, fileName: designPromptFileName, promptGroupId, uploadedAt: generatedAt.toISOString() })}::jsonb,
      false
    )
    returning id::text
  `;

  const promoInputAssetRows = await sql`
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
      prompt_group_id,
      metadata,
      is_primary
    )
    values (
      ${runId}::uuid,
      'promo_input_markdown',
      ${promoInputBlob.url},
      '',
      'vercel_blob',
      ${promoInputKey},
      '',
      'text/markdown; charset=utf-8',
      ${textByteLength(promoInputMarkdown)},
      ${promptGroupId},
      ${JSON.stringify({ access: blobAccess, pathname: promoInputBlob.pathname, fileName: promoInputFileName, promptGroupId, uploadedAt: generatedAt.toISOString() })}::jsonb,
      false
    )
    returning id::text
  `;

  const integratedBriefAssetRows = integratedBriefBlob
    ? await sql`
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
        prompt_group_id,
        metadata,
        is_primary
      )
      values (
        ${runId}::uuid,
        'integrated_design_brief_markdown',
        ${integratedBriefBlob.url},
        '',
        'vercel_blob',
        ${integratedBriefKey},
        '',
        'text/markdown; charset=utf-8',
        ${textByteLength(integratedDesignBriefMarkdown)},
        ${promptGroupId},
        ${JSON.stringify({ access: blobAccess, pathname: integratedBriefBlob.pathname, fileName: integratedBriefFileName, promptGroupId, uploadedAt: generatedAt.toISOString() })}::jsonb,
        false
      )
      returning id::text
    `
    : [];

  const origin = getOrigin(req);
  const imageProxyUrl = `${origin}/api/promo-design-image?id=${encodeURIComponent(runKey)}`;
  return res.status(200).json({
    ok: true,
    runId,
    assetId: assetRows[0].id,
    runKey,
    promptGroupId,
    assetUrl: blob.url,
    designPromptAssetId: designPromptAssetRows[0].id,
    designPromptAssetUrl: designPromptBlob.url,
    designPromptStorageKey: designPromptKey,
    promoInputAssetId: promoInputAssetRows[0].id,
    promoInputAssetUrl: promoInputBlob.url,
    promoInputStorageKey: promoInputKey,
    integratedBriefAssetId: integratedBriefAssetRows[0]?.id || "",
    integratedBriefAssetUrl: integratedBriefBlob?.url || "",
    integratedBriefStorageKey: integratedBriefBlob ? integratedBriefKey : "",
    committedAt: generatedAt.toISOString(),
    timestampStamp: fileStamp,
    imageUrl: imageProxyUrl,
    designUrl: `${origin}/api/promo-design-view?id=${encodeURIComponent(runKey)}`,
  });
}

async function uploadTextAsset(put, storageKey, markdown, access) {
  return put(storageKey, Buffer.from(markdown, "utf8"), {
    access,
    contentType: "text/markdown; charset=utf-8",
  });
}

function textByteLength(value) {
  return Buffer.byteLength(String(value || ""), "utf8");
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

function uniqueToken() {
  const alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  for (let attempt = 0; attempt < 20; attempt += 1) {
    let value = "";
    for (let index = 0; index < 5; index += 1) {
      value += alphabet[Math.floor(Math.random() * alphabet.length)];
    }
    if (/[0-9]/.test(value) && /[A-Za-z]/.test(value)) return value;
  }
  return `A${Math.floor(1000 + Math.random() * 9000)}`;
}

function getOrigin(req) {
  const proto = req.headers["x-forwarded-proto"] || "https";
  const host = req.headers["x-forwarded-host"] || req.headers.host || "promo-web-builder.vercel.app";
  return `${proto}://${host}`;
}

function hintForError(error) {
  const message = String(error?.message || "");
  if (/promo_design_runs|promo_design_assets|does not exist/i.test(message)) {
    return "Apply db/migrations/004_promo_design_image_storage.sql and 005_promo_design_prompt_group_id.sql to the target database.";
  }
  if (/prompt_group_id/i.test(message)) {
    return "Apply db/migrations/005_promo_design_prompt_group_id.sql to the target database.";
  }
  if (/BLOB_READ_WRITE_TOKEN|blob/i.test(message)) {
    return "Check BLOB_READ_WRITE_TOKEN in Vercel environment variables.";
  }
  if (/DATABASE_URL|database/i.test(message)) {
    return "Check DATABASE_URL or NEON_DATABASE_URL in Vercel environment variables.";
  }
  return "";
}
