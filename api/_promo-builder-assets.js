const { createHash } = require("node:crypto");
const { createPromptExecutionSnapshot } = require("./_prompt-execution-snapshot");

const SECTION_DESIGN_ASSET_REQUEST_MODE = "assets";

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function sectionById(snapshot, pageSectionInstanceId) {
  return (snapshot?.content?.sectionSnapshot || []).find((section) => (
    (section.pageSectionInstanceId || section.sectionKey) === pageSectionInstanceId
  ));
}

function componentById(section, pageComponentInstanceId) {
  return (section?.items || []).find((item) => (
    (item.id || item.itemKey) === pageComponentInstanceId
  ));
}

function fieldByKey(component, fieldKey) {
  const fields = Array.isArray(component?.fields) && component.fields.length
    ? component.fields
    : [{ ...component, fieldKey: component?.sourceItemKey || component?.itemKey }];
  return fields.find((field) => field.fieldKey === fieldKey) || fields[0] || null;
}

function assetInputHash(value) {
  return createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

async function enqueueBuilderAssetJobs(sql, {
  documentId,
  documentRevision,
  snapshot,
}) {
  const jobs = [];
  for (const request of snapshot?.assets?.requests || []) {
    if (request.status !== "pending") continue;
    const section = sectionById(snapshot, request.pageSectionInstanceId);
    if (!section) continue;
    const sectionContent = snapshot.content.sectionInputs?.[request.pageSectionInstanceId] || {};
    const backgroundColor = String(
      snapshot.designSpec?.sectionStyles?.[request.pageSectionInstanceId]?.backgroundColor
      || snapshot.designSpec?.theme?.backgroundColor
      || "#000000",
    );
    const isComponent = request.targetType === "component-field-image";
    const component = isComponent
      ? componentById(section, request.pageComponentInstanceId)
      : null;
    const field = isComponent ? fieldByKey(component, request.fieldKey) : null;
    if (isComponent && (!component || !field || field.fieldKind !== "image")) continue;
    const promptType = isComponent ? "component_image" : "section_background_image";
    const promptVariables = isComponent ? {
      sectionName: section.name || section.sourceSectionKey || "Promotion section",
      componentName: component.name || component.sourceItemKey || "Visual",
      fieldName: field.name || field.fieldKey || "Visual",
      contentJson: JSON.stringify(sectionContent),
      adminGuidance: [field.image?.promptText, request.guidance].filter(Boolean).join("\n"),
    } : {
      sectionName: section.name || section.sourceSectionKey || "Promotion section",
      contentJson: JSON.stringify(sectionContent),
      backgroundColor,
      fadeMode: String(
        snapshot.designSpec?.sectionStyles?.[request.pageSectionInstanceId]?.backgroundFadeMode
        || "none",
      ),
      adminGuidance: [section.aiDesign?.backgroundPromptText, request.guidance].filter(Boolean).join("\n"),
      aspectRatio: String(section.aiDesign?.imageAspectRatio || "16:9"),
    };
    const promptSnapshot = await createPromptExecutionSnapshot(sql, promptType, promptVariables);
    const targetType = isComponent ? "item" : "section-background";
    const targetItemKey = isComponent ? request.pageComponentInstanceId : null;
    const inputSnapshot = {
      section: {
        sectionKey: request.pageSectionInstanceId,
        sourceSectionId: section.sourceSectionId,
        sourceSectionKey: section.sourceSectionKey,
        name: section.name,
      },
      content: sectionContent,
      design: {
        backgroundColor,
        keyVisualTextPolicy: "derived-only",
      },
      builder: {
        documentId,
        documentRevision,
        assetRequestId: request.assetRequestId,
      },
    };
    const inputHash = assetInputHash({ inputSnapshot, promptHash: promptSnapshot.promptConfig.renderedPromptHash });
    const executionKey = `builder-asset:${documentId}:${request.assetRequestId}`;
    const runRows = await sql`
      insert into promo_section_design_runs (
        form_template_id, template_key_snapshot, template_version, layout_revision,
        section_key, status, input_snapshot, input_hash, execution_key,
        hash_contract_version, prompt_snapshot, token_values_hash,
        constraints_snapshot, request_mode, component_versions_snapshot,
        token_set_version_id, base_revision, layout_result,
        builder_document_id, builder_document_revision,
        page_section_instance_id, page_component_instance_id,
        builder_asset_request_id
      ) values (
        ${snapshot.compositionMeta.sourceTemplateId}::uuid,
        ${snapshot.content.formTemplate.templateKey || ""},
        ${snapshot.compositionMeta.sourceTemplateVersion || 1},
        ${Math.max(1, Number(snapshot.layoutRevision || 1))},
        ${request.pageSectionInstanceId},
        'generating_assets',
        ${JSON.stringify(inputSnapshot)}::jsonb,
        ${inputHash},
        ${executionKey},
        2,
        ${JSON.stringify(promptSnapshot)}::jsonb,
        ${assetInputHash(snapshot.content.formTemplate.designTokens?.values || {})},
        ${JSON.stringify({
          imageAspectRatio: isComponent
            ? field.image?.aspectRatio || "1:1"
            : section.aiDesign?.imageAspectRatio || "16:9",
          imageTarget: {
            type: targetType,
            itemKey: targetItemKey,
            fieldKey: request.fieldKey || null,
          },
        })}::jsonb,
        ${SECTION_DESIGN_ASSET_REQUEST_MODE},
        ${JSON.stringify([component?.componentVersionId].filter(Boolean))}::jsonb,
        ${snapshot.appearance?.designTokenSetVersionId || null}::uuid,
        ${JSON.stringify({ documentRevision })}::jsonb,
        ${JSON.stringify({
          imageRequest: {
            prompt: promptSnapshot.promptConfig.renderedPrompt,
            safeArea: "none",
            aspectRatio: isComponent
              ? field.image?.aspectRatio || "1:1"
              : section.aiDesign?.imageAspectRatio || "16:9",
            target: {
              type: targetType,
              sectionKey: request.pageSectionInstanceId,
              itemKey: targetItemKey,
              fieldKey: request.fieldKey || null,
            },
          },
        })}::jsonb,
        ${documentId}::uuid,
        ${documentRevision},
        ${request.pageSectionInstanceId},
        ${request.pageComponentInstanceId || null},
        ${request.assetRequestId}
      )
      on conflict (
        builder_document_id, builder_asset_request_id
      ) where builder_document_id is not null
        and builder_asset_request_id is not null
      do update set updated_at = promo_section_design_runs.updated_at
      returning id::text
    `;
    const runId = runRows[0].id;
    const requestSnapshot = {
      prompt: promptSnapshot.promptConfig.renderedPrompt,
      promptConfig: promptSnapshot.promptConfig,
      safeArea: "none",
      aspectRatio: isComponent
        ? field.image?.aspectRatio || "1:1"
        : section.aiDesign?.imageAspectRatio || "16:9",
      sourceGeometry: null,
      effectiveGeometry: null,
      keyVisualTextPolicy: isComponent ? "none" : "derived-only",
    };
    const existingJobs = await sql`
      select id::text, status
      from promo_section_design_asset_jobs
      where run_id = ${runId}::uuid
      limit 1
    `;
    let job = existingJobs[0];
    if (!job) {
      const jobRows = await sql`
        insert into promo_section_design_asset_jobs (
          run_id, target_type, target_item_key, request_snapshot,
          target_field_key
        ) values (
          ${runId}::uuid,
          ${targetType},
          ${targetItemKey},
          ${JSON.stringify(requestSnapshot)}::jsonb,
          ${request.fieldKey || null}
        )
        returning id::text, status
      `;
      job = jobRows[0];
    }
    jobs.push({
      id: job.id,
      runId,
      assetRequestId: request.assetRequestId,
      targetType: request.targetType,
      pageSectionInstanceId: request.pageSectionInstanceId,
      pageComponentInstanceId: request.pageComponentInstanceId || null,
      fieldKey: request.fieldKey || null,
      status: job.status,
    });
  }
  return jobs;
}

function builderBaseUrl() {
  const configured = String(process.env.PROMO_PUBLIC_BASE_URL || "").trim();
  if (configured) return configured.replace(/\/+$/, "");
  const host = String(
    process.env.VERCEL_PROJECT_PRODUCTION_URL
    || process.env.VERCEL_URL
    || "",
  ).trim();
  return host ? `https://${host.replace(/^https?:\/\//, "").replace(/\/+$/, "")}` : "";
}

function scheduleBuilderAssetJobs(jobs) {
  const baseUrl = builderBaseUrl();
  if (!baseUrl || !jobs.length) return false;
  const work = Promise.allSettled(jobs.map((job) => fetch(
    `${baseUrl}/api/promo-section-design-asset-process`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobId: job.id }),
    },
  )));
  try {
    const { waitUntil } = require("@vercel/functions");
    waitUntil(work);
  } catch {
    work.catch(() => {});
  }
  return true;
}

