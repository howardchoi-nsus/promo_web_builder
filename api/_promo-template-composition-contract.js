const ALLOWED_OVERVIEW_PATHS = Object.freeze([
  "title",
  "promotionPurpose",
  "promotionPurposeOther",
  "market",
  "audience",
  "campaignTone",
  "mainOffer",
  "primaryAction.label",
  "primaryAction.url",
]);

function compositionSchema(candidateStructures) {
  const templateIds = candidateStructures.map((template) => template.templateId);
  const sectionIds = candidateStructures.flatMap((template) => template.sections.map((section) => section.sectionId));
  const componentVersionIds = candidateStructures.flatMap((template) => (
    template.sections.flatMap((section) => section.componentVersionIds)
  ));
  return {
    type: "object",
    additionalProperties: false,
    required: ["templateId", "sections", "missingInputs", "warnings", "summary"],
    properties: {
      templateId: { type: "string", enum: templateIds },
      sections: {
        type: "array",
        minItems: 1,
        maxItems: 30,
        items: {
          type: "object",
          additionalProperties: false,
          required: ["sectionId", "componentVersionIds", "contentMappings", "layoutCommands"],
          properties: {
            sectionId: { type: "string", enum: sectionIds },
            componentVersionIds: {
              type: "array",
              maxItems: 50,
              items: { type: "string", enum: componentVersionIds },
            },
            contentMappings: {
              type: "array",
              maxItems: 100,
              items: {
                type: "object",
                additionalProperties: false,
                required: ["itemKey", "sourceOverviewPath"],
                properties: {
                  itemKey: { type: "string", maxLength: 200 },
                  sourceOverviewPath: { type: "string", enum: ALLOWED_OVERVIEW_PATHS },
                },
              },
            },
            layoutCommands: {
              type: "array",
              maxItems: 0,
              items: {
                type: "object",
                additionalProperties: false,
                properties: {},
                required: [],
              },
            },
          },
        },
      },
      missingInputs: {
        type: "array",
        maxItems: 30,
        items: { type: "string", maxLength: 200 },
      },
      warnings: {
        type: "array",
        maxItems: 30,
        items: { type: "string", maxLength: 300 },
      },
      summary: { type: "string", maxLength: 800 },
    },
  };
}

function validateCompositionProposal(proposal, candidateStructures) {
  const template = candidateStructures.find((item) => item.templateId === proposal?.templateId);
  if (!template) throw new Error("Composition selected a template outside the active candidate set");
  const sectionsById = new Map(template.sections.map((section) => [section.sectionId, section]));
  const seenSections = new Set();
  const sections = (Array.isArray(proposal.sections) ? proposal.sections : []).map((planned) => {
    const allowed = sectionsById.get(planned.sectionId);
    if (!allowed || seenSections.has(planned.sectionId)) {
      throw new Error("Composition contains an unavailable or duplicate section");
    }
    seenSections.add(planned.sectionId);
    const componentIds = Array.from(new Set(planned.componentVersionIds || []));
    if (componentIds.some((id) => !allowed.componentVersionIds.includes(id))) {
      throw new Error("Composition contains a component outside the selected section");
    }
    const itemKeys = new Set(allowed.items.map((item) => item.itemKey));
    const contentMappings = (planned.contentMappings || []).map((mapping) => {
      if (!itemKeys.has(mapping.itemKey) || !ALLOWED_OVERVIEW_PATHS.includes(mapping.sourceOverviewPath)) {
        throw new Error("Composition contains an invalid content mapping");
      }
      return {
        itemKey: mapping.itemKey,
        sourceOverviewPath: mapping.sourceOverviewPath,
      };
    });
    if ((planned.layoutCommands || []).length) {
      throw new Error("Free-form layout commands are not allowed in the initial composition draft");
    }
    return {
      sectionId: allowed.sectionId,
      sectionKey: allowed.sectionKey,
      sectionName: allowed.sectionName,
      componentVersionIds: componentIds,
      contentMappings,
      layoutCommands: [],
    };
  });
  template.sections.filter((section) => section.fixedPosition).forEach((section) => {
    if (!seenSections.has(section.sectionId)) {
      throw new Error(`Fixed-position section is required: ${section.sectionKey}`);
    }
  });
  if (!sections.length) throw new Error("Composition requires at least one section");
  return {
    templateId: template.templateId,
    templateKey: template.templateKey,
    templateVersion: template.templateVersion,
    templateName: template.templateName,
    sections,
    missingInputs: Array.isArray(proposal.missingInputs) ? proposal.missingInputs.slice(0, 30) : [],
    warnings: Array.isArray(proposal.warnings) ? proposal.warnings.slice(0, 30) : [],
    summary: String(proposal.summary || "").trim().slice(0, 800),
  };
}

module.exports = {
  ALLOWED_OVERVIEW_PATHS,
  compositionSchema,
  validateCompositionProposal,
};
