const { parseBody } = require("./_wizard-form-templates-store");
const { createPromptExecutionSnapshot } = require("./_prompt-execution-snapshot");
const { generateStructuredPlannerResult } = require("./_promo-section-design-provider");
const { resolveBuilderOwner } = require("./_promo-builder-auth");
const {
  getSql,
  fetchDocument,
  applyOperations,
} = require("./_promo-builder-document-store");
const {
  compositionOperationSchema,
  validateCompositionOperations,
  applyCompositionOperations,
} = require("./_promo-page-composition-operations");
const {
  enqueueBuilderAssetJobs,
  scheduleBuilderAssetJobs,
} = require("./_promo-builder-assets");
const { requireBuilderFlag } = require("./_promo-builder-flags");

async function fetchMotionPresets(sql) {
  const rows = await sql`
    select preset.preset_key, version.id::text as preset_version_id,
      version.config_json
    from promo_motion_presets preset
    join promo_motion_preset_versions version
      on version.preset_id = preset.id and version.status = 'active'
    where preset.status = 'active'
    order by preset.preset_key
  `;
  return rows.map((row) => ({
    presetKey: row.preset_key,
    presetVersionId: row.preset_version_id,
    config: row.config_json || {},
  }));
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    requireBuilderFlag("naturalLanguageEdit");
    res.setHeader("Cache-Control", "no-store");
    const owner = resolveBuilderOwner(req, res);
    const body = parseBody(req.body);
    const action = body.action === "apply" ? "apply" : "propose";
    const documentId = String(body.documentId || "").trim();
    const baseDocumentRevision = Number(body.baseDocumentRevision || 0);
    if (!documentId || !String(body.idempotencyKey || "").trim()) {
      return res.status(400).json({ error: "documentId and idempotencyKey are required" });
    }
    const sql = getSql();
    const loaded = await fetchDocument(sql, documentId, owner.ownerSubject);
    if (!loaded) return res.status(404).json({ error: "Builder document not found" });
    if (loaded.document.currentDocumentRevision !== baseDocumentRevision) {
      return res.status(409).json({
        error: "Builder document revision changed",
        code: "DOCUMENT_REVISION_MISMATCH",
      });
    }
    const motionPresets = await fetchMotionPresets(sql);
    if (action === "propose") {
      const instruction = String(body.instruction || "").trim().slice(0, 3000);
      if (!instruction) return res.status(400).json({ error: "instruction is required" });
      const prompt = await createPromptExecutionSnapshot(sql, "promo_composition_editor", {
        instruction,
        currentSnapshotJson: JSON.stringify(loaded.snapshot),
        allowedOperationsJson: JSON.stringify({
          operationTypes: [
            "update-field", "set-visibility", "move-section", "move-component",
            "change-layout-variant", "change-token-binding",
            "change-motion-preset", "request-asset-regeneration",
          ],
          motionPresets,
        }),
      });
      const generation = await generateStructuredPlannerResult({
        type: "promo_composition_editor",
        schemaName: "promo_composition_operations",
        schema: compositionOperationSchema(loaded.snapshot, motionPresets),
        promptConfig: prompt.promptConfig,
      });
      const validated = validateCompositionOperations(generation.result, loaded.snapshot, motionPresets);
      return res.status(200).json({
        ok: true,
        action: "propose",
        baseDocumentRevision,
        operations: validated.operations,
        summary: validated.summary,
        warnings: validated.warnings,
        autoApplicable: validated.warnings.length === 0,
      });
    }
    const validated = validateCompositionOperations({
      operations: body.operations,
      summary: body.summary || "",
      warnings: [],
    }, loaded.snapshot, motionPresets);
    if (!validated.operations.length) return res.status(422).json({ error: "At least one operation is required" });
    const nextSnapshot = applyCompositionOperations(loaded.snapshot, validated.operations);
    const applied = await applyOperations(sql, {
      documentId,
      ownerSubject: owner.ownerSubject,
      baseDocumentRevision,
      snapshot: nextSnapshot,
      operations: validated.operations,
      changeNote: validated.summary || "Natural-language composition edit applied.",
    });
    const assetJobs = await enqueueBuilderAssetJobs(sql, {
      documentId,
      documentRevision: applied.revision,
      snapshot: applied.snapshot,
    });
    scheduleBuilderAssetJobs(assetJobs);
    return res.status(200).json({
      ok: true,
      action: "apply",
      documentId,
      revision: applied.revision,
      snapshot: applied.snapshot,
      operations: validated.operations,
      assetJobs,
    });
  } catch (error) {
    const status = /access denied/i.test(error.message) ? 403
      : /revision conflict/i.test(error.message) ? 409
        : error.statusCode || (String(error.code || "").startsWith("INVALID") ? 422 : 500);
    return res.status(status).json({
      error: "Composition operation failed",
      code: error.code || null,
      message: error.message,
    });
  }
};

module.exports.fetchMotionPresets = fetchMotionPresets;