async function enqueueAndScheduleBuilderAssetJobs(sql, options, dependencies = {}) {
  const enqueue = dependencies.enqueue || enqueueBuilderAssetJobs;
  const schedule = dependencies.schedule || scheduleBuilderAssetJobs;
  const reportError = dependencies.reportError || console.error;
  try {
    const assetJobs = await enqueue(sql, options);
    schedule(assetJobs);
    return { assetJobs, assetWarning: null };
  } catch (error) {
    reportError("Builder composition applied but asset enqueue failed", {
      code: error.code || null,
      message: error.message,
      documentId: options?.documentId || null,
      documentRevision: options?.documentRevision || null,
    });
    return {
      assetJobs: [],
      assetWarning: {
        code: "ASSET_ENQUEUE_FAILED",
        detailCode: error.code || null,
        message: "프로모션 구성은 적용되었지만 이미지 생성을 시작하지 못했습니다. 이미지 생성을 다시 요청해 주세요.",
      },
    };
  }
}

async function hydrateBuilderAssetResults(sql, documentId, snapshot) {
  if (!snapshot?.assets?.requests?.length) return snapshot;
  const requestIds = snapshot.assets.requests.map((request) => request.assetRequestId);
  const rows = await sql`
    select run.builder_asset_request_id, run.page_section_instance_id,
      run.page_component_instance_id, job.target_field_key,
      job.status, job.result_snapshot, job.error_code, job.error_message
    from promo_section_design_runs run
    join promo_section_design_asset_jobs job on job.run_id = run.id
    where run.builder_document_id = ${documentId}::uuid
      and run.builder_asset_request_id = any(${requestIds}::text[])
  `;
  if (!rows.length) return snapshot;
  const next = clone(snapshot);
  const resultByRequest = new Map(rows.map((row) => [row.builder_asset_request_id, row]));
  next.assets.requests = next.assets.requests.map((request) => {
    const result = resultByRequest.get(request.assetRequestId);
    if (!result) return request;
    const updated = {
      ...request,
      status: result.status,
      errorCode: result.error_code || "",
      errorMessage: result.error_message || "",
    };
    if (result.status !== "ready" || !result.result_snapshot?.proxyUrl) return updated;
    const url = result.result_snapshot.proxyUrl;
    next.assets.items[request.assetRequestId] = result.result_snapshot;
    if (request.targetType === "section-key-visual"
      && sectionById(next, request.pageSectionInstanceId)) {
      next.designSpec.sectionStyles[request.pageSectionInstanceId] = {
        ...(next.designSpec.sectionStyles[request.pageSectionInstanceId] || {}),
        backgroundImage: url,
      };
    }
    if (request.targetType === "component-field-image") {
      const section = sectionById(next, request.pageSectionInstanceId);
      const component = componentById(section, request.pageComponentInstanceId);
      if (section && component) {
        const current = next.content.sectionInputs[request.pageSectionInstanceId]?.[request.pageComponentInstanceId];
        const imageValue = { source: "ai", value: url, description: "", alt: "" };
        if (Array.isArray(component.fields) && component.fields.length > 1) {
          next.content.sectionInputs[request.pageSectionInstanceId][request.pageComponentInstanceId] = {
            ...(current || {}),
            fields: { ...(current?.fields || {}), [request.fieldKey]: imageValue },
          };
        } else {
          next.content.sectionInputs[request.pageSectionInstanceId][request.pageComponentInstanceId] = imageValue;
        }
      }
    }
    return updated;
  });
  return next;
}

module.exports = {
  SECTION_DESIGN_ASSET_REQUEST_MODE,
  enqueueBuilderAssetJobs,
  enqueueAndScheduleBuilderAssetJobs,
  scheduleBuilderAssetJobs,
  hydrateBuilderAssetResults,
};
