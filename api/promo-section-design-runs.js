const { fetchTemplateWithItems, fetchLayoutRow, toLayout } = require("./_wizard-form-template-layout-store");
const { toFormTemplate } = require("./_wizard-form-templates-store");
const { getSql, parseBody, fetchRun, createRun, transitionRun } = require("./_promo-section-design-store");
const { fetchTokenVersion } = require("./_design-token-store");
const { createPromptExecutionSnapshot } = require("./_prompt-execution-snapshot");
const {
  backgroundSizeForFitMode,
  normalizeTargetGeometry,
  resolveEffectiveAspectRatio,
} = require("./_section-ai-control-plane");
const {
  inputHash, hasAnalyzableContent, analyzableSectionContent, defaultConstraints, normalizeBackgroundColor,
  resolveImageTarget,
} = require("./_promo-section-design-contract");
const {
  normalizeKeyVisualTextPolicy,
} = require("./_section-key-visual-contract");
const {
  buildSectionImagePromptVariables,
} = require("./_section-image-prompt-variables");

const HASH_CONTRACT_VERSION = 2;

function fadeModeToSafeArea(value) {
  if (value === "left") return "left-copy";
  if (value === "right") return "right-copy";
  if (value === "both") return "center-copy";
  return "none";
}

module.exports = async function handler(req, res) {
  try {
    res.setHeader("Cache-Control", "no-store");
    if (req.method === "GET") {
      const id = String(req.query.id || req.query.runId || "").trim();
      if (!id) return res.status(400).json({ error: "runId is required" });
      const run = await fetchRun(getSql(), id);
      return run ? res.status(200).json({ ok: true, run }) : res.status(404).json({ error: "Section design run not found" });
    }
    if (req.method !== "POST") {
      res.setHeader("Allow", "GET, POST");
      return res.status(405).json({ error: "Method not allowed" });
    }
    const body = parseBody(req.body);
    const formTemplateId = String(body.formTemplateId || "").trim();
    const sectionKey = String(body.sectionKey || "").trim();
    const sectionInputs = body.sectionInputs && typeof body.sectionInputs === "object" ? body.sectionInputs : {};
    const requestMode = ["full", "layout-style", "assets"].includes(body.requestMode) ? body.requestMode : "full";
    const generationRequestId = String(body.generationRequestId || "").trim().slice(0, 160);
    if (!formTemplateId || !sectionKey) return res.status(400).json({ error: "formTemplateId and sectionKey are required" });
    const sql = getSql();
    const templateData = await fetchTemplateWithItems(sql, formTemplateId);
    if (!templateData || templateData.template.status !== "active") return res.status(404).json({ error: "Active form template not found" });
    const section = templateData.sections.find((item) => item.sectionKey === sectionKey && item.isVisible !== false);
    if (!section) return res.status(404).json({ error: "Template section not found" });
    const aiContent = analyzableSectionContent(section, sectionInputs);
    if (!hasAnalyzableContent(aiContent)) return res.status(400).json({ error: "Section text or CTA content is required before AI generation" });
    const layout = toLayout(await fetchLayoutRow(sql, formTemplateId));
    const template = toFormTemplate(templateData.template);
    const designTokenSetVersionId = String(body.designTokenSetVersionId || "").trim();
    if (!designTokenSetVersionId) {
      return res.status(422).json({ error: "Select a design token before AI design generation" });
    }
    let constraints = defaultConstraints(section, layout.layoutSpec);
    if (!constraints.enabled) return res.status(403).json({ error: "AI design generation is disabled for this section" });
    if (!constraints.allowedLayoutVariants.length) return res.status(422).json({ error: "No AI layout variant is allowed for this section" });
    const targetItemKey = String(body.targetItemKey || "").trim();
    const targetFieldKey = String(body.targetFieldKey || "").trim();
    const targetType = String(body.targetType || "").trim();
    const targetResolution = requestMode === "assets"
      ? resolveImageTarget(constraints, sectionKey, targetItemKey, targetType)
      : { ok: true, constraints };
    if (!targetResolution.ok) {
      return res.status(422).json({
        error: targetType === "section-background"
          ? "Section background AI generation is not allowed for this section"
          : targetItemKey
          ? "Requested AI image Item is not allowed for this section"
          : "No valid AI image target is configured for this section",
      });
    }
    constraints = targetResolution.constraints;
    const targetItem = targetResolution.constraints.imageTarget?.type === "item"
      ? (section.items || []).find((item) => item.itemKey === targetResolution.constraints.imageTarget.itemKey)
      : null;
    const targetField = targetResolution.constraints.imageTarget?.type === "item" && targetFieldKey
      ? (targetItem?.fields || []).find((field) => field.fieldKey === targetFieldKey)
      : null;
    if (targetFieldKey && (
      !targetField
      || targetField.fieldKind !== "image"
      || !targetField.image?.allowedSources?.includes("ai")
      || targetField.isLocked
    )) {
      return res.status(422).json({ error: "Requested AI image component field is not allowed" });
    }
    if (targetResolution.constraints.imageTarget?.type === "item" && targetFieldKey) {
      constraints = {
        ...constraints,
        imageTarget: { ...constraints.imageTarget, fieldKey: targetFieldKey },
      };
    }
    const keyVisualTextPolicy = normalizeKeyVisualTextPolicy(
      {
        keyVisualTextMode: body.keyVisualTextMode,
        keyVisualText: body.keyVisualText,
      },
      aiContent,
      targetResolution.constraints.imageTarget?.type
    );
    const backgroundColor = normalizeBackgroundColor(
      body.backgroundColor,
      normalizeBackgroundColor(layout.layoutSpec?.theme?.backgroundColor)
    );
    const snapshot = {
      template: { id: template.id, templateKey: template.templateKey, version: template.version },
      layoutRevision: layout.layoutRevision,
      design: { backgroundColor, keyVisualTextPolicy },
      section: {
        sectionKey,
        name: section.name || section.sectionName || sectionKey,
        items: (section.items || []).map((item) => ({
          itemKey: item.itemKey, name: item.name, fieldKind: item.fieldKind,
          componentId: item.componentId, componentVersionId: item.componentVersionId,
          componentVersion: item.componentVersion, capabilities: item.capabilities, styleSlots: item.styleSlots,
          image: item.image || null, fields: Array.isArray(item.fields) ? item.fields : [],
          isLocked: item.isLocked, isVisibleInWizard: item.isVisibleInWizard,
        })),
        sectionInputs,
        aiContent,
      },
    };
    const tokenSet = await fetchTokenVersion(sql, designTokenSetVersionId);
    if (!tokenSet || tokenSet.status !== "active") {
      return res.status(422).json({ error: "Selected active design token set version was not found" });
    }
    const fadeMode = ["none", "left", "right", "both"].includes(body.fadeMode) ? body.fadeMode : "none";
    const imageGuidance = String(body.imageGuidance || "").trim().slice(0, 1800);
    const requestedSafeArea = ["left-copy", "right-copy", "center-copy", "none"].includes(body.safeArea)
      ? body.safeArea
      : fadeModeToSafeArea(fadeMode);
    const promptType = requestMode === "assets"
      ? (targetResolution.constraints.imageTarget?.type === "item" ? "component_image" : "section_background_image")
      : "section_layout_planner";
    const layoutSectionStyle = layout.layoutSpec?.sectionStyles?.[sectionKey] || {};
    const targetGeometry = normalizeTargetGeometry(body.targetGeometry, {
      width: Number(layout.layoutSpec?.responsive?.contentMaxWidth || 1280),
      height: Number(layoutSectionStyle.minHeight || 520),
      viewport: "desktop",
    });
    const promptVariables = promptType === "section_layout_planner" ? {
      sectionJson: JSON.stringify(snapshot.section),
      contentJson: JSON.stringify(aiContent),
      constraintsJson: JSON.stringify(constraints),
      tokenSetJson: JSON.stringify(tokenSet),
    } : buildSectionImagePromptVariables({
      promptType,
      section: {
        ...snapshot.section,
        aiDesign: section.aiDesign,
      },
      component: targetItem,
      field: targetField || targetItem,
      sectionContent: aiContent,
      designSpec: layout.layoutSpec,
      designTokenValues: tokenSet.values,
      request: { guidance: imageGuidance },
      backgroundColor,
      fadeMode,
      brandPalette: body.brandPalette,
      aspectRatio: String(constraints.imageAspectRatio || "16:9"),
    });
    const promptSnapshot = await createPromptExecutionSnapshot(sql, promptType, promptVariables);
    const generationPolicy = promptSnapshot.promptConfig.generationPolicy || {};
    const effectiveAspectRatio = requestMode === "assets"
      ? resolveEffectiveAspectRatio(
        generationPolicy,
        targetGeometry,
        targetField?.image?.aspectRatio || targetItem?.image?.aspectRatio || "",
        promptSnapshot.promptConfig.modelCapabilitySnapshot?.aspectRatios
      )
      : String(constraints.imageAspectRatio || "16:9");
    const renderPolicy = promptSnapshot.promptConfig.renderPolicy || {};
    const targetRenderPolicy = targetResolution.constraints.imageTarget?.type === "item"
      ? renderPolicy.componentImage || {}
      : renderPolicy.sectionBackground || {};
    const allowedFitModes = Array.isArray(targetRenderPolicy.allowedFitModes)
      ? targetRenderPolicy.allowedFitModes
      : ["cover"];
    const requestedFitMode = String(body.renderOverrides?.fitMode || "");
    const effectiveFitMode = allowedFitModes.includes(requestedFitMode)
      ? requestedFitMode
      : (allowedFitModes.includes(targetRenderPolicy.fitMode) ? targetRenderPolicy.fitMode : allowedFitModes[0] || "cover");
    const allowedFadeModes = renderPolicy.fade?.allowedModes || ["none"];
    const effectiveFadeMode = allowedFadeModes.includes(fadeMode)
      ? fadeMode
      : (renderPolicy.fade?.defaultMode || "none");
    const allowedPositions = [
      "left top", "center top", "right top",
      "left center", "center center", "right center",
      "left bottom", "center bottom", "right bottom",
    ];
    const requestedPosition = String(body.renderOverrides?.position || "");
    const effectiveRenderPolicy = {
      fitMode: effectiveFitMode,
      backgroundSize: backgroundSizeForFitMode(effectiveFitMode),
      position: allowedPositions.includes(requestedPosition)
        ? requestedPosition
        : String(targetRenderPolicy.position || "center center"),
      repeat: String(targetRenderPolicy.repeat || "no-repeat"),
      focalPoint: targetRenderPolicy.focalPoint || { x: 50, y: 50 },
      fadeMode: effectiveFadeMode,
      fadeStrength: String(body.renderOverrides?.fadeStrength || renderPolicy.fade?.defaultStrength || "medium"),
      fadeStops: renderPolicy.fade?.stops || {},
      allowedFitModes,
      allowedFadeModes,
    };
    const tokenValuesHash = inputHash(tokenSet.values || []);
    const executionContract = {
      hashContractVersion: HASH_CONTRACT_VERSION,
      requestMode,
      target: requestMode === "assets"
        ? targetResolution.constraints.imageTarget
        : { type: "layout", sectionKey },
      template: snapshot.template,
      sectionKey,
      sectionVersion: section.sectionVersion,
      layoutRevision: layout.layoutRevision,
      componentVersions: (section.items || []).map((item) => ({
        itemKey: item.itemKey, componentVersionId: item.componentVersionId, version: item.componentVersion,
      })),
      prompt: {
        id: promptSnapshot.promptConfig.promptId,
        version: promptSnapshot.promptConfig.promptVersion,
        hash: promptSnapshot.promptConfig.renderedPromptHash,
      },
      tokenSetVersionId: designTokenSetVersionId,
      tokenValuesHash,
      options: {
        generationRequestId,
        backgroundColor,
        fadeMode,
        safeArea: requestedSafeArea,
        keyVisualTextPolicy,
        aspectRatio: effectiveAspectRatio,
        sourceGeometry: body.targetGeometry || null,
        effectiveGeometry: targetGeometry,
        renderPolicy: effectiveRenderPolicy,
      },
      sectionInputs,
    };
    const executionKey = inputHash(executionContract);
    const hash = inputHash({ snapshot, constraints, executionContract });
    const result = await createRun(sql, {
      promoRunId: body.promoRunId || null,
      formTemplateId,
      templateKey: template.templateKey,
      templateVersion: template.version,
      layoutRevision: layout.layoutRevision,
      sectionKey,
      inputSnapshot: snapshot,
      inputHash: hash,
      executionKey,
      hashContractVersion: HASH_CONTRACT_VERSION,
      promptSnapshot,
      tokenValuesHash,
      constraintsSnapshot: constraints,
      requestMode,
      componentVersionsSnapshot: (section.items || []).map((item) => ({
        itemKey: item.itemKey, componentId: item.componentId,
        componentVersionId: item.componentVersionId, version: item.componentVersion,
      })),
      tokenSetVersionId: designTokenSetVersionId,
      baseRevision: {
        templateVersion: template.version, sectionVersion: section.sectionVersion,
        layoutRevision: layout.layoutRevision, tokenSetVersionId: designTokenSetVersionId,
      },
    });
    let run = result.run;
    if (requestMode === "assets" && run.status === "queued") {
      const imageTarget = constraints.imageTarget;
      const requestSnapshot = {
        prompt: promptSnapshot.promptConfig.renderedPrompt,
        safeArea: imageTarget.type === "item" ? "none" : requestedSafeArea,
        fadeMode,
        aspectRatio: effectiveAspectRatio,
        sourceGeometry: body.targetGeometry || null,
        effectiveGeometry: targetGeometry,
        effectiveRenderPolicy,
        targetType: imageTarget.type,
        itemKey: imageTarget.type === "item" ? imageTarget.itemKey : null,
        componentInstanceId: imageTarget.type === "item" ? targetItem?.id || null : null,
        targetFieldKey: imageTarget.type === "item" ? targetField?.fieldKey || imageTarget.itemKey : null,
        keyVisualTextPolicy,
        promptConfig: {
          snapshotVersion: promptSnapshot.promptConfig.snapshotVersion,
          promptType: promptSnapshot.promptConfig.promptType,
          promptId: promptSnapshot.promptConfig.promptId,
          promptVersion: promptSnapshot.promptConfig.promptVersion,
          renderedPromptHash: promptSnapshot.promptConfig.renderedPromptHash,
          provider: promptSnapshot.promptConfig.provider,
          model: promptSnapshot.promptConfig.model,
          modelOptions: promptSnapshot.promptConfig.modelOptions,
          temperature: promptSnapshot.promptConfig.temperature,
          maxTokens: promptSnapshot.promptConfig.maxTokens,
          responseFormat: promptSnapshot.promptConfig.responseFormat,
          runtimeConfig: promptSnapshot.promptConfig.runtimeConfig,
          harnessConfig: promptSnapshot.promptConfig.harnessConfig,
          modelCapabilitySnapshot: promptSnapshot.promptConfig.modelCapabilitySnapshot,
          safetyContract: promptSnapshot.promptConfig.safetyContract,
          policySchemaVersion: promptSnapshot.promptConfig.policySchemaVersion,
          generationPolicy: promptSnapshot.promptConfig.generationPolicy,
          renderPolicy: promptSnapshot.promptConfig.renderPolicy,
          validationPolicy: promptSnapshot.promptConfig.validationPolicy,
          effectiveAspectRatio,
        },
      };
      await sql`
        insert into promo_section_design_asset_jobs (
          run_id, target_type, target_item_key, component_instance_id, target_field_key,
          request_snapshot, next_retry_at, max_attempts
        ) values (
          ${run.id}::uuid, ${imageTarget.type}, ${imageTarget.type === "item" ? imageTarget.itemKey : null},
          ${imageTarget.type === "item" ? targetItem?.id || null : null}::uuid,
          ${imageTarget.type === "item" ? targetField?.fieldKey || imageTarget.itemKey : null},
          ${JSON.stringify(requestSnapshot)}::jsonb, now(),
          ${Number(promptSnapshot.promptConfig.runtimeConfig?.maxAttempts || 3)}
        ) on conflict do nothing
      `;
      run = await transitionRun(sql, run.id, ["queued"], "generating_assets", {
        effectivePatch: { contractVersion: 2, assetOnly: true, assetRequests: [requestSnapshot] },
      }) || await fetchRun(sql, run.id);
    }
    return res.status(result.reused ? 200 : 202).json({ ok: true, reused: result.reused, run });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: "Section design run API failed", message: error.message });
  }
};
