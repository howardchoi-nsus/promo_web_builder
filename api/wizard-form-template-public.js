const { getSql, fetchTemplateRow, fetchTemplateSections, toFormTemplate } = require("./_wizard-form-templates-store");
const { fetchItemsForSection, normalizeAiDesign } = require("./_wizard-content-sections-store");
const { fetchLayoutRow, toLayout, createLayoutIdentity } = require("./_wizard-form-template-layout-store");

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    res.setHeader("Cache-Control", "no-store");
    const id = String(req.query.id || "").trim();
    if (!id) return res.status(400).json({ error: "id is required" });
    const sql = getSql();
    const row = await fetchTemplateRow(sql, id);
    if (!row || row.status !== "active") return res.status(404).json({ error: "Active form template not found" });
    const template = toFormTemplate(row);
    const memberships = (await fetchTemplateSections(sql, id)).filter((section) => section.isVisible && section.sectionId);
    const sections = [];
    const configurationWarnings = [];
    for (const membership of memberships) {
      const items = (await fetchItemsForSection(sql, membership.sectionId)).filter((item) => item.isVisibleInWizard);
      if (!items.length) {
        configurationWarnings.push({
          code: "VISIBLE_SECTION_WITHOUT_ITEMS",
          sectionKey: membership.sectionKey,
          message: `${membership.sectionName || membership.sectionKey} has no Wizard-visible items.`,
        });
        continue;
      }
      sections.push({
        sectionId: membership.sectionId,
        sectionKey: membership.sectionKey,
        name: membership.sectionName,
        description: membership.sectionDescription,
        sortOrder: membership.sortOrder,
        isRequired: membership.isRequired,
        userReorderAllowed: membership.userReorderAllowed,
        fixedPosition: membership.fixedPosition,
        aiDesign: normalizeAiDesign(membership.aiDesign),
        items,
      });
    }
    const revision = [template.id, template.version, template.updatedAt, ...sections.flatMap((section) => [
      section.sectionId, section.sectionKey, JSON.stringify(section.aiDesign),
      ...section.items.map((item) => `${item.id}:${item.componentVersionId}:${item.updatedAt || ""}`),
    ])].join("|");
    const layout = toLayout(await fetchLayoutRow(sql, id));
    return res.status(200).json({
      ok: true,
      template: {
        id: template.id,
        templateKey: template.templateKey,
        name: template.name,
        description: template.description,
        version: template.version,
        isDefault: template.isDefault,
      },
      configRevision: revision,
      layoutRevision: layout.layoutRevision,
      renderer: { key: layout.rendererKey, version: layout.rendererVersion },
      layoutIdentity: createLayoutIdentity(template, layout, revision),
      defaultLayout: layout.layoutSpec,
      defaultContent: layout.defaultContent,
      sections,
      configurationWarnings,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: "Public Wizard form template API failed", message: error.message });
  }
};
