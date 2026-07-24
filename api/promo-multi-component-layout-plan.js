const { fetchTemplateWithItems } = require("./_wizard-form-template-layout-store");
const { getSql, parseBody } = require("./_promo-section-design-store");
const { analyzableSectionContent } = require("./_promo-section-design-contract");
const { createPromptExecutionSnapshot } = require("./_prompt-execution-snapshot");
const { generateMultiComponentLayoutPlan } = require("./_promo-section-design-provider");

const ALLOWED_OPERATIONS = Object.freeze([
  "align-left", "align-center", "align-right",
  "align-top", "align-middle", "align-bottom",
  "distribute-horizontal", "distribute-vertical",
  "equal-width", "equal-height", "set-gap",
  "group-stack-horizontal", "group-stack-vertical",
]);
const GAP_TOKENS = Object.freeze(["space-2", "space-3", "space-4", "space-6", "space-8"]);

function normalizeGeometry(value, selectedKeys) {
  const list = Array.isArray(value) ? value : [];
  const selected = new Set(selectedKeys);
  const seen = new Set();
  const normalized = list.map((entry) => {
    const itemKey = String(entry?.itemKey || "").trim();
    const xPct = Number(entry?.xPct);
    const yPx = Number(entry?.yPx);
    const widthPct = Number(entry?.widthPct);
    const heightPx = Number(entry?.heightPx);
    if (!selected.has(itemKey) || seen.has(itemKey)) throw Object.assign(new Error("Geometry contains an unknown or duplicate item key"), { statusCode: 422 });
    if (![xPct, yPx, widthPct, heightPx].every(Number.isFinite)) throw Object.assign(new Error("Geometry values must be finite numbers"), { statusCode: 422 });
    if (xPct < 0 || yPx < 0 || widthPct < 0.01 || heightPx < 1 || xPct + widthPct > 100.01 || yPx > 1200) {
      throw Object.assign(new Error("Geometry is outside the supported section bounds"), { statusCode: 422 });
    }
    seen.add(itemKey);
    return {
      itemKey,
      xPct: Math.round(xPct * 1000) / 1000,
      yPx: Math.round(yPx * 1000) / 1000,
      widthPct: Math.round(widthPct * 1000) / 1000,
      heightPx: Math.round(heightPx * 1000) / 1000,
    };
  });
  if (normalized.length !== selectedKeys.length || seen.size !== selectedKeys.length) {
    throw Object.assign(new Error("Geometry is required for every selected component"), { statusCode: 422 });
  }
  return normalized;
}

function sameKeys(left, right) {
  return [...left].sort().join("\n") === [...right].sort().join("\n");
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    res.setHeader("Cache-Control", "no-store");
    const body = parseBody(req.body);
    const formTemplateId = String(body.formTemplateId || "").trim();
    const sectionKey = String(body.sectionKey || "").trim();
    const selectedItemKeys = [...new Set(
      (Array.isArray(body.selectedItemKeys) ? body.selectedItemKeys : [])
        .map((item) => String(item || "").trim())
        .filter(Boolean)
    )];
    if (!formTemplateId || !sectionKey) return res.status(400).json({ error: "formTemplateId and sectionKey are required" });
    if (selectedItemKeys.length < 2 || selectedItemKeys.length > 12) {
      return res.status(422).json({ error: "Select between 2 and 12 components from one section" });
    }

    const sql = getSql();
    const templateData = await fetchTemplateWithItems(sql, formTemplateId);
    if (!templateData || !["active", "draft"].includes(templateData.template.status)) {
      return res.status(404).json({ error: "Form template not found" });
    }
    const section = templateData.sections.find((candidate) => candidate.sectionKey === sectionKey && candidate.isVisible !== false);
    if (!section) return res.status(404).json({ error: "Template section not found" });
    const itemsByKey = new Map((section.items || []).map((item) => [item.itemKey, item]));
    const selectedItems = selectedItemKeys.map((key) => itemsByKey.get(key));
    if (selectedItems.some((item) => !item)) return res.status(422).json({ error: "Selected component does not belong to this section" });
    if (selectedItems.some((item) => item.isLocked)) return res.status(422).json({ error: "Locked components cannot be included" });

    const geometry = normalizeGeometry(body.geometry, selectedItemKeys);
    const sectionInputs = body.sectionInputs && typeof body.sectionInputs === "object" ? body.sectionInputs : {};
    const content = analyzableSectionContent(section, sectionInputs);
    const promptSnapshot = await createPromptExecutionSnapshot(sql, "multi_component_layout_planner", {
      sectionJson: JSON.stringify({ sectionKey, name: section.name || sectionKey }),
      selectionJson: JSON.stringify(selectedItems.map((item) => ({
        itemKey: item.itemKey,
        name: item.name,
        fieldKind: item.fieldKind,
        componentKey: item.componentKey || null,
      }))),
      geometryJson: JSON.stringify(geometry),
      contentJson: JSON.stringify(content),
      allowedOperationsJson: JSON.stringify(ALLOWED_OPERATIONS),
      gapTokensJson: JSON.stringify(GAP_TOKENS),
    });
    const generation = await generateMultiComponentLayoutPlan({ promptConfig: promptSnapshot.promptConfig });
    const plan = generation.result || {};
    if (!ALLOWED_OPERATIONS.includes(plan.operation)) {
      return res.status(422).json({ error: "Planner returned an unsupported operation" });
    }
    if (!Array.isArray(plan.targetItemKeys) || !sameKeys(plan.targetItemKeys, selectedItemKeys)) {
      return res.status(422).json({ error: "Planner changed the selected component scope" });
    }
    if (plan.gapToken !== null && !GAP_TOKENS.includes(plan.gapToken)) {
      return res.status(422).json({ error: "Planner returned an unsupported gap token" });
    }
    if (plan.axis !== null && !["horizontal", "vertical"].includes(plan.axis)) {
      return res.status(422).json({ error: "Planner returned an unsupported layout axis" });
    }
    return res.status(200).json({
      ok: true,
      suggestion: {
        operation: plan.operation,
        targetItemKeys: selectedItemKeys,
        axis: plan.axis || null,
        gapToken: plan.gapToken || null,
        rationale: String(plan.rationale || "").trim(),
      },
      prompt: {
        id: promptSnapshot.promptConfig.promptId,
        version: promptSnapshot.promptConfig.promptVersion,
        hash: promptSnapshot.promptConfig.renderedPromptHash,
      },
      provider: generation.provider,
      usage: generation.usage,
    });
  } catch (error) {
    return res.status(error.statusCode >= 400 && error.statusCode < 500 ? error.statusCode : 502).json({
      error: "Multi-component layout planning failed",
      message: error.message,
    });
  }
};

module.exports.ALLOWED_OPERATIONS = ALLOWED_OPERATIONS;
module.exports.GAP_TOKENS = GAP_TOKENS;
module.exports.normalizeGeometry = normalizeGeometry;
