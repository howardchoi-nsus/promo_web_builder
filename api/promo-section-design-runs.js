const { fetchTemplateWithItems, fetchLayoutRow, toLayout } = require("./_wizard-form-template-layout-store");
const { toFormTemplate } = require("./_wizard-form-templates-store");
const { getSql, parseBody, fetchRun, createRun } = require("./_promo-section-design-store");
const {
  inputHash, hasAnalyzableContent, analyzableSectionContent, defaultConstraints, normalizeBackgroundColor,
  resolveImageTarget,
} = require("./_promo-section-design-contract");

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
    let constraints = defaultConstraints(section, layout.layoutSpec);
    if (!constraints.enabled) return res.status(403).json({ error: "AI design generation is disabled for this section" });
    if (!constraints.allowedLayoutVariants.length) return res.status(422).json({ error: "No AI layout variant is allowed for this section" });
    const targetItemKey = String(body.targetItemKey || "").trim();
    const targetResolution = resolveImageTarget(constraints, sectionKey, targetItemKey);
    if (!targetResolution.ok) {
      return res.status(422).json({
        error: targetItemKey
          ? "Requested AI image Item is not allowed for this section"
          : "No valid AI image target is configured for this section",
      });
    }
    constraints = targetResolution.constraints;
    const backgroundColor = normalizeBackgroundColor(
      body.backgroundColor,
      normalizeBackgroundColor(layout.layoutSpec?.theme?.backgroundColor)
    );
    const snapshot = {
      template: { id: template.id, templateKey: template.templateKey, version: template.version },
      layoutRevision: layout.layoutRevision,
      design: { backgroundColor },
      section: {
        sectionKey,
        name: section.name || section.sectionName || sectionKey,
        items: (section.items || []).map((item) => ({
          itemKey: item.itemKey, name: item.name, fieldKind: item.fieldKind,
          isLocked: item.isLocked, isVisibleInWizard: item.isVisibleInWizard,
        })),
        sectionInputs,
        aiContent,
      },
    };
    const hash = inputHash({ snapshot, constraints });
    const result = await createRun(sql, {
      promoRunId: body.promoRunId || null,
      formTemplateId,
      templateVersion: template.version,
      layoutRevision: layout.layoutRevision,
      sectionKey,
      inputSnapshot: snapshot,
      inputHash: hash,
      constraintsSnapshot: constraints,
    });
    return res.status(result.reused ? 200 : 202).json({ ok: true, reused: result.reused, run: result.run });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: "Section design run API failed", message: error.message });
  }
};
