const { getSql } = require("./_item-components-store");
const { resolveAdminOwner } = require("./_promo-admin-auth");
const { requireBuilderFlag } = require("./_promo-builder-flags");
const { layoutReferenceReadiness } = require("./_reference-component-readiness");
const { UUID_PATTERN } = require("./_reference-component-publishing");

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    res.setHeader("Cache-Control", "private, no-store");
    requireBuilderFlag("referenceComponentPublishing");
    resolveAdminOwner(req, res);
    const componentVersionId = String(req.query?.componentVersionId || "").trim();
    if (!UUID_PATTERN.test(componentVersionId)) {
      return res.status(400).json({ error: "componentVersionId must be a UUID", code: "COMPONENT_VERSION_ID_INVALID" });
    }
    const sql = getSql();
    const versionRows = await sql`
      select component.id::text as component_id, component.name, component.system_seed_code,
        version.id::text as version_id, version.placement_policy, version.capabilities
      from wizard_item_component_versions version
      join wizard_item_components component on component.id = version.component_id
      where version.id = ${componentVersionId}::uuid limit 1
    `;
    if (!versionRows.length) return res.status(404).json({ error: "Component version not found", code: "COMPONENT_VERSION_NOT_FOUND" });
    const allowedRoles = Array.isArray(versionRows[0].placement_policy?.allowedSectionRoles)
      ? versionRows[0].placement_policy.allowedSectionRoles.map(String)
      : [];
    const deniedRoles = Array.isArray(versionRows[0].placement_policy?.deniedSectionRoles)
      ? versionRows[0].placement_policy.deniedSectionRoles.map(String)
      : [];
    const sectionRows = await sql`
      select section.id::text, section.section_key, section.name, section.section_role,
        section.composition_scope, layout.id::text as layout_id, layout.layout_key,
        layout.name as layout_name, layout.is_default
      from wizard_content_sections section
      left join wizard_content_section_layouts layout on layout.section_id = section.id
      where section.status = 'active'
        and section.is_visible_in_wizard = true
        and section.composition_scope in ('registry', 'shared')
      order by section.sort_order, section.section_key, layout.is_default desc, layout.created_at
    `;
    const sectionMap = new Map();
    for (const row of sectionRows) {
      if ((allowedRoles.length && !allowedRoles.includes(row.section_role)) || deniedRoles.includes(row.section_role)) continue;
      if (!sectionMap.has(row.id)) sectionMap.set(row.id, {
        id: row.id,
        sectionKey: row.section_key,
        name: row.name,
        sectionRole: row.section_role,
        compositionScope: row.composition_scope,
        layouts: [],
      });
      if (row.layout_id) sectionMap.get(row.id).layouts.push({
        id: row.layout_id,
        layoutKey: row.layout_key,
        name: row.layout_name,
        isDefault: Boolean(row.is_default),
      });
    }
    const referenceRows = await sql`
      select id::text, title, source_site, status, copyright_reviewed, research_only,
        quality_score, layout_spec, design_summary
      from promo_layout_references
      where status <> 'archived'
      order by quality_score desc, updated_at desc
      limit 200
    `;
    const references = referenceRows.map((row) => {
      const reference = {
        id: row.id,
        title: row.title,
        sourceSite: row.source_site,
        status: row.status,
        copyrightReviewed: Boolean(row.copyright_reviewed),
        researchOnly: Boolean(row.research_only),
        qualityScore: Number(row.quality_score || 0),
        layoutSpec: row.layout_spec || {},
        designSummary: row.design_summary || "",
      };
      return { ...reference, plannerReadiness: layoutReferenceReadiness(reference) };
    });
    return res.status(200).json({
      ok: true,
      component: {
        id: versionRows[0].component_id,
        name: versionRows[0].name,
        systemSeedCode: versionRows[0].system_seed_code,
        versionId: versionRows[0].version_id,
        referenceDerived: String(versionRows[0].system_seed_code || "").startsWith("ref-pattern-")
          || versionRows[0].capabilities?.referenceDerived === true,
      },
      sections: [...sectionMap.values()],
      references,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      error: "Reference component publish options failed",
      code: error.code || "REFERENCE_COMPONENT_PUBLISH_OPTIONS_FAILED",
      message: error.message,
    });
  }
};
